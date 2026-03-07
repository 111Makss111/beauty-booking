import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }

    const body = await req.json();
    const { id, type } = body;

    if (!id || type !== "master") {
      return NextResponse.json({ error: "Невірні дані" }, { status: 400 });
    }

    const master = await prisma.masterProfile.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!master) {
      return NextResponse.json(
        { error: "Майстра не знайдено" },
        { status: 404 },
      );
    }

    await prisma.$transaction([
      prisma.masterProfile.delete({
        where: { id },
      }),
      prisma.user.update({
        where: { id: master.userId },
        data: { role: Role.CLIENT },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Помилка видалення" }, { status: 500 });
  }
}
