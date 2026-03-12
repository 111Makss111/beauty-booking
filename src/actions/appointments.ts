"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import { revalidatePath } from "next/cache";
import { AppointmentStatus } from "@prisma/client";
import { sendAppointmentUpdateNotification } from "@/settings/telegram/actions";

const CASHBACK_PERCENT = 0.05;

// --- ВНУТРІШНІ ХЕЛПЕРИ ---

async function calculateFinalPrice(
  serviceId: string,
  basePrice: number,
  appointmentDate: Date,
) {
  const offer = await prisma.specialOffer.findFirst({
    where: {
      serviceId,
      isActive: true,
      type: "HOT_SLOT",
      dateTime: appointmentDate,
    },
  });

  if (offer) {
    const discountAmount = (basePrice * offer.discount) / 100;
    return basePrice - discountAmount;
  }

  return basePrice;
}

// --- ЕКШЕНИ ---

export async function createAppointment(data: {
  serviceId: string;
  masterId: string;
  dateTime: Date;
  useBonuses: boolean;
}) {
  const session = await getServerSession(authOptions);
  // Перевірка сесії (Type Guard)
  if (!session?.user?.email) return { error: "Не авторизовано" };

  try {
    const [service, user] = await Promise.all([
      prisma.service.findUnique({ where: { id: data.serviceId } }),
      prisma.user.findUnique({ where: { email: session.user.email } }),
    ]);

    if (!service || !user) return { error: "Дані не знайдено" };

    let finalPrice = await calculateFinalPrice(
      service.id,
      service.price,
      data.dateTime,
    );

    let bonusesToSubtract = 0;
    if (data.useBonuses && user.bonusBalance > 0) {
      const maxBonusDiscount = finalPrice * 0.5;
      bonusesToSubtract = Math.min(user.bonusBalance, maxBonusDiscount);
      finalPrice -= bonusesToSubtract;
    }

    const newAppointment = await prisma.$transaction(async (tx) => {
      if (bonusesToSubtract > 0) {
        await tx.user.update({
          where: { id: user.id },
          data: { bonusBalance: { decrement: bonusesToSubtract } },
        });
      }

      return await tx.appointment.create({
        data: {
          clientId: user.id,
          masterId: data.masterId,
          serviceId: service.id,
          dateTime: data.dateTime,
          endTime: new Date(data.dateTime.getTime() + service.duration * 60000),
          totalPrice: finalPrice,
          status: "PENDING",
        },
      });
    });

    await sendAppointmentUpdateNotification(newAppointment.id, "CREATED");
    revalidatePath("/my-bookings");
    return { success: true, appointmentId: newAppointment.id };
  } catch (error) {
    console.error("Booking error:", error);
    return { error: "Помилка при створенні запису" };
  }
}

export async function updateAppointmentStatus(
  appointmentId: string,
  newStatus: AppointmentStatus,
) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // Виправлено: Чітка перевірка на існування user та ролі
  if (!user || (user.role !== "ADMIN" && user.role !== "MASTER")) {
    return { success: false, error: "Немає прав для цієї дії" };
  }

  if (newStatus === "COMPLETED") {
    return await completeAppointment(appointmentId);
  }

  try {
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: newStatus },
    });

    if (newStatus === "CONFIRMED" || newStatus === "CANCELLED") {
      await sendAppointmentUpdateNotification(appointmentId, newStatus);
    }

    revalidatePath("/admin/appointments");
    return { success: true };
  } catch (error) {
    console.error("Status update error:", error);
    return { success: false, error: "Не вдалося оновити статус" };
  }
}

export async function completeAppointment(appointmentId: string) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // Виправлено: TypeScript тепер знає, що user не null
  if (!user || (user.role !== "ADMIN" && user.role !== "MASTER")) {
    return { error: "Доступ заборонено" };
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { client: true },
    });

    if (!appointment || appointment.status === "COMPLETED") {
      return { error: "Запис не знайдено або вже завершено" };
    }

    const bonusAmount = appointment.totalPrice * CASHBACK_PERCENT;

    await prisma.$transaction([
      prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: "COMPLETED" },
      }),
      prisma.user.update({
        where: { id: appointment.clientId },
        data: { bonusBalance: { increment: bonusAmount } },
      }),
    ]);

    await sendAppointmentUpdateNotification(appointmentId, "COMPLETED");

    revalidatePath("/admin/appointments");
    revalidatePath("/dashboard/appointments");

    return { success: true, earnedBonus: bonusAmount };
  } catch (error) {
    console.error("Complete error:", error);
    return { error: "Помилка завершення візиту" };
  }
}
