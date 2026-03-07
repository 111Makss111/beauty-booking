import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }

    const masters = await prisma.masterProfile.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(masters);
  } catch (error) {
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, specialization, status } = body;

    if (!userId || !specialization) {
      return NextResponse.json(
        { error: "Недостатньо даних для створення" },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { role: Role.MASTER },
      }),
      prisma.masterProfile.create({
        data: {
          userId,
          specialization,
          status: status || "WORKING",
        },
      }),
    ]);

    return NextResponse.json(result[1], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Помилка збереження" }, { status: 500 });
  }
}
