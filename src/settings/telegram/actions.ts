"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateTelegramLink, sendMessage } from "./telegram-logic";

const SYSTEM_SALON_EMAIL = "info@beautynails.com";

// 1. ЗАБЕЗПЕЧЕННЯ СИСТЕМНОГО КОРИСТУВАЧА
async function ensureSystemUser() {
  const systemUser = await prisma.user.findUnique({
    where: { email: SYSTEM_SALON_EMAIL },
  });

  if (!systemUser) {
    return await prisma.user.create({
      data: {
        email: SYSTEM_SALON_EMAIL,
        firstName: "Beauty",
        lastName: "Nails",
        role: "ADMIN",
        emailVerified: true,
        image: "/logo.png",
      },
    });
  }
  return systemUser;
}

// 2. ОТРИМАННЯ СТАТУСУ ТА КІЛЬКОСТІ КЛІЄНТІВ
export async function getTelegramData() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const [user, clientsCount] = await Promise.all([
    prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, telegramUsername: true, telegramChatId: true },
    }),
    prisma.user.count({
      where: {
        role: "CLIENT",
        telegramChatId: { not: null },
      },
    }),
  ]);

  if (!user) return null;
  const link = await generateTelegramLink(user.id);

  return {
    isConnected: !!user.telegramChatId,
    username: user.telegramUsername,
    link: link,
    clientsCount: clientsCount,
  };
}

// 3. ВІДКЛЮЧЕННЯ ТЕЛЕГРАМ
export async function disconnectTelegram() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "Не авторизовано" };

  await prisma.user.update({
    where: { email: session.user.email },
    data: { telegramChatId: null, telegramUsername: null },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

// 4. ШВИДКА РОЗСИЛКА (ВИПРАВЛЕНО БЕЗ ANY ТА БЕЗ ДУБЛЮВАННЯ КЛЮЧІВ)
export async function sendBroadcastToClients(text: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "ADMIN") {
    return { error: "Тільки адміністратор може робити розсилку." };
  }

  try {
    const clients = await prisma.user.findMany({
      where: {
        role: "CLIENT",
        AND: [
          { telegramChatId: { not: null } },
          { telegramChatId: { not: "" } },
        ],
      },
    });

    if (clients.length === 0) return { error: "Немає підключених клієнтів." };

    const salon = await ensureSystemUser();
    let successCount = 0;

    const sendPromises = clients.map(async (client) => {
      try {
        await sendMessage(client.telegramChatId!, text);
        successCount++;
        await prisma.message.create({
          data: { text, senderId: salon.id, receiverId: client.id },
        });
      } catch (e) {
        console.error(`Error sending to ${client.id}:`, e);
      }
    });

    await Promise.allSettled(sendPromises);
    return { success: true, count: successCount };
  } catch (error) {
    console.error("Broadcast error:", error);
    return { error: "Помилка розсилки на сервері" };
  }
}

// 5. ОНОВЛЕННЯ РОБОЧОГО ГРАФІКА (ЧИСТИЙ ПІДХІД)
export async function updateWorkSchedule(scheduleData: unknown) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") return { error: "Немає прав" };

  try {
    // Важливо: переконайся, що модель SalonSettings додана в schema.prisma
    await prisma.salonSettings.upsert({
      where: { id: "general_config" },
      update: { schedule: scheduleData as object },
      create: { id: "general_config", schedule: scheduleData as object },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Schedule update error:", error);
    return { error: "Помилка збереження графіка" };
  }
}

// 6. СПОВІЩЕННЯ ПРО ЗАПИСИ (ПОВНИЙ ФУНКЦІОНАЛ)
export async function sendAppointmentUpdateNotification(
  appointmentId: string,
  type: "CREATED" | "CONFIRMED" | "CANCELLED" | "COMPLETED",
) {
  try {
    const app = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        client: true,
        service: true,
        master: { include: { user: true } },
      },
    });

    if (!app) return;

    const date = new Date(app.dateTime).toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
    });
    const time = new Date(app.dateTime).toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const salon = await ensureSystemUser();
    const masterName = app.master?.user?.firstName || "Майстра";
    const clientName = app.client?.firstName || "Клієнта";
    const clientPhone = app.client?.phone || "Не вказано";

    if (type === "CREATED") {
      const masterMessage = `🔥 *Новий запис!*\n\n👤 *Клієнт:* ${clientName}\n📞 *Телефон:* ${clientPhone}\n💅 *Послуга:* ${app.service.name}\n🗓 *Коли:* ${date} о ${time}\n\n⏳ Будь ласка, підтвердіть візит у кабінеті.`;
      if (app.master?.user?.telegramChatId)
        await sendMessage(app.master.user.telegramChatId, masterMessage);
    } else if (type === "CONFIRMED") {
      const clientMessage = `🎉 *Ваш запис підтверджено!*\n\n💅 *Послуга:* ${app.service.name}\n🗓 *Дата:* ${date}\n⏰ *Час:* ${time}\n👩‍🎨 *Майстер:* ${masterName}\n\n📍 Чекаємо на Вас у *Beauty Nails*! 🌸`;
      if (app.client?.telegramChatId && app.client?.notifyAppointments) {
        await sendMessage(app.client.telegramChatId, clientMessage);
      }
      await prisma.message.create({
        data: {
          text: clientMessage.replace(/\*/g, ""),
          senderId: salon.id,
          receiverId: app.client.id,
        },
      });
    } else if (type === "CANCELLED") {
      const clientMessage = `😔 *Запис скасовано*\n\nВаш візит на *${date}* о *${time}* було скасовано. Будемо раді бачити Вас іншого разу! 🌸`;
      if (app.client?.telegramChatId && app.client?.notifyAppointments) {
        await sendMessage(app.client.telegramChatId, clientMessage);
      }
      await prisma.message.create({
        data: {
          text: clientMessage.replace(/\*/g, ""),
          senderId: salon.id,
          receiverId: app.client.id,
        },
      });

      const masterCancelMsg = `⚠️ *Увага! Запис скасовано.*\n\nКлієнт *${clientName}* скасував свій візит.\n💅 *Послуга:* ${app.service.name}\n🗓 *Дата:* ${date} о ${time}`;
      if (app.master?.user?.telegramChatId)
        await sendMessage(app.master.user.telegramChatId, masterCancelMsg);
    } else if (type === "COMPLETED") {
      const clientMessage = `🌸 *Дякуємо за візит!*\n\nЯк вам робота майстра *${masterName}*? Оцініть, будь ласка, від 1 до 5 зірочок:`;
      if (app.client?.telegramChatId && app.client?.notifyAppointments) {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const replyMarkup = {
          inline_keyboard: [
            [
              { text: "⭐️ 1", callback_data: `rate_${appointmentId}_1` },
              { text: "⭐️ 2", callback_data: `rate_${appointmentId}_2` },
              { text: "⭐️ 3", callback_data: `rate_${appointmentId}_3` },
              { text: "⭐️ 4", callback_data: `rate_${appointmentId}_4` },
              { text: "⭐️ 5", callback_data: `rate_${appointmentId}_5` },
            ],
          ],
        };
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: app.client.telegramChatId,
            text: clientMessage,
            parse_mode: "Markdown",
            reply_markup: replyMarkup,
          }),
        });
      }
    }
  } catch (error) {
    console.error("Notification error:", error);
  }
}
