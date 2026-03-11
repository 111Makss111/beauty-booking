import { NextResponse } from "next/server";
import { processTelegramUpdate } from "@/settings/telegram/telegram-logic";

export async function POST(req: Request) {
  try {
    const update = await req.json();

    // Тимчасовий лог для розробки, щоб ти бачив, що Telegram реально достукався до тебе
    console.log("ОТРИМАНО WEBHOOK:", JSON.stringify(update, null, 2));

    await processTelegramUpdate(update);

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Правило №43: Обов'язково виводимо помилку в консоль
    console.error("[TELEGRAM_WEBHOOK_ERROR]:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
