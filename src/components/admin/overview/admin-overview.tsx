"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import { subDays, format, startOfDay, endOfDay } from "date-fns";
import StatsCards from "./stats-cards";
import RevenueChart from "./revenue-chart";
import TopMastersWidget from "./top-masters-widget";
import ServicesPieChart from "./services-pie-chart";
import { getDashboardData } from "@/actions/analytics";

// Інтерфейси (Правило №99)
export interface TopMaster {
  id: string;
  name: string;
  image: string | null;
  rating: number;
  revenue: number;
  appointmentsCount: number;
}

interface DashboardData {
  chartData: { date: string; revenue: number }[];
  stats: {
    totalRevenue: number;
    newClientsCount: number;
    pipelineRevenue: number;
    appointmentsCount: number;
  };
  topMasters: TopMaster[];
  servicesBreakdown: { name: string; value: number }[];
}

export default function AdminOverview() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  // Стан для дат (за замовчуванням останні 7 днів)
  const [dateRange, setDateRange] = useState({
    from: format(subDays(new Date(), 6), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
  });

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const from = new Date(dateRange.from);
      const to = new Date(dateRange.to);

      const result = await getDashboardData(from, to);
      setData(result as DashboardData);
    } catch (error) {
      console.error("Помилка завантаження:", error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Швидкі пресети
  const setPreset = (days: number) => {
    const to = new Date();
    const from = subDays(to, days - 1);
    setDateRange({
      from: format(from, "yyyy-MM-dd"),
      to: format(to, "yyyy-MM-dd"),
    });
  };

  if (loading && !data) {
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
      {/* ПАНЕЛЬ КЕРУВАННЯ ПЕРІОДОМ */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Кнопки-пресети */}
        <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-white shadow-sm w-fit">
          {[
            { label: "Тиждень", days: 7 },
            { label: "Місяць", days: 30 },
            { label: "3 місяці", days: 90 },
          ].map((p) => (
            <button
              key={p.days}
              onClick={() => setPreset(p.days)}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all text-slate-500 hover:text-pink-500 hover:bg-white"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Календарний вибір */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md p-2 rounded-[1.5rem] border border-white shadow-sm shadow-pink-100/20">
          <div className="flex items-center gap-2 px-3">
            <CalendarIcon className="w-4 h-4 text-pink-400" />
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, from: e.target.value }))
              }
              className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer"
            />
          </div>
          <ArrowRight className="w-3 h-3 text-slate-300" />
          <div className="px-3">
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, to: e.target.value }))
              }
              className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {data && (
        <>
          {/* 1. Картки статистики */}
          <StatsCards
            todayRevenue={data.stats.totalRevenue}
            monthRevenue={data.stats.totalRevenue}
            pipelineRevenue={data.stats.pipelineRevenue}
            newClients={data.stats.newClientsCount}
          />

          {/* 2. Сітка з графіками */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div
                className={`transition-all duration-300 ${loading ? "blur-[2px] opacity-60" : ""}`}
              >
                <RevenueChart data={data.chartData} />
              </div>
              <ServicesPieChart data={data.servicesBreakdown} />
            </div>

            <div className="lg:col-span-1">
              <TopMastersWidget masters={data.topMasters} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
