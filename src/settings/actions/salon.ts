"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import { revalidatePath } from "next/cache";

// Правило №31/99: Типи для розкладу
export interface DaySchedule {
  isOpen: boolean;
  start: string;
  end: string;
}

export async function updateWorkingHours(
  schedule: DaySchedule[],
  allowWeekends: boolean,
) {
  const session = await getServerSession(authOptions);

  // Правило №25: Early return для прав доступу
  if (!session?.user?.email || session.user.role !== "ADMIN") {
    return { success: false, error: "Доступ заборонено" };
  }

  try {
    // Правило №47: Чітка логіка оновлення
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
    return { success: true };
  } catch (error) {
    console.error(`[SALON_UPDATE_ERROR]: ${error}`);
    return { success: false, error: "Помилка оновлення робочих годин" };
  }
}
