"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. ОТРИМАННЯ ВСІХ АКЦІЙ
export async function getSpecialOffers() {
  try {
    const offers = await prisma.specialOffer.findMany({
      include: {
        master: {
          include: {
            user: {
              select: { firstName: true, lastName: true, image: true },
            },
          },
        },
        service: {
          select: { name: true, price: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return offers;
  } catch (error) {
    console.error("Помилка отримання акцій:", error);
    return [];
  }
}

// 2. СТВОРЕННЯ АКЦІЇ (ВИПРАВЛЕНО ТИП DISCOUNT)
export async function createSpecialOffer(data: {
  type: "GLOBAL" | "HOT_SLOT";
  title: string;
  discount: string | number;
  dateTimeStr?: string;
  masterId?: string;
  serviceId?: string;
}) {
  try {
    // Явне перетворення на число (Float) для Prisma
    const discountValue = Number(data.discount);
    if (isNaN(discountValue)) return { error: "Знижка має бути числом" };

    const isoDateTime = data.dateTimeStr ? new Date(data.dateTimeStr) : null;

    const offer = await prisma.specialOffer.create({
      data: {
        type: data.type,
        title: data.title,
        discount: discountValue,
        isActive: true,
        dateTime: isoDateTime,
        ...(data.masterId && {
          master: { connect: { id: data.masterId } },
        }),
        ...(data.serviceId && {
          service: { connect: { id: data.serviceId } },
        }),
      },
    });

    revalidatePath("/admin/settings");
    return { success: true, offer };
  } catch (error) {
    console.error("Помилка створення акції:", error);
    return { error: "Не вдалося створити пропозицію" };
  }
}

// 3. ВИДАЛЕННЯ АКЦІЇ
export async function deleteSpecialOffer(id: string) {
  try {
    await prisma.specialOffer.delete({
      where: { id },
    });
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Помилка видалення акції:", error);
    return { error: "Не вдалося видалити акцію" };
  }
}
