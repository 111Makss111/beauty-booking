"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import { revalidatePath } from "next/cache";
import { AppointmentStatus } from "@prisma/client";

// ВИПРАВЛЕНО: назва функції має збігатися з експортом у actions.ts
import { sendAppointmentUpdateNotification } from "@/settings/telegram/actions";
import { sendMessage } from "@/settings/telegram/telegram-logic";

export async function updateAppointmentStatus(
  appointmentId: string,
  newStatus: AppointmentStatus,
) {
  const session = await getServerSession(authOptions);

  // Перевірка прав
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
      include: {
        client: true,
        service: true,
        master: { include: { user: true } },
      },
    });

    // 1. Сповіщення КЛІЄНТА (універсальне: Telegram + Чат програми)
    if (newStatus === "CONFIRMED" || newStatus === "CANCELLED") {
      await sendAppointmentUpdateNotification(appointmentId, newStatus);
    }

    // 2. Сповіщення МАЙСТРА (тільки в Telegram)
    if (appointment.master.user.telegramChatId) {
      const dateStr = appointment.dateTime.toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "long",
      });
      const timeStr = appointment.dateTime.toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
      });

      let masterText = "";
      if (newStatus === "CONFIRMED") {
        masterText = `📅 *Підтверджено запис!*\nКлієнт: ${appointment.client.firstName}\nДата: ${dateStr} о ${timeStr}\nПослуга: ${appointment.service.name}`;
      } else if (newStatus === "CANCELLED") {
        masterText = `⚠️ *Запис скасовано!*\nКлієнт: ${appointment.client.firstName}\nДата: ${dateStr} о ${timeStr}`;
      }

      if (masterText) {
        await sendMessage(
          appointment.master.user.telegramChatId,
          masterText,
        ).catch(console.error);
      }
    }

    revalidatePath("/admin/appointments");
    return { success: true };
  } catch (error) {
    console.error("Помилка оновлення статусу:", error);
    return { success: false, error: "Не вдалося оновити статус" };
  }
}
