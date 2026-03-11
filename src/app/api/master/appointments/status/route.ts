import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { appointmentId, status } = body;

    if (!appointmentId || !status) {
      return NextResponse.json({ error: "Відсутні дані" }, { status: 400 });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Помилка оновлення статусу:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
