"use client";

import {
  Wallet,
  TrendingUp,
  Users,
  CalendarClock,
  LucideIcon,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/currency"; // Імпортуємо нашу утиліту

interface StatsCardsProps {
  todayRevenue: number;
  monthRevenue: number;
  pipelineRevenue: number;
  newClients: number;
}

export default function StatsCards({
  todayRevenue,
  monthRevenue,
  pipelineRevenue,
  newClients,
}: StatsCardsProps) {
  // Видалено внутрішній formatMoney, тепер використовуємо глобальну утиліту

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card
        icon={Wallet}
        title="Дохід (період)"
        value={formatPrice(monthRevenue)} // monthRevenue тут фактично є сумою за період
        color="bg-pink-50 text-pink-500"
      />
      <Card
        icon={TrendingUp}
        title="Середній чек"
        // Розрахунок середнього чека для більшої інформативності
        value={formatPrice(monthRevenue / (newClients || 1))}
        color="bg-rose-50 text-rose-500"
      />
      <Card
        icon={CalendarClock}
        title="Прогноз (очікується)"
        value={formatPrice(pipelineRevenue)}
        color="bg-purple-50 text-purple-500"
      />
      <Card
        icon={Users}
        title="Нові клієнти"
        value={newClients.toString()}
        color="bg-blue-50 text-blue-500"
      />
    </div>
  );
}

interface CardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  color: string;
}

function Card({ icon: Icon, title, value, color }: CardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-5 border border-white shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${color}`}
      >
        <Icon className="w-7 h-7" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 truncate">
          {title}
        </p>
        <h3 className="text-xl xl:text-2xl font-black text-slate-800 truncate">
          {value}
        </h3>
      </div>
    </div>
  );
}
