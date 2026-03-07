import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }

    const services = await prisma.service.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(services);
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
    const { name, duration, price, image } = body;

    if (!name || !duration || price === undefined) {
      return NextResponse.json(
        { error: "Заповніть всі поля" },
        { status: 400 },
      );
    }

    const newService = await prisma.service.create({
      data: {
        name,
        duration: Number(duration),
        price: Number(price),
        image: image || null,
      },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Помилка збереження" }, { status: 500 });
  }
}
