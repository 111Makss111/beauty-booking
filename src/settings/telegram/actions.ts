"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import prisma from "@/lib/prisma";
import { generateTelegramLink } from "./telegram-logic";

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
    return {
      error: "Доступ заборонено. Тільки адміністратор може робити розсилку.",
    };
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return { error: "Токен бота не налаштовано в системі." };
  }

  try {
    const clients = await prisma.user.findMany({
      where: {
        telegramChatId: { not: null },
      },
      select: { telegramChatId: true },
    });

    if (clients.length === 0) {
      return { error: "Немає підключених клієнтів для розсилки." };
    }

    let successCount = 0;

    const sendPromises = clients.map(async (client) => {
      if (!client.telegramChatId) return;

      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: client.telegramChatId,
            text: text,
            parse_mode: "HTML",
          }),
        },
      );

      if (response.ok) {
        successCount++;
      }
    });

    await Promise.allSettled(sendPromises);

    await prisma.telegramBroadcast.create({
      data: {
        text: text,
        recipientCount: successCount,
      },
    });

    return { success: true, count: successCount };
  } catch (error) {
    console.error("Помилка масової розсилки Telegram:", error);
    return { error: "Сталася помилка при відправці повідомлень." };
  }
}
