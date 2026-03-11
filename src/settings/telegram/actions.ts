"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import prisma from "@/lib/prisma";
import { generateTelegramLink } from "./telegram-logic";
import { sendMessage } from "./telegram-logic";
export async function getTelegramData() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, telegramUsername: true, telegramChatId: true },
  });

  if (!user) return null;

  const link = await generateTelegramLink(user.id);

  return {
    isConnected: !!user.telegramChatId,
    username: user.telegramUsername,
    link: link,
  };
}

export async function disconnectTelegram() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "Не авторизовано" };

  await prisma.user.update({
    where: { email: session.user.email },
    data: { telegramChatId: null, telegramUsername: null },
  });

  return { success: true };
}

export async function sendBroadcastToClients(text: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== "ADMIN") {
    return { error: "Тільки адміністратор може робити розсилку." };
  }

  try {
    // Шукаємо клієнтів, у яких:
    // 1. Є Telegram
    // 2. УВІМКНЕНО тумблер промоакцій
    const clients = await prisma.user.findMany({
      where: {
        role: "CLIENT",
        notifyPromotions: true, // ОСЬ ЦЕЙ ФІЛЬТР
        telegramChatId: { not: null },
      },
      select: { id: true, telegramChatId: true },
    });

    if (clients.length === 0) {
      return { error: "Немає підключених клієнтів, які дозволили розсилку." };
    }

    let successCount = 0;
    const adminId = (
      await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      })
    )?.id;

    const sendPromises = clients.map(async (client) => {
      // А) Відправляємо в Telegram
      try {
        await sendMessage(client.telegramChatId!, text);
        successCount++;
      } catch (e) {
        console.error(`Помилка Telegram для ${client.id}:`, e);
      }

      // Б) Записуємо у внутрішній чат (завжди, щоб історія була в додатку)
      if (adminId) {
        await prisma.message.create({
          data: {
            text: text,
            senderId: adminId,
            receiverId: client.id,
          },
        });
      }
    });

    await Promise.allSettled(sendPromises);

    await prisma.telegramBroadcast.create({
      data: { text, recipientCount: successCount },
    });

    return { success: true, count: successCount };
  } catch (error) {
    console.error("Broadcast Error:", error);
    return { error: "Помилка при виконанні розсилки." };
  }
}

// 2. СИСТЕМНЕ СПОВІЩЕННЯ ПРО ЗАПИС (Створено/Підтверджено/Скасовано)
// Цю функцію ми будемо викликати при зміні статусу запису
export async function sendAppointmentNotification(
  clientId: string,
  text: string,
) {
  try {
    const client = await prisma.user.findUnique({
      where: { id: clientId },
      select: { id: true, telegramChatId: true, notifyAppointments: true },
    });

    if (!client) return;

    // КРОК 1: Завжди пишемо у внутрішній чат
    // (Від імені системи/адміна - тут треба знати ID адміна або зробити системного юзера)
    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });

    if (admin) {
      await prisma.message.create({
        data: {
          text: text,
          senderId: admin.id,
          receiverId: client.id,
        },
      });
    }

    // КРОК 2: Відправляємо в Telegram, тільки якщо клієнт дозволив
    if (client.telegramChatId && client.notifyAppointments) {
      await sendMessage(client.telegramChatId, text);
    }
  } catch (error) {
    console.error("Appointment Notification Error:", error);
  }
}
