"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import { revalidatePath } from "next/cache";
import { AppointmentStatus } from "@prisma/client";
import { sendAppointmentUpdateNotification } from "@/settings/telegram/actions";

export async function updateAppointmentStatus(
  appointmentId: string,
  newStatus: AppointmentStatus,
) {
  const session = await getServerSession(authOptions);

  if (
    !session?.user?.email ||
    (session.user.role !== "ADMIN" && session.user.role !== "MASTER")
  ) {
    return { success: false, error: "Немає прав для цієї дії" };
  }

  try {
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: newStatus },
    });

    // Універсальна функція тепер сама розбереться, кому і що слати (і клієнту, і майстру)
    if (newStatus === "CONFIRMED" || newStatus === "CANCELLED") {
      await sendAppointmentUpdateNotification(appointmentId, newStatus);
    }

    revalidatePath("/admin/appointments");
    return { success: true };
  } catch (error) {
    console.error("Помилка оновлення статусу:", error);
    return { success: false, error: "Не вдалося оновити статус" };
  }
}
