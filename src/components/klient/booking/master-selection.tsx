"use client";

import { useEffect, useState } from "react";
import { User, Loader2, Star } from "lucide-react";

export interface Master {
  id: string;
  firstName: string;
  lastName?: string | null;
  rating?: number;
  reviewsCount?: number;
  image?: string | null;
}

interface ApiMaster {
  id: string;
  firstName: string;
  lastName: string | null;
  image: string | null;
}

interface MasterSelectionProps {
  selectedMasterId: string | null;
  onSelect: (master: Master) => void;
  // Ми прибрали selectedTime, бо тепер майстер обирається раніше
}

export default function MasterSelection({
  selectedMasterId,
  onSelect,
}: MasterSelectionProps) {
  const [masters, setMasters] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMasters = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/klient/masters");
        if (!res.ok) throw new Error("Помилка мережі");

        const data: ApiMaster[] = await res.json();

        const formattedMasters: Master[] = data.map((m) => ({
          ...m,
          rating: 4.9,
          reviewsCount: Math.floor(Math.random() * 100) + 50,
        }));

        setMasters(formattedMasters);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMasters(); // Завантажуємо майстрів одразу при відкритті колонки
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-pink-300">
        <Loader2 className="w-8 h-8 animate-spin mb-3" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-center">
          Завантажуємо
          <br />
          майстрів...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-sm font-bold text-slate-800 mb-5 px-1">
        Оберіть майстра
      </h3>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {masters.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-10">
            Немає доступних майстрів
          </p>
        ) : (
          masters.map((master) => (
            <button
              key={master.id}
              onClick={() => onSelect(master)}
              className={`w-full flex items-center gap-4 p-3 rounded-[1.8rem] border transition-all duration-300 text-left group ${
                selectedMasterId === master.id
                  ? "bg-pink-50 border-pink-200 shadow-sm ring-1 ring-pink-100"
                  : "bg-white border-slate-100 hover:border-pink-100 hover:shadow-md"
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-slate-50 overflow-hidden shrink-0 border-2 border-white shadow-sm flex items-center justify-center relative">
                {master.image ? (
                  <img
                    src={master.image}
                    alt={master.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-slate-300" />
                )}
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-700 text-sm leading-tight mb-1 truncate group-hover:text-pink-600 transition-colors">
                  {master.firstName} {master.lastName}
                </p>

                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-slate-700">
                    {master.rating}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium ml-1">
                    ({master.reviewsCount} відгуків)
                  </span>
                </div>
              </div>

              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedMasterId === master.id
                    ? "border-pink-400 bg-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.3)]"
                    : "border-slate-100 bg-slate-50 group-hover:border-pink-200"
                }`}
              >
                {selectedMasterId === master.id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
