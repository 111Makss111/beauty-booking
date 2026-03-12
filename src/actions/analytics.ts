"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";

// Допоміжна функція: перевірка прав доступу (тільки для ADMIN)
const requireAdmin = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "ADMIN") {
    throw new Error("Немає доступу. Тільки для адміністраторів.");
  }
};

// 1. Отримання швидких метрик (Верхні картки)
export async function getQuickStats() {
  await requireAdmin();

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Дохід за сьогодні (тільки COMPLETED)
  const todayAppointments = await prisma.appointment.findMany({
    where: { status: "COMPLETED", dateTime: { gte: startOfDay } },
  });
  const todayRevenue = todayAppointments.reduce(
    (sum, app) => sum + app.totalPrice,
    0,
  );

  // Дохід за поточний місяць
  const monthAppointments = await prisma.appointment.findMany({
    where: { status: "COMPLETED", dateTime: { gte: startOfMonth } },
  });
  const monthRevenue = monthAppointments.reduce(
    (sum, app) => sum + app.totalPrice,
    0,
  );

  // Прогноз (Скільки грошей принесуть майбутні підтверджені записи)
  const pipelineAppointments = await prisma.appointment.findMany({
    where: { status: "CONFIRMED", dateTime: { gte: now } },
  });
  const pipelineRevenue = pipelineAppointments.reduce(
    (sum, app) => sum + app.totalPrice,
    0,
  );

  // Нові клієнти за цей місяць
  const newClients = await prisma.user.count({
    where: { role: "CLIENT", createdAt: { gte: startOfMonth } },
  });

  return {
    todayRevenue,
    monthRevenue,
    pipelineRevenue,
    todayAppointmentsCount: todayAppointments.length,
    newClients,
  };
}

// 2. Дані для лінійного графіка (Дохід за останні 7 днів)
export async function getRevenueChartData() {
  await requireAdmin();

  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const appointments = await prisma.appointment.findMany({
    where: { status: "COMPLETED", dateTime: { gte: sevenDaysAgo } },
    select: { dateTime: true, totalPrice: true },
  });

  const dailyData: Record<string, number> = {};

  // Ініціалізуємо останні 7 днів нулями (щоб графік не розривався, якщо в якийсь день не було записів)
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const dateStr = d.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
    });
    dailyData[dateStr] = 0;
  }

  // Наповнюємо реальними доходами
  appointments.forEach((app) => {
    const dateStr = app.dateTime.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
    });
    if (dailyData[dateStr] !== undefined) {
      dailyData[dateStr] += app.totalPrice;
    }
  });

  // Перетворюємо об'єкт у масив для бібліотеки Recharts
  return Object.entries(dailyData).map(([date, revenue]) => ({
    date,
    revenue,
  }));
}

// 3. ТОП-3 майстри за поточний місяць (за прибутком)
export async function getTopMasters() {
  await requireAdmin();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const masters = await prisma.masterProfile.findMany({
    include: {
      user: { select: { firstName: true, lastName: true, image: true } },
      appointments: {
        where: { status: "COMPLETED", dateTime: { gte: startOfMonth } },
        select: { totalPrice: true },
      },
    },
  });

  const formattedMasters = masters.map((master) => {
    const revenue = master.appointments.reduce(
      (sum, app) => sum + app.totalPrice,
      0,
    );
    return {
      id: master.id,
      name: `${master.user.firstName} ${master.user.lastName || ""}`.trim(),
      image: master.user.image,
      rating: master.rating,
      revenue,
      appointmentsCount: master.appointments.length,
    };
  });

  // Сортуємо від найбільшого доходу до найменшого і беремо перших трьох
  return formattedMasters.sort((a, b) => b.revenue - a.revenue).slice(0, 3);
}

// 4. Популярність послуг (для кругової діаграми)
export async function getServicesBreakdown() {
  await requireAdmin();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const appointments = await prisma.appointment.findMany({
    where: { status: "COMPLETED", dateTime: { gte: startOfMonth } },
    include: { service: { select: { name: true } } },
  });

  const serviceData: Record<string, number> = {};

  appointments.forEach((app) => {
    const serviceName = app.service.name;
    if (!serviceData[serviceName]) {
      serviceData[serviceName] = 0;
    }
    serviceData[serviceName] += app.totalPrice;
  });

  return Object.entries(serviceData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value); // Найприбутковіші послуги зверху
}
