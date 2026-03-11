"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { pusherServer } from "@/lib/pusher";

// Правило №28: Єдине джерело істини для системного акаунта
const SYSTEM_SALON_EMAIL = "info@beautynails.com";

/**
 * ГАРАНТІЯ НАЯВНОСТІ САЛОНУ
 * Якщо профіль "Beauty Nails" буде видалено, ця функція створить його заново
 * при першій же спробі відправити системне повідомлення.
 */
async function ensureSystemUser() {
  let systemUser = await prisma.user.findUnique({
    where: { email: SYSTEM_SALON_EMAIL },
  });

  if (!systemUser) {
    systemUser = await prisma.user.create({
      data: {
        email: SYSTEM_SALON_EMAIL,
        firstName: "Beauty",
        lastName: "Nails",
        role: "ADMIN",
        image: "/logo.png",
      },
    });
  }

  return systemUser;
}

export async function getContacts() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return [];

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) return [];

  let users;

  if (currentUser.role === "CLIENT") {
    // Клієнти бачать тільки Адмінів (включаючи системний профіль Beauty Nails)
    users = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        image: true,
        averageRating: true,
      },
    });
  } else {
    // Адміни та Майстри бачать усіх, крім себе
    users = await prisma.user.findMany({
      where: { id: { not: currentUser.id } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        image: true,
        averageRating: true,
      },
    });
  }

  const contacts = await Promise.all(
    users.map(async (user) => {
      const unreadCount = await prisma.message.count({
        where: {
          senderId: user.id,
          receiverId: currentUser.id,
          isRead: false,
        },
      });

      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: currentUser.id, receiverId: user.id },
            { senderId: user.id, receiverId: currentUser.id },
          ],
        },
        orderBy: { createdAt: "desc" },
      });

      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName || ""}`.trim(),
        avatar: user.image,
        averageRating: user.averageRating,
        lastMessage: lastMessage ? lastMessage.text : "Немає повідомлень",
        time: lastMessage
          ? new Date(lastMessage.createdAt).toLocaleTimeString("uk-UA", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        unread: unreadCount,
      };
    }),
  );

  return contacts.sort((a, b) => b.unread - a.unread);
}

export async function getMessages(chatPartnerId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return [];

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) return [];

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: currentUser.id, receiverId: chatPartnerId },
        { senderId: chatPartnerId, receiverId: currentUser.id },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  return messages.map((msg) => ({
    id: msg.id,
    text: msg.text,
    time: new Date(msg.createdAt).toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    isMine: msg.senderId === currentUser.id,
  }));
}

export async function markAsRead(senderId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return;

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) return;

  await prisma.message.updateMany({
    where: {
      senderId: senderId,
      receiverId: currentUser.id,
      isRead: false,
    },
    data: { isRead: true },
  });

  revalidatePath("/dashboard");
}

/**
 * ВІДПРАВКА СИСТЕМНОГО ПОВІДОМЛЕННЯ
 * Використовується для сповіщень про статус запису (від імені Beauty Nails)
 */
export async function sendSystemMessage(receiverId: string, text: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !text.trim() || !receiverId) {
    return { error: "Немає доступу або бракує даних" };
  }

  try {
    const salon = await ensureSystemUser();

    const newMessage = await prisma.message.create({
      data: {
        text,
        senderId: salon.id,
        receiverId,
      },
    });

    await pusherServer.trigger(`chat-${receiverId}`, "new-message", {
      id: newMessage.id,
      text: newMessage.text,
      senderId: salon.id,
      createdAt: newMessage.createdAt,
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("System message error:", error);
    return { error: "Не вдалося надіслати" };
  }
}

export async function sendMessage(receiverId: string, text: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !text.trim()) return;

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) return;

  const newMessage = await prisma.message.create({
    data: {
      text,
      senderId: currentUser.id,
      receiverId,
    },
  });

  await pusherServer.trigger(`chat-${receiverId}`, "new-message", {
    id: newMessage.id,
    text: newMessage.text,
    senderId: currentUser.id,
    createdAt: newMessage.createdAt,
  });

  revalidatePath("/dashboard");
}

export async function getCurrentUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  return user?.id || null;
}

export async function getChatPartner(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      firstName: true,
      lastName: true,
      image: true,
      averageRating: true,
    },
  });

  if (!user) return null;

  return {
    name: `${user.firstName} ${user.lastName || ""}`.trim(),
    avatar: user.image,
    rating: user.averageRating,
  };
}

export async function deleteOldMessages() {
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const deleted = await prisma.message.deleteMany({
    where: {
      createdAt: { lt: sixtyDaysAgo },
    },
  });

  return deleted.count;
}
