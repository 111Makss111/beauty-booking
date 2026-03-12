import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendMessage } from "@/settings/telegram/telegram-logic";

export async function GET(req: Request) {
  try {
    // 1. Перевірка безпеки (Правило №42)
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    const now = new Date();
    // Вікна для перевірки: 24г та 2г (з невеликим запасом для точності)
    const in24h_Start = new Date(now.getTime() + 23.5 * 60 * 60 * 1000);
    const in24h_End = new Date(now.getTime() + 24.5 * 60 * 60 * 1000);
    const in2h_Start = new Date(now.getTime() + 1.7 * 60 * 60 * 1000);
    const in2h_End = new Date(now.getTime() + 2.3 * 60 * 60 * 1000);

    // Шукаємо тільки підтверджені записи
    const apps = await prisma.appointment.findMany({
      where: {
        status: "CONFIRMED",
        client: { telegramChatId: { not: null }, notifyAppointments: true },
      },
      include: { client: true, service: true },
    });

    let sentCount = 0;

    for (const app of apps) {
      const appTime = app.dateTime.getTime();
      let msg = "";

      // Перевірка 24 години
      if (appTime >= in24h_Start.getTime() && appTime <= in24h_End.getTime()) {
        msg = `🔔 *Нагадування!* \nЗавтра о *${app.dateTime.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}* чекаємо Вас на ${app.service.name}. До зустрічі! ✨`;
      }
      // Перевірка 2 години
      else if (
        appTime >= in2h_Start.getTime() &&
        appTime <= in2h_End.getTime()
      ) {
        msg = `⏰ *Чекаємо на Вас скоро!* \nВже за 2 години о *${app.dateTime.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}* у Вас візит на ${app.service.name}. 💖`;
      }

      if (msg && app.client.telegramChatId) {
        await sendMessage(app.client.telegramChatId, msg);
        sentCount++;
      }
    }

    return NextResponse.json({ success: true, sent: sentCount });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
