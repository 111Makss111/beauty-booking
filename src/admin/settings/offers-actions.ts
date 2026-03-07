"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import { revalidatePath } from "next/cache";

export async function getSpecialOffers() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return [];

  return await prisma.specialOffer.findMany({
    include: {
      master: { include: { user: true } },
      service: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createSpecialOffer(data: {
  type: "GLOBAL" | "HOT_SLOT";
  title: string;
  discount: string;
  masterId?: string;
  serviceId?: string;
  dateTimeStr?: string; // Приймаємо рядок з клієнта "YYYY-MM-DD HH:mm"
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "ADMIN") {
    throw new Error("Доступ заборонено");
  }

  // Перетворюємо рядок "2026-03-10 11:00" у повноцінний об'єкт Date для бази
  const isoDateTime = data.dateTimeStr ? new Date(data.dateTimeStr) : null;

  const offer = await prisma.specialOffer.create({
    data: {
      type: data.type,
      title: data.title,
      discount: data.discount,
      isActive: true,
      dateTime: isoDateTime,
      ...(data.masterId ? { master: { connect: { id: data.masterId } } } : {}),
      ...(data.serviceId
        ? { service: { connect: { id: data.serviceId } } }
        : {}),
    },
    include: {
      // Повертаємо створений об'єкт разом з іменами, щоб одразу показати на екрані
      master: { include: { user: true } },
      service: true,
    },
  });

  revalidatePath("/admin/settings");
  return offer;
}

export async function deleteSpecialOffer(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "ADMIN") {
    throw new Error("Доступ заборонено");
  }

  await prisma.specialOffer.delete({ where: { id } });
  revalidatePath("/admin/settings");
}
