"use client";

import { User } from "lucide-react";

interface Master {
  id: string;
  firstName: string;
  lastName: string;
}

interface MasterSelectProps {
  value: string;
  onChange: (value: string) => void;
  masters: Master[];
  isLoading: boolean;
}

export function MasterSelect({
  value,
  onChange,
  masters,
  isLoading,
}: MasterSelectProps) {
  return (
    <div>
      <label className="text-[10px] uppercase font-bold text-slate-400 ml-4 mb-1.5 block">
        Оберіть майстра
      </label>
      <div className="relative">
        <User className="absolute left-4 top-3.5 w-4 h-4 text-orange-300" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 appearance-none cursor-pointer"
          disabled={isLoading}
        >
          <option value="" disabled>
            {isLoading
              ? "Завантаження майстрів..."
              : "Натисніть, щоб обрати майстра..."}
          </option>
          {masters.map((master) => (
            <option key={master.id} value={master.id}>
              {master.firstName} {master.lastName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
