"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateTelegramLink, sendMessage } from "./telegram-logic";

const SYSTEM_SALON_EMAIL = "info@beautynails.com";

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
        emailVerified: true, // Boolean, як вимагає твоя схема
        image: "/logo.png",
      },
    });
  }
  return systemUser;
}

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

  revalidatePath("/dashboard/settings");
  return { success: true };
}

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
        AND: [
          { telegramChatId: { not: null } },
          { telegramChatId: { not: "" } },
        ],
      },
    });

    if (clients.length === 0) return { error: "Немає підключених клієнтів." };

    const salon = await ensureSystemUser();
    let successCount = 0;

    const sendPromises = clients.map(async (client) => {
      try {
        await sendMessage(client.telegramChatId!, text);
        successCount++;
        await prisma.message.create({
          data: { text, senderId: salon.id, receiverId: client.id },
        });
      } catch (e) {
        console.error(e);
      }
    });

    await Promise.allSettled(sendPromises);
    return { success: true, count: successCount };
  } catch (error) {
    return { error: "Помилка розсилки" };
  }
}

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
      message = `✨ *Вітаємо!* \nВи записані на *${app.service.name}*.\n📅 ${date} о ${time}`;
    } else if (type === "CONFIRMED") {
      message = `✅ *Запис підтверджено!*\nЧекаємо на Вас *${date}* о *${time}*.`;
    } else if (type === "CANCELLED") {
      message = `❌ *Запис скасовано*\nВаш візит на *${date}* о *${time}* скасовано.`;
    }

    if (app.client.notifyAppointments) {
      await sendMessage(app.client.telegramChatId, message);
    }

    const salon = await ensureSystemUser();
    await prisma.message.create({
      data: {
        text: message.replace(/\*/g, ""),
        senderId: salon.id,
        receiverId: app.client.id,
      },
    });
  } catch (error) {
    console.error(error);
  }
}
