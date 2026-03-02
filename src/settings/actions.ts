"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import { revalidatePath } from "next/cache";

export async function getNotificationSettings() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

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

  if (!session?.user?.email) {
    throw new Error("Не авторизовано");
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      [field]: value,
    },
  });

  revalidatePath("/klient/settings");
}
