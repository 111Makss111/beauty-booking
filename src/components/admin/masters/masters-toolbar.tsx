"use client";

import { Plus } from "lucide-react";

interface MastersToolbarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onAddClick: () => void;
}

export default function MastersToolbar({
  activeFilter,
  onFilterChange,
  onAddClick,
}: MastersToolbarProps) {
  const filters = [
    { id: "all", label: "Всі" },
    { id: "WORKING", label: "Робочий" },
    { id: "VACATION", label: "Відпустка" },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between w-full gap-4">
      <div className="flex overflow-x-auto bg-white/60 backdrop-blur-sm border border-pink-100 p-1 rounded-2xl shadow-sm custom-scrollbar">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`whitespace-nowrap flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeFilter === filter.id
                ? "bg-white text-pink-500 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <button
        onClick={onAddClick}
        className="w-full lg:w-auto justify-center bg-pink-400 hover:bg-pink-500 text-white px-5 py-3 lg:py-2.5 rounded-2xl font-medium transition-colors flex items-center gap-2 shadow-sm shadow-pink-200"
      >
        <Plus className="w-5 h-5 shrink-0" />
        Додати майстра
      </button>
    </div>
  );
}
