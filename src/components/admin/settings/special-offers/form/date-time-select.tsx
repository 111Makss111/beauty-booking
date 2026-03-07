"use client";

import { Calendar, Clock } from "lucide-react";

interface DateTimeSelectProps {
  dateVal: string;
  timeVal: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
}

export function DateTimeSelect({
  dateVal,
  timeVal,
  onDateChange,
  onTimeChange,
}: DateTimeSelectProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-[10px] uppercase font-bold text-slate-400 ml-4 mb-1.5 block">
          Дата
        </label>
        <div className="relative">
          <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-orange-300" />
          <input
            type="date"
            value={dateVal}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 cursor-pointer"
          />
        </div>
      </div>
      <div>
        <label className="text-[10px] uppercase font-bold text-slate-400 ml-4 mb-1.5 block">
          Час
        </label>
        <div className="relative">
          <Clock className="absolute left-4 top-3.5 w-4 h-4 text-orange-300" />
          <input
            type="time"
            value={timeVal}
            onChange={(e) => onTimeChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
