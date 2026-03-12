"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import StatsCards from "./stats-cards";
import RevenueChart from "./revenue-chart";
import TopMastersWidget from "./top-masters-widget";
import ServicesPieChart from "./services-pie-chart";
import {
  getQuickStats,
  getRevenueChartData,
  getTopMasters,
  getServicesBreakdown,
} from "@/actions/analytics";

// Інтерфейс для статистики
interface QuickStats {
  todayRevenue: number;
  monthRevenue: number;
  pipelineRevenue: number;
  todayAppointmentsCount: number;
  newClients: number;
}

// ДОДАНО: Чіткий інтерфейс для майстрів замість any (Правило №99)
export interface TopMaster {
  id: string;
  name: string;
  image: string | null;
  rating: number;
  revenue: number;
  appointmentsCount: number;
}

export default function AdminOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<QuickStats | null>(null);
  const [chartData, setChartData] = useState<
    { date: string; revenue: number }[]
  >([]);

  // ВИПРАВЛЕНО: Використовуємо точний тип TopMaster[]
  const [masters, setMasters] = useState<TopMaster[]>([]);
  const [services, setServices] = useState<{ name: string; value: number }[]>(
    [],
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        // Запускаємо всі 4 запити до БД одночасно для максимальної швидкості
        const [statsData, chartDataRes, mastersData, servicesData] =
          await Promise.all([
            getQuickStats(),
            getRevenueChartData(),
            getTopMasters(),
            getServicesBreakdown(),
          ]);

        setStats(statsData);
        setChartData(chartDataRes);
        setMasters(mastersData as TopMaster[]); // Приводимо до правильного типу
        setServices(servicesData);
      } catch (error) {
        console.error("Помилка завантаження аналітики:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full">
        <Loader2 className="w-10 h-10 animate-spin text-pink-400 mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          Аналізуємо дані...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 1. Верхній ряд з картками */}
      <StatsCards
        todayRevenue={stats.todayRevenue}
        monthRevenue={stats.monthRevenue}
        pipelineRevenue={stats.pipelineRevenue}
        newClients={stats.newClients}
      />

      {/* 2. Основна сітка графіків */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <RevenueChart data={chartData} />
          <ServicesPieChart data={services} />
        </div>

        <div className="lg:col-span-1">
          <TopMastersWidget masters={masters} />
        </div>
      </div>
    </div>
  );
}
