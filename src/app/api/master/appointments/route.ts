import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Відсутній userId" }, { status: 400 });
    }

    // Шукаємо ID профілю майстра
    const masterProfile = await prisma.masterProfile.findUnique({
      where: { userId: userId },
    });

    if (!masterProfile) {
      return NextResponse.json(
        { error: "Профіль майстра не знайдено" },
        { status: 404 },
      );
    }

    // Шукаємо записи цього майстра
    const appointments = await prisma.appointment.findMany({
      where: { masterId: masterProfile.id },
      orderBy: { dateTime: "asc" },
      include: {
        service: {
          select: { name: true, duration: true },
        },
        client: {
          select: { firstName: true, lastName: true, image: true },
        },
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Помилка отримання записів майстра:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
