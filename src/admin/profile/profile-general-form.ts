"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateAdminGeneralInfo(data: {
  firstName: string;
  lastName: string;
  phone: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Не авторизовано");
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    },
  });

  revalidatePath("/admin");

  return { success: true };
}

export async function updateAdminAvatar(imageUrl: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Не авторизовано");
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      image: imageUrl,
    },
  });

  revalidatePath("/admin");

  return { success: true };
}
