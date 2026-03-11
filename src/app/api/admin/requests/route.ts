import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const requests = await prisma.appointment.findMany({
      where: { status: "PENDING" },
      orderBy: { dateTime: "asc" },
      include: {
        service: {
          select: { name: true, duration: true },
        },
        client: {
          select: { firstName: true, lastName: true, image: true, phone: true },
        },
        master: {
          include: {
            user: {
              select: { firstName: true, lastName: true, image: true },
            },
          },
        },
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
