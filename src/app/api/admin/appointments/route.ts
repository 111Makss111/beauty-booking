import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { dateTime: "asc" },
      include: {
        service: {
          select: { name: true, duration: true },
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
            phone: true,
            email: true,
          },
        },
        master: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Помилка отримання всіх записів:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
