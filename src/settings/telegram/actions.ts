"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateTelegramLink, sendMessage } from "./telegram-logic";

const SYSTEM_SALON_EMAIL = "info@beautynails.com";

/**
 * ГАРАНТІЯ НАЯВНОСТІ СИСТЕМНОГО АКАУНТА
 */
async function ensureSystemUser() {
  let systemUser = await prisma.user.findUnique({
    where: { email: SYSTEM_SALON_EMAIL },
  });

  if (!systemUser) {
    systemUser = await prisma.user.create({
      data: {
        email: SYSTEM_SALON_EMAIL,
        firstName: "Beauty",
        lastName: "Nails",
        role: "ADMIN",
        emailVerified: true,
        image: "/logo.png",
      },
    });
  }
  return systemUser;
}

/**
 * ОТРИМАННЯ СТАТУСУ ТЕЛЕГРАМ ДЛЯ КАБІНЕТУ
 */
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

/**
 * ВІДКЛЮЧЕННЯ ТЕЛЕГРАМ
 */
export async function disconnectTelegram() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "Не авторизовано" };

  await prisma.user.update({
    where: { email: session.user.email },
    data: { telegramChatId: null, telegramUsername: null },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

/**
 * МАСОВА РОЗСИЛКА КЛІЄНТАМ
 * Виправлено: використано AND для множинної перевірки одного поля
 */
export async function sendBroadcastToClients(text: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.role !== "ADMIN") {
    return { error: "Тільки адміністратор може робити розсилку." };
  }

  try {
    const clients = await prisma.user.findMany({
      where: {
        role: "CLIENT",
        notifyPromotions: true,
        // Правило №42: Використовуємо AND, щоб уникнути дублювання ключів
        AND: [
          { telegramChatId: { not: null } },
          { telegramChatId: { not: "" } },
        ],
      },
    });

    if (clients.length === 0) {
      return { error: "Немає підключених клієнтів з дозволом на розсилку." };
    }

    const admin = await ensureSystemUser();
    let successCount = 0;

    const sendPromises = clients.map(async (client) => {
      try {
        await sendMessage(client.telegramChatId!, text);
        successCount++;

        await prisma.message.create({
          data: { text, senderId: admin.id, receiverId: client.id },
        });
      } catch (e) {
        console.error(`Помилка розсилки для ${client.id}:`, e);
      }
    });

    await Promise.allSettled(sendPromises);

    return { success: true, count: successCount };
  } catch (error) {
    console.error("Broadcast Error:", error);
    return { error: "Помилка при виконанні розсилки." };
  }
}

/**
 * УНІВЕРСАЛЬНЕ СПОВІЩЕННЯ ПРО ЗАПИС
 */
export async function sendAppointmentUpdateNotification(
  appointmentId: string,
  type: "CREATED" | "CONFIRMED" | "CANCELLED",
) {
  try {
    const app = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        client: true,
        service: true,
        master: { include: { user: true } },
      },
    });

    if (!app || !app.client.telegramChatId) return;

    const date = new Date(app.dateTime).toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
    });
    const time = new Date(app.dateTime).toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });

    let message = "";
    if (type === "CREATED") {
      message = `✨ *Вітаємо, ${app.client.firstName}!* \n\nВи успішно записані на *${app.service.name}*.\n📅 Дата: ${date}\n⏰ Час: ${time}\n👤 Майстер: ${app.master.user.firstName}\n\nЗ нетерпінням чекаємо на зустріч! 💖`;
    } else if (type === "CONFIRMED") {
      message = `✅ *Запис підтверджено!*\n\nВаш візит на *${date}* о *${time}* успішно підтверджено. Послуга: ${app.service.name}. До зустрічі! ✨`;
    } else if (type === "CANCELLED") {
      message = `❌ *Запис скасовано*\n\nНа жаль, Ваш запис на *${date}* о *${time}* було скасовано. Якщо у Вас виникли питання — ми на зв'язку. 🌸`;
    }

    if (app.client.notifyAppointments) {
      await sendMessage(app.client.telegramChatId, message);
    }

    const admin = await ensureSystemUser();
    await prisma.message.create({
      data: {
        text: message.replace(/\*/g, ""),
        senderId: admin.id,
        receiverId: app.client.id,
      },
    });
  } catch (error) {
    console.error("Notification Error:", error);
  }
}
