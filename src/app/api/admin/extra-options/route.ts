import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Отримати всі додаткові опції
export async function GET() {
  try {
    const options = await prisma.extraOption.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(options);
  } catch (error) {
    return NextResponse.json(
      { error: "Помилка завантаження додаткових опцій" },
      { status: 500 },
    );
  }
}

// Створити нову додаткову опцію
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, duration, isActive } = body;

    const newOption = await prisma.extraOption.create({
      data: {
        name,
        price: parseFloat(price),
        duration: parseInt(duration),
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(newOption);
  } catch (error) {
    return NextResponse.json(
      { error: "Помилка створення додаткової опції" },
      { status: 500 },
    );
  }
}
