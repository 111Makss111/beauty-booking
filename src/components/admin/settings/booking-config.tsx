"use client";

import { useState } from "react";
import { CalendarRange, Timer, ShieldAlert, ChevronDown } from "lucide-react";

export default function BookingConfig() {
  const [config, setConfig] = useState({
    interval: "30 min",
    maxPeriod: "30 днів із наперед",
    minNotice: "1 година",
  });

  const intervals = ["15 min", "30 min", "45 min", "1 година"];
  const periods = [
    "14 днів із наперед",
    "30 днів із наперед",
    "60 днів із наперед",
  ];
  const notices = ["30 хв", "1 година", "2 години", "24 години"];

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
          <CalendarRange className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">
          Налаштування бронювання
        </h2>
      </div>

      <div className="space-y-6">
        {/* Інтервал запису */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <Timer className="w-4 h-4 text-slate-300 group-hover:text-pink-400 transition-colors" />
            <span className="text-sm font-medium text-slate-600">
              Інтервал запису
            </span>
          </div>
          <div className="relative min-w-[200px]">
            <select
              value={config.interval}
              onChange={(e) =>
                setConfig({ ...config, interval: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-100 text-slate-700 py-3 px-4 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-pink-200 appearance-none cursor-pointer"
            >
              {intervals.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Максимальний період */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <CalendarRange className="w-4 h-4 text-slate-300 group-hover:text-pink-400 transition-colors" />
            <span className="text-sm font-medium text-slate-600">
              Максимальний період запису наперед
            </span>
          </div>
          <div className="relative min-w-[200px]">
            <select
              value={config.maxPeriod}
              onChange={(e) =>
                setConfig({ ...config, maxPeriod: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-100 text-slate-700 py-3 px-4 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-pink-200 appearance-none cursor-pointer"
            >
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Мінімальний час попередження */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 text-slate-300 group-hover:text-pink-400 transition-colors" />
            <span className="text-sm font-medium text-slate-600">
              Мінімальний час попередження перед записом
            </span>
          </div>
          <div className="relative min-w-[200px]">
            <select
              value={config.minNotice}
              onChange={(e) =>
                setConfig({ ...config, minNotice: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-100 text-slate-700 py-3 px-4 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-pink-200 appearance-none cursor-pointer"
            >
              {notices.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
