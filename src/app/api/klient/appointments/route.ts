import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendAppointmentUpdateNotification } from "@/settings/telegram/actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      serviceId,
      masterUserId, // Це ID, який прийшов з фронтенда
      clientId,
      dateTime,
      extraOptionIds,
      totalPrice,
      totalDuration,
    } = body;

    // КРОК 1: Логування для відладки (побачиш у консолі Vercel)
    console.log("DEBUG: Спроба запису до майстра з ID:", masterUserId);

    // КРОК 2: Подвійна перевірка профілю (Правило №46)
    // Спочатку шукаємо за userId, якщо не знайшли — шукаємо за id самого профілю
    let masterProfile = await prisma.masterProfile.findUnique({
      where: { userId: masterUserId },
    });

    if (!masterProfile) {
      masterProfile = await prisma.masterProfile.findUnique({
        where: { id: masterUserId },
      });
    }

    // Якщо після обох перевірок порожньо — профілю реально немає в базі
    if (!masterProfile) {
      console.error(
        `ERROR: Профіль майстра не знайдено для ID: ${masterUserId}`,
      );
      return NextResponse.json(
        {
          error: `Профіль майстра не знайдено. Перевірте базу даних для ID: ${masterUserId}`,
        },
        { status: 404 },
      );
    }

    const startDateTime = new Date(dateTime);
    const endDateTime = new Date(
      startDateTime.getTime() + totalDuration * 60000,
    );

    // КРОК 3: Перевірка накладок
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

    // КРОК 4: Створення запису
    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        masterId: masterProfile.id, // Використовуємо знайдений id профілю
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

    // КРОК 5: Сповіщення
    await sendAppointmentUpdateNotification(appointment.id, "CREATED");

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("CRITICAL POST ERROR:", error);
    return NextResponse.json(
      { error: "Помилка сервера при створенні запису" },
      { status: 500 },
    );
  }
}
