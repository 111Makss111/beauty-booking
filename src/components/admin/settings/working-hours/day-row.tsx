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
      className={`flex items-center justify-between p-4 rounded-[1.5rem] border transition-all ${
        isOpen
          ? "bg-white border-pink-50 shadow-sm"
          : "bg-slate-50/50 border-transparent opacity-60"
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onToggle}
          className={`w-12 h-6 rounded-full relative transition-colors ${
            isOpen ? "bg-emerald-400" : "bg-slate-300"
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
              isOpen ? "left-7" : "left-1"
            }`}
          />
        </button>
        <span className="font-bold text-slate-700 text-sm w-24">{dayName}</span>
      </div>

      <div className="flex items-center gap-2">
        {isOpen ? (
          <>
            <div className="relative">
              <Sun className="absolute left-3 top-2.5 w-3.5 h-3.5 text-orange-300" />
              <select
                value={start}
                onChange={(e) => onTimeChange("start", e.target.value)}
                className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-200 appearance-none cursor-pointer"
              >
                {timeSlots.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-slate-300 text-xs">—</span>
            <div className="relative">
              <Moon className="absolute left-3 top-2.5 w-3.5 h-3.5 text-indigo-300" />
              <select
                value={end}
                onChange={(e) => onTimeChange("end", e.target.value)}
                className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-200 appearance-none cursor-pointer"
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
          <span className="text-xs font-bold text-slate-400 px-10 py-2">
            Зачинено
          </span>
        )}
      </div>
    </div>
  );
}
