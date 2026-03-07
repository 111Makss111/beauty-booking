"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import { revalidatePath } from "next/cache";

// --- ЛОГІКА ДЛЯ КЛІЄНТІВ (повертаємо, щоб прибрати помилку) ---

export async function getNotificationSettings() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      notifyAppointments: true,
      notifyPromotions: true,
    },
  });
  return user;
}

export async function updateNotificationSetting(
  field: "notifyAppointments" | "notifyPromotions",
  value: boolean,
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Не авторизовано");

  await prisma.user.update({
    where: { email: session.user.email },
    data: { [field]: value },
  });

  revalidatePath("/klient/settings");
}

// --- ЛОГІКА ДЛЯ АДМІНА (робочі години) ---

export interface DaySchedule {
  isOpen: boolean;
  start: string;
  end: string;
}

export async function getWorkingHours() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const settings = await prisma.salonSettings.findFirst({
    where: { id: "default" },
    include: {
      workingDays: { orderBy: { dayOfWeek: "asc" } },
    },
  });
  return settings;
}

export async function updateWorkingHours(
  schedule: DaySchedule[],
  allowWeekends: boolean,
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "ADMIN") {
    throw new Error("Доступ заборонено");
  }

  await prisma.salonSettings.upsert({
    where: { id: "default" },
    update: {
      allowWeekendBooking: allowWeekends,
      workingDays: {
        deleteMany: {},
        create: schedule.map((day, index) => ({
          dayOfWeek: index,
          isOpen: day.isOpen,
          startTime: day.start,
          endTime: day.end,
        })),
      },
    },
    create: {
      id: "default",
      allowWeekendBooking: allowWeekends,
      workingDays: {
        create: schedule.map((day, index) => ({
          dayOfWeek: index,
          isOpen: day.isOpen,
          startTime: day.start,
          endTime: day.end,
        })),
      },
    },
  });

  revalidatePath("/admin/settings");
}
