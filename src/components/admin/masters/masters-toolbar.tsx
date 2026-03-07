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
    <div className="flex items-center justify-between w-full">
      <div className="flex bg-white/60 backdrop-blur-sm border border-pink-100 p-1 rounded-2xl shadow-sm">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
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
        className="bg-pink-400 hover:bg-pink-500 text-white px-5 py-2.5 rounded-2xl font-medium transition-colors flex items-center gap-2 shadow-sm shadow-pink-200"
      >
        <Plus className="w-5 h-5" />
        Додати майстра
      </button>
    </div>
  );
}
