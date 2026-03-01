import { NextResponse } from "next/server";
import { processTelegramUpdate } from "@/telegram/telegram-logic";

export async function POST(req: Request) {
  try {
    const update = await req.json();
    await processTelegramUpdate(update);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false });
  }
}
