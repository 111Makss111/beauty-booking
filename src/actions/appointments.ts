"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import { revalidatePath } from "next/cache";
import { AppointmentStatus } from "@prisma/client";

// Правило №21: Використовуємо твої готові функції замість дублювання
import { sendAppointmentNotification } from "@/settings/telegram/actions"; // перевір шлях до свого файлу
import { sendMessage } from "@/settings/telegram/telegram-logic";
export async function updateAppointmentStatus(
  appointmentId: string,
  newStatus: AppointmentStatus,
) {
  // Правило №25: Early return
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "ADMIN") {
    return { success: false, error: "Немає прав для цієї дії" };
  }

  try {
    // 1. Оновлюємо статус у БД і дістаємо дані
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: newStatus },
      include: {
        client: true,
        service: true,
        master: { include: { user: true } },
      },
    });

    const dateStr = appointment.dateTime.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
    });
    const timeStr = appointment.dateTime.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // 2. ЛОГІКА ДЛЯ КЛІЄНТА (викликаємо ТВОЮ функцію)
    let clientText = "";
    if (newStatus === "CONFIRMED") {
      clientText = `✅ Ваш запис на ${dateStr} о ${timeStr} (${appointment.service.name}) підтверджено!`;
    } else if (newStatus === "CANCELLED") {
      clientText = `❌ На жаль, ваш запис на ${dateStr} о ${timeStr} скасовано.`;
    }

    if (clientText) {
      await sendAppointmentNotification(appointment.client.id, clientText);
    }

    // 3. ЛОГІКА ДЛЯ МАЙСТРА (Майстру завжди шлемо прямо в Telegram, бо це його графік)
    if (appointment.master.user.telegramChatId) {
      let masterText = "";
      if (newStatus === "CONFIRMED") {
        masterText = `📅 Новий підтверджений запис!\nКлієнт: ${appointment.client.firstName}\nДата: ${dateStr} о ${timeStr}\nПослуга: ${appointment.service.name}`;
      } else if (newStatus === "CANCELLED") {
        masterText = `⚠️ Запис скасовано!\nКлієнт: ${appointment.client.firstName}\nДата: ${dateStr} о ${timeStr}`;
      }

      if (masterText) {
        await sendMessage(
          appointment.master.user.telegramChatId,
          masterText,
        ).catch((e) => console.error(`Помилка Telegram для майстра: ${e}`));
      }
    }

    revalidatePath("/admin/appointments");
    return { success: true };
  } catch (error) {
    // Правило №44: Зрозуміле пояснення помилки
    return { success: false, error: "Не вдалося оновити статус у базі даних" };
  }
}
