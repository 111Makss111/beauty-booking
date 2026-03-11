import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const masters = await prisma.user.findMany({
      where: {
        role: "MASTER",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        image: true,
      },
    });

    return NextResponse.json(masters);
  } catch (error) {
    return NextResponse.json(
      { error: "Помилка завантаження майстрів" },
      { status: 500 },
    );
  }
}
