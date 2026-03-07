import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const roleParam = (searchParams.get("role") as Role) || Role.CLIENT;

    const users = await prisma.user.findMany({
      where: {
        role: roleParam,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
      },
      orderBy: {
        firstName: "asc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
