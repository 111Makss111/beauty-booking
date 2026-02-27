import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";

// 1. Оголошуємо строгий тип замість any
interface CustomSession extends Session {
  user: {
    id: string;
    role: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export async function GET() {
  try {
    // 2. Безпечно приводимо сесію до нашого типу
    const session = (await getServerSession(
      authOptions,
    )) as CustomSession | null;

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Немає доступу" }, { status: 403 });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const bookings = await prisma.booking.findMany({
      where: {
        startTime: {
          gte: todayStart,
        },
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
        service: {
          select: { name: true },
        },
      },
      orderBy: { startTime: "asc" },
    });

    const formattedBookings = bookings.map((b) => ({
      id: b.id,
      time: new Date(b.startTime).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      service: b.service?.name || "Процедура видалена",
      name: b.user?.name || "Гість",
      phone: "+380 -- --- -- --",
      status: b.status === "CONFIRMED" ? "Confirmed" : "Pending",
    }));

    return NextResponse.json(formattedBookings);
  } catch (error) {
    console.error("[GET_BOOKINGS_ERROR]", error);
    return NextResponse.json({ message: "Помилка бази" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = (await getServerSession(
      authOptions,
    )) as CustomSession | null;

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Немає доступу" }, { status: 403 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deleted = await prisma.booking.deleteMany({
      where: {
        startTime: {
          lt: thirtyDaysAgo,
        },
      },
    });

    return NextResponse.json({
      message: `Очищено ${deleted.count} старих записів`,
    });
  } catch (error) {
    console.error("[DELETE_BOOKINGS_ERROR]", error);
    return NextResponse.json({ message: "Помилка очищення" }, { status: 500 });
  }
}
