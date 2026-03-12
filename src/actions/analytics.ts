"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import {
  startOfDay,
  endOfDay,
  eachDayOfInterval,
  format,
  isSameDay,
} from "date-fns";
import { uk } from "date-fns/locale";

// Описуємо структуру для агрегації (Правило №99)
interface MasterAggregation {
  id: string;
  name: string;
  image: string | null;
  rating: number;
  revenue: number;
  appointmentsCount: number;
}

const requireAdmin = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "ADMIN") {
    throw new Error("Немає доступу.");
  }
};

export async function getDashboardData(from: Date, to: Date) {
  await requireAdmin();

  const start = startOfDay(from);
  const end = endOfDay(to);

  const appointments = await prisma.appointment.findMany({
    where: {
      status: "COMPLETED",
      dateTime: { gte: start, lte: end },
    },
    include: {
      service: { select: { name: true } },
      master: {
        include: {
          user: { select: { firstName: true, lastName: true, image: true } },
        },
      },
    },
  });

  // 1. ДАНІ ДЛЯ ГРАФІКА
  const daysInterval = eachDayOfInterval({ start, end });
  const chartData = daysInterval.map((day) => {
    const revenue = appointments
      .filter((app) => isSameDay(new Date(app.dateTime), day))
      .reduce((sum, app) => sum + app.totalPrice, 0);
    return {
      date: format(day, "dd.MM", { locale: uk }),
      revenue,
    };
  });

  // 2. СТАТИСТИКА ДЛЯ КАРТОК
  const totalRevenue = appointments.reduce(
    (sum, app) => sum + app.totalPrice,
    0,
  );

  const newClientsCount = await prisma.user.count({
    where: {
      role: "CLIENT",
      createdAt: { gte: start, lte: end },
    },
  });

  const pipelineAppointments = await prisma.appointment.findMany({
    where: {
      status: "CONFIRMED",
      dateTime: { gte: new Date() },
    },
    select: { totalPrice: true },
  });
  const pipelineRevenue = pipelineAppointments.reduce(
    (sum, app) => sum + app.totalPrice,
    0,
  );

  // 3. ТОП МАЙСТРІВ (ВИПРАВЛЕНО: Жодного any)
  const masterMap = new Map<string, MasterAggregation>();

  appointments.forEach((app) => {
    const m = app.master;
    const existing = masterMap.get(m.id);

    if (existing) {
      existing.revenue += app.totalPrice;
      existing.appointmentsCount += 1;
    } else {
      masterMap.set(m.id, {
        id: m.id,
        name: `${m.user.firstName} ${m.user.lastName || ""}`.trim(),
        image: m.user.image,
        rating: m.rating,
        revenue: app.totalPrice,
        appointmentsCount: 1,
      });
    }
  });

  const topMasters = Array.from(masterMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);

  // 4. ПОСЛУГИ
  const serviceMap = new Map<string, number>();
  appointments.forEach((app) => {
    const name = app.service.name;
    serviceMap.set(name, (serviceMap.get(name) || 0) + app.totalPrice);
  });

  const servicesBreakdown = Array.from(serviceMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return {
    chartData,
    stats: {
      totalRevenue,
      newClientsCount,
      pipelineRevenue,
      appointmentsCount: appointments.length,
    },
    topMasters,
    servicesBreakdown,
  };
}
