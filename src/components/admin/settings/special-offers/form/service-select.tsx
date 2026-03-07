"use client";

import { Sparkles, ChevronDown } from "lucide-react";

interface Service {
  id: string;
  name: string;
}

interface ServiceSelectProps {
  value: string;
  onChange: (value: string) => void;
  services: Service[];
  isLoading: boolean;
}

export function ServiceSelect({
  value,
  onChange,
  services,
  isLoading,
}: ServiceSelectProps) {
  return (
    <div>
      <label className="text-[10px] uppercase font-bold text-slate-400 ml-3 sm:ml-4 mb-1.5 block">
        Оберіть послугу
      </label>
      <div className="relative">
        <Sparkles className="absolute left-3.5 sm:left-4 top-3.5 w-4 h-4 text-orange-300 pointer-events-none shrink-0" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 sm:pl-11 pr-10 sm:pr-11 py-3 sm:py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 appearance-none cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          <option value="" disabled>
            {isLoading
              ? "Завантаження послуг..."
              : "Натисніть, щоб обрати послугу..."}
          </option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 sm:right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none shrink-0" />
      </div>
    </div>
  );
}
