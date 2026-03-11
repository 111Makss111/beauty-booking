import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const options = await prisma.extraOption.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        price: "asc",
      },
    });

    return NextResponse.json(options);
  } catch (error) {
    return NextResponse.json(
      { error: "Помилка завантаження опцій" },
      { status: 500 },
    );
  }
}
