import { Star, User, Trophy } from "lucide-react";

interface Master {
  id: string;
  name: string;
  image: string | null;
  rating: number;
  revenue: number;
  appointmentsCount: number;
}

interface TopMastersWidgetProps {
  masters: Master[];
}

export default function TopMastersWidget({ masters }: TopMastersWidgetProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-6 border border-white shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-bold text-slate-800">
          Топ майстрів місяця
        </h3>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {masters.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">
            Ще немає даних за цей місяць
          </p>
        ) : (
          masters.map((master, index) => (
            <div
              key={master.id}
              className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden shrink-0 relative">
                {master.image ? (
                  <img
                    src={master.image}
                    alt={master.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
                {index === 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    1
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-700 text-sm truncate">
                  {master.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-slate-600">
                    {master.rating > 0 ? master.rating.toFixed(1) : "Новий"}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1">
                    ({master.appointmentsCount} візитів)
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black text-pink-500">
                  {master.revenue} ₴
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
