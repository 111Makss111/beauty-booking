import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

interface TelegramUpdate {
  message?: {
    text?: string;
    chat: {
      id: number;
    };
    from: {
      username?: string;
      first_name: string;
    };
  };
}

export async function generateTelegramLink(userId: string) {
  const botUsername = process.env.TELEGRAM_BOT_USERNAME;
  return `https://t.me/${botUsername}?start=${userId}`;
}

export async function processTelegramUpdate(update: TelegramUpdate) {
  if (!update.message || !update.message.text) return;

  const chatId = update.message.chat.id.toString();
  const text = update.message.text;
  const username = update.message.from.username
    ? `@${update.message.from.username}`
    : update.message.from.first_name;

  if (text.startsWith("/start ")) {
    const userId = text.split(" ")[1];

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            telegramChatId: chatId,
            telegramUsername: username,
          },
        });

        await sendMessage(
          chatId,
          `✅ Вітаю, ${user.firstName}! Ваш акаунт Beauty Nails успішно підключено. Тепер ви будете отримувати сповіщення тут.`,
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export async function sendMessage(chatId: string, text: string) {
  try {
    await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });
  } catch (error) {
    console.error(error);
  }
}
