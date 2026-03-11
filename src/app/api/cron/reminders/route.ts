import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendMessage } from "@/settings/telegram/telegram-logic";

export async function GET() {
  try {
    const now = new Date();
    const in24h_Start = new Date(now.getTime() + 23.5 * 60 * 60 * 1000);
    const in24h_End = new Date(now.getTime() + 24.5 * 60 * 60 * 1000);
    const in2h_Start = new Date(now.getTime() + 1.5 * 60 * 60 * 1000);
    const in2h_End = new Date(now.getTime() + 2.5 * 60 * 60 * 1000);

    const apps = await prisma.appointment.findMany({
      where: {
        status: "CONFIRMED",
        dateTime: { gte: now },
        client: { telegramChatId: { not: null }, notifyAppointments: true },
      },
      include: { client: true, service: true },
    });

    for (const app of apps) {
      const appTime = app.dateTime.getTime();
      let msg = "";

      // Нагадування за 24 години
      if (appTime >= in24h_Start.getTime() && appTime <= in24h_End.getTime()) {
        msg = `🔔 *Нагадування!* \nЗавтра о *${app.dateTime.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}* чекаємо Вас на ${app.service.name}. ✨`;
      }
      // Нагадування за 2 години
      else if (
        appTime >= in2h_Start.getTime() &&
        appTime <= in2h_End.getTime()
      ) {
        msg = `⏰ *До зустрічі скоро!* \nВже за 2 години о *${app.dateTime.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}* чекаємо Вас на ${app.service.name}. 💖`;
      }

      if (msg) await sendMessage(app.client.telegramChatId!, msg);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
