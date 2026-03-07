"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";

export async function getServicesList() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return [];

  return await prisma.service.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}
