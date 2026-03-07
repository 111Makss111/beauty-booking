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
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer bg-white/60 backdrop-blur-sm border border-pink-100 px-4 py-2.5 rounded-2xl shadow-sm">
          <span className="text-slate-700 font-medium">Активні</span>
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={showOnlyActive}
              onChange={(e) => onActiveToggle(e.target.checked)}
            />
            <div
              className={`block w-10 h-6 rounded-full transition-colors duration-300 ${showOnlyActive ? "bg-pink-400" : "bg-slate-200"}`}
            ></div>
            <div
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${showOnlyActive ? "translate-x-4" : "translate-x-0"}`}
            ></div>
          </div>
        </label>
      </div>

      <button
        onClick={onAddClick}
        className="bg-pink-400 hover:bg-pink-500 text-white px-5 py-2.5 rounded-2xl font-medium transition-colors flex items-center gap-2 shadow-sm shadow-pink-200"
      >
        <Plus className="w-5 h-5" />
        Додати послугу
      </button>
    </div>
  );
}
