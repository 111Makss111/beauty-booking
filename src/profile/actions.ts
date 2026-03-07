"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getUserProfile() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      password: true, // Беремо для перевірки наявності
    },
  });

  if (!user) return null;

  // Видаляємо хеш пароля перед відправкою на клієнт і замінюємо його на boolean
  const { password, ...userWithoutPassword } = user;

  return {
    ...userWithoutPassword,
    hasPassword: Boolean(password),
  };
}

export async function updateUserProfile(data: {
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

  revalidatePath("/admin/profile");
  revalidatePath("/klient/profile");

  return { success: true };
}

export async function updateUserAvatar(imageUrl: string) {
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

  revalidatePath("/admin/profile");
  revalidatePath("/klient/profile");

  return { success: true };
}

export async function updateUserPassword(
  currentPassword: string,
  newPassword: string,
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: "Не авторизовано" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.password) {
      return {
        success: false,
        error:
          "Цей акаунт використовує вхід через Google. Пароль не встановлено.",
      };
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return { success: false, error: "Невірний поточний пароль." };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        password: hashedNewPassword,
      },
    });

    revalidatePath("/admin/profile");
    revalidatePath("/klient/profile");

    return { success: true, error: null };
  } catch (error) {
    console.error("Помилка зміни пароля:", error);
    return { success: false, error: "Виникла помилка на сервері." };
  }
}
