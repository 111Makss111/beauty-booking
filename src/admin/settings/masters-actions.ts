"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";

export async function getMastersList() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return [];

  const masters = await prisma.masterProfile.findMany({
    include: {
      user: { select: { firstName: true, lastName: true } },
    },
  });

  // Перетворюємо дані у зручний формат для нашого випадаючого списку
  return masters.map((m) => ({
    id: m.id, // Це ID з MasterProfile
    firstName: m.user.firstName,
    lastName: m.user.lastName,
  }));
}
