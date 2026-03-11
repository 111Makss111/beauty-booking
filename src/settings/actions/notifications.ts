"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import { revalidatePath } from "next/cache";

// Правило №71: Чіткий тип повернення
type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function getNotificationSettings(): Promise<
  ActionResult<{ notifyAppointments: boolean; notifyPromotions: boolean }>
> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return { success: false, error: "Не авторизовано" };

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { notifyAppointments: true, notifyPromotions: true },
    });

    if (!user) return { success: false, error: "Користувача не знайдено" };
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: "Помилка отримання даних" };
  }
}

export async function updateNotificationSetting(
  field: "notifyAppointments" | "notifyPromotions",
  value: boolean,
): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return { success: false, error: "Не авторизовано" };

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: { [field]: value },
    });

    revalidatePath("/klient/settings");
    return { success: true };
  } catch (error) {
    console.error(`[NOTIFY_UPDATE_ERROR]: ${error}`);
    return { success: false, error: "Не вдалося зберегти налаштування" };
  }
}
// Руддщ
