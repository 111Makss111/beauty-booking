import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json(
        { error: "Відсутній clientId" },
        { status: 400 },
      );
    }

    const appointments = await prisma.appointment.findMany({
      where: { clientId },
      orderBy: { dateTime: "asc" }, // Сортуємо від найближчих до найстаріших
      include: {
        service: {
          select: {
            name: true,
            duration: true,
            image: true,
          },
        },
        master: {
          include: {
            user: {
              select: {
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
    console.error("Помилка отримання записів:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
