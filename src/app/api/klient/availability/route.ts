import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const masterUserId = searchParams.get("masterId");
    const dateParam = searchParams.get("date");

    if (!masterUserId || !dateParam) {
      return NextResponse.json(
        { error: "Відсутні параметри" },
        { status: 400 },
      );
    }

    const masterProfile = await prisma.masterProfile.findUnique({
      where: {
        userId: masterUserId,
      },
    });

    if (!masterProfile) {
      return NextResponse.json({ bookedIntervals: [] });
    }

    const [year, month, day] = dateParam.split("-").map(Number);

    const startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endDate = new Date(year, month - 1, day + 1, 0, 0, 0, 0);

    const appointments = await prisma.appointment.findMany({
      where: {
        masterId: masterProfile.id,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
        dateTime: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        dateTime: true,
        endTime: true,
      },
    });

    const bookedIntervals = appointments.map((appointment) => ({
      start: appointment.dateTime.toISOString(),
      end: appointment.endTime.toISOString(),
    }));

    return NextResponse.json({ bookedIntervals });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
