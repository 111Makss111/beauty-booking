import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Визначаємо чіткий інтерфейс для вхідних даних
interface ServiceRequestBody {
  name: string;
  description?: string;
  price: string | number;
  duration: string | number;
  category: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Перевірка прав доступу (Принцип Професіонала)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Доступ заборонено" },
        { status: 403 },
      );
    }

    const body: ServiceRequestBody = await req.json();
    const { name, description, price, duration, category } = body;

    // Валідація обов'язкових полів
    if (!name || !price || !duration || !category) {
      return NextResponse.json(
        { message: "Відсутні обов'язкові поля" },
        { status: 400 },
      );
    }

    // Створення запису з явним перетворенням типів
    const service = await prisma.service.create({
      data: {
        name: String(name),
        description: description ? String(description) : null,
        price: Number(price),
        duration: Number(duration),
        category: String(category),
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("[SERVICES_POST_ERROR]", error);
    return NextResponse.json({ message: "Помилка сервера" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("[SERVICES_GET_ERROR]", error);
    return NextResponse.json(
      { message: "Помилка отримання послуг" },
      { status: 500 },
    );
  }
}
