import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// Імпортуємо функцію сповіщень
import { sendAppointmentUpdateNotification } from "@/settings/telegram/actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      serviceId,
      masterUserId,
      clientId,
      dateTime,
      extraOptionIds,
      totalPrice,
      totalDuration,
    } = body;

    const masterProfile = await prisma.masterProfile.findUnique({
      where: { userId: masterUserId },
    });

    if (!masterProfile) {
      return NextResponse.json(
        { error: "Профіль майстра не знайдено" },
        { status: 404 },
      );
    }

    const startDateTime = new Date(dateTime);
    const endDateTime = new Date(
      startDateTime.getTime() + totalDuration * 60000,
    );

    const overlappingAppointment = await prisma.appointment.findFirst({
      where: {
        masterId: masterProfile.id,
        status: { in: ["PENDING", "CONFIRMED"] },
        AND: [
          { dateTime: { lt: endDateTime } },
          { endTime: { gt: startDateTime } },
        ],
      },
    });

    if (overlappingAppointment) {
      return NextResponse.json(
        { error: "На жаль, цей час щойно зайняли. Будь ласка, оберіть інший." },
        { status: 400 },
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        masterId: masterProfile.id,
        serviceId,
        dateTime: startDateTime,
        endTime: endDateTime,
        totalPrice,
        status: "PENDING",
        extraOptions: {
          connect: extraOptionIds
            ? extraOptionIds.map((id: string) => ({ id }))
            : [],
        },
      },
    });

    // НАДСИЛАЄМО СПОВІЩЕННЯ ПРО НОВИЙ ЗАПИС
    await sendAppointmentUpdateNotification(appointment.id, "CREATED");

    return NextResponse.json(appointment);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Помилка створення запису" },
      { status: 500 },
    );
  }
}
