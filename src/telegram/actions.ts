"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import { PrismaClient } from "@prisma/client";
import { generateTelegramLink } from "./telegram-logic";

const prisma = new PrismaClient();

// 1. Отримуємо статус: чи підключений клієнт, його нік і посилання для кнопки
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
    isConnected: !!user.telegramChatId, // true, якщо є ID
    username: user.telegramUsername,
    link: link,
  };
}

// 2. Функція для кнопки "Вимкнути"
export async function disconnectTelegram() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "Не авторизовано" };

  await prisma.user.update({
    where: { email: session.user.email },
    data: { telegramChatId: null, telegramUsername: null },
  });

  return { success: true };
}
