import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Допоміжна функція для зміни повідомлення (щоб зірочки зникли після натискання)
async function editMessageText(
  chatId: string,
  messageId: number,
  text: string,
) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text: text,
      parse_mode: "Markdown",
    }),
  });
}

// Допоміжна функція для відправки нового повідомлення
async function sendMessage(chatId: string, text: string) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown",
    }),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ==========================================
    // СЦЕНАРІЙ 1: Клієнт натиснув кнопку-зірочку
    // ==========================================
    if (body.callback_query) {
      const callbackQuery = body.callback_query;
      const data = callbackQuery.data; // Приходить у форматі: rate_IDЗАПИСУ_5
      const chatId = callbackQuery.message.chat.id.toString();
      const messageId = callbackQuery.message.message_id;

      if (data.startsWith("rate_")) {
        const parts = data.split("_");
        const appointmentId = parts[1];
        const rating = parseInt(parts[2]);

        // Знаходимо користувача за його Telegram ID
        const user = await prisma.user.findUnique({
          where: { telegramChatId: chatId },
        });

        if (user) {
          // Запобіжник: перевіряємо, чи немає вже відгуку (щоб не клацали двічі)
          const existingReview = await prisma.review.findUnique({
            where: { appointmentId },
          });

          if (existingReview) {
            await editMessageText(
              chatId,
              messageId,
              "Ви вже залишили відгук для цього візиту. Дякуємо! 🌸",
            );
          } else {
            // 1. Створюємо відгук у базі
            const review = await prisma.review.create({
              data: { rating, appointmentId },
            });

            // 2. Оновлюємо загальний рейтинг майстра
            const app = await prisma.appointment.findUnique({
              where: { id: appointmentId },
            });
            if (app) {
              const allReviews = await prisma.review.findMany({
                where: { appointment: { masterId: app.masterId } },
              });
              const avgRating =
                allReviews.reduce((sum, rev) => sum + rev.rating, 0) /
                allReviews.length;

              await prisma.masterProfile.update({
                where: { id: app.masterId },
                data: {
                  rating: Number(avgRating.toFixed(1)),
                  reviewsCount: allReviews.length,
                },
              });
            }

            // 3. Ставимо "маячок", що тепер ми чекаємо текст від цього клієнта
            await prisma.user.update({
              where: { id: user.id },
              data: { expectingReviewFor: appointmentId },
            });

            // 4. Змінюємо старе повідомлення (ховаємо зірочки)
            const thanksMsg = `⭐️ Ви оцінили візит на *${rating}/5*.\n\nБажаєте залишити текстовий коментар? Просто напишіть його повідомленням сюди 👇\n\n*(Якщо ні — просто проігноруйте це повідомлення)*`;
            await editMessageText(chatId, messageId, thanksMsg);
          }
        }
      }

      // Обов'язкова відповідь Telegram, щоб кнопка перестала "світитися" як натиснута
      await fetch(`https://api.telegram.org/bot${TOKEN}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: callbackQuery.id }),
      });

      return NextResponse.json({ ok: true });
    }

    // ==========================================
    // СЦЕНАРІЙ 2: Клієнт надіслав текстовий коментар
    // ==========================================
    if (body.message && body.message.text) {
      const chatId = body.message.chat.id.toString();
      const text = body.message.text;

      // Шукаємо клієнта і перевіряємо, чи стоїть у нього наш "маячок"
      const user = await prisma.user.findUnique({
        where: { telegramChatId: chatId },
      });

      if (user && user.expectingReviewFor) {
        // Оновлюємо створений раніше відгук, додаючи туди текст
        await prisma.review.update({
          where: { appointmentId: user.expectingReviewFor },
          data: { comment: text },
        });

        // Очищаємо "маячок", щоб бот більше не сприймав його тексти як відгуки
        await prisma.user.update({
          where: { id: user.id },
          data: { expectingReviewFor: null },
        });

        // Дякуємо клієнту
        await sendMessage(
          chatId,
          "💖 Ваш відгук успішно збережено! Дякуємо, що допомагаєте нам ставати кращими.",
        );
      }
      return NextResponse.json({ ok: true });
    }

    // Завжди повертаємо 200 OK, щоб Telegram не спамив повторними запитами
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ ok: true });
  }
}
