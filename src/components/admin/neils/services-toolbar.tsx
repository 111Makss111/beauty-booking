"use client";

import { Plus } from "lucide-react";

interface ServicesToolbarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  showOnlyActive: boolean;
  onActiveToggle: (active: boolean) => void;
  onAddClick: () => void;
}

export default function ServicesToolbar({
  showOnlyActive,
  onActiveToggle,
  onAddClick,
}: ServicesToolbarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full gap-4">
      {/* Ліва частина: Перемикач активних послуг */}
      <div className="flex items-center w-full lg:w-auto">
        <label className="flex items-center justify-between lg:justify-start gap-4 cursor-pointer bg-white/60 backdrop-blur-sm border border-pink-100 px-5 py-3 lg:py-2.5 rounded-2xl shadow-sm w-full lg:w-auto transition-all active:bg-white/80">
          <span className="text-slate-700 font-bold text-sm">
            Тільки активні
          </span>
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={showOnlyActive}
              onChange={(e) => onActiveToggle(e.target.checked)}
            />
            <div
              className={`block w-11 h-6 rounded-full transition-colors duration-300 ${
                showOnlyActive ? "bg-emerald-400" : "bg-slate-200"
              }`}
            />
            <div
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                showOnlyActive ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </label>
      </div>

      {/* Права частина: Кнопка додавання */}
      <button
        onClick={onAddClick}
        className="w-full lg:w-auto bg-pink-500 hover:bg-pink-600 text-white px-6 py-3.5 lg:py-2.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-100 active:scale-95 shrink-0"
      >
        <Plus className="w-5 h-5 shrink-0" />
        Додати послугу
      </button>
    </div>
  );
}
