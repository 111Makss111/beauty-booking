"use client";

import { Sun, Moon } from "lucide-react";

interface DayRowProps {
  dayName: string;
  isOpen: boolean;
  start: string;
  end: string;
  timeSlots: string[];
  onToggle: () => void;
  onTimeChange: (field: "start" | "end", value: string) => void;
}

export function DayRow({
  dayName,
  isOpen,
  start,
  end,
  timeSlots,
  onToggle,
  onTimeChange,
}: DayRowProps) {
  return (
    <div
      className={`flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-[1.5rem] border transition-all gap-4 lg:gap-0 ${
        isOpen
          ? "bg-white border-pink-50 shadow-sm"
          : "bg-slate-50/50 border-transparent opacity-60"
      }`}
    >
      {/* Перший поверх: Перемикач та назва дня */}
      <div className="flex items-center justify-between w-full lg:w-auto gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggle}
            className={`w-12 h-6 rounded-full relative transition-colors shrink-0 ${
              isOpen ? "bg-emerald-400" : "bg-slate-300"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                isOpen ? "left-7" : "left-1"
              }`}
            />
          </button>
          <span className="font-bold text-slate-700 text-sm lg:w-24">
            {dayName}
          </span>
        </div>
      </div>

      {/* Другий поверх: Вибір часу або статус "Зачинено" */}
      <div className="flex items-center justify-between lg:justify-end gap-2 w-full lg:w-auto pt-3 border-t border-slate-100 lg:pt-0 lg:border-0">
        {isOpen ? (
          <>
            <div className="relative flex-1 lg:flex-none">
              <Sun className="absolute left-3 top-2.5 w-3.5 h-3.5 text-orange-300" />
              <select
                value={start}
                onChange={(e) => onTimeChange("start", e.target.value)}
                className="w-full lg:w-auto pl-9 pr-2 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-200 appearance-none cursor-pointer"
              >
                {timeSlots.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-slate-300 text-xs shrink-0">—</span>

            <div className="relative flex-1 lg:flex-none">
              <Moon className="absolute left-3 top-2.5 w-3.5 h-3.5 text-indigo-300" />
              <select
                value={end}
                onChange={(e) => onTimeChange("end", e.target.value)}
                className="w-full lg:w-auto pl-9 pr-2 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-200 appearance-none cursor-pointer"
              >
                {timeSlots.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <span className="text-xs font-bold text-slate-400 w-full text-center lg:text-right lg:px-10 py-2">
            Зачинено
          </span>
        )}
      </div>
    </div>
  );
}
