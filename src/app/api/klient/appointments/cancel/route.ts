import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// Імпортуємо функцію сповіщень
import { sendAppointmentUpdateNotification } from "@/settings/telegram/actions";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { appointmentId } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Відсутній ID запису" },
        { status: 400 },
      );
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "CANCELLED" },
    });

    // НАДСИЛАЄМО СПОВІЩЕННЯ ПРО СКАСУВАННЯ
    await sendAppointmentUpdateNotification(appointmentId, "CANCELLED");

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Помилка скасування запису:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
