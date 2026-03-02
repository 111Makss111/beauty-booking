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

// --- ТЕСТОВА ЗОНА ---
export async function testDelayedNotification() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "Не авторизовано" };

  await new Promise((resolve) => setTimeout(resolve, 60000));

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { telegramChatId: true, notifyAppointments: true },
  });

  if (!user?.telegramChatId) {
    return { error: "Telegram не підключено" };
  }

  if (!user.notifyAppointments) {
    return { error: "Клієнт вимкнув сповіщення під час очікування" };
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const message =
    "🔔 Дзинь! Це тестове відкладене нагадування про запис. Ваш тумблер увімкнено!";

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: user.telegramChatId,
          text: message,
        }),
      },
    );

    if (!response.ok) {
      return { error: "Помилка відправки в Telegram" };
    }

    return { success: true };
  } catch (error) {
    return { error: "Помилка сервера при відправці" };
  }
}
// --- КІНЕЦЬ ТЕСТОВОЇ ЗОНИ ---
