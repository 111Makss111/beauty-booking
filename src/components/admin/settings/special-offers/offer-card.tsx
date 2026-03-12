"use client";

import { Flame, Percent, Trash2, User, Calendar, Sparkles } from "lucide-react";

// ВИПРАВЛЕНО: discount тепер number, щоб відповідати схемі бази даних
export interface Offer {
  id: string;
  type: "GLOBAL" | "HOT_SLOT";
  title: string;
  discount: number;
  master?:
    | {
        user?: {
          firstName: string;
          lastName: string;
        };
      }
    | string
    | null;
  service?: {
    name: string;
  } | null;
  dateTime?: string | Date | null;
}

interface OfferCardProps {
  offer: Offer;
  onRemove: (id: string) => void;
}

export function OfferCard({ offer, onRemove }: OfferCardProps) {
  const isHotSlot = offer.type === "HOT_SLOT";

  let masterName = null;
  if (typeof offer.master === "string") {
    masterName = offer.master;
  } else if (offer.master?.user) {
    masterName = `${offer.master.user.firstName} ${offer.master.user.lastName}`;
  }

  const formattedDate = offer.dateTime
    ? new Date(offer.dateTime).toLocaleString("uk-UA", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div
      className={`relative group p-4 sm:p-5 rounded-[2rem] border transition-all flex flex-col h-full ${
        isHotSlot
          ? "bg-orange-50/50 border-orange-100"
          : "bg-pink-50/50 border-pink-100"
      }`}
    >
      <div className="flex justify-between items-start mb-3 gap-2">
        <div
          className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight flex items-center gap-1.5 shrink-0 ${
            isHotSlot
              ? "bg-orange-100 text-orange-600"
              : "bg-pink-100 text-pink-600"
          }`}
        >
          {isHotSlot ? (
            <Flame className="w-3 h-3" />
          ) : (
            <Percent className="w-3 h-3" />
          )}
          {isHotSlot ? "Гаряче вікно" : "Акція"}
        </div>
        <button
          onClick={() => onRemove(offer.id)}
          className="p-2 -mr-2 -mt-2 text-slate-300 hover:text-rose-500 transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100 z-10"
        >
          <Trash2 className="w-4.5 h-4.5" />
        </button>
      </div>

      <h4 className="font-bold text-slate-800 text-sm mb-2 pr-2 line-clamp-2">
        {offer.title}
      </h4>

      <div className="flex items-end justify-between mt-auto pt-2 gap-3">
        <div className="space-y-1.5 min-w-0">
          {masterName && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium truncate">
              <User className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{masterName}</span>
            </div>
          )}

          {offer.service && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium truncate">
              <Sparkles className="w-3 h-3 text-orange-400 shrink-0" />
              <span className="truncate">{offer.service.name}</span>
            </div>
          )}

          {formattedDate && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium truncate">
              <Calendar className="w-3 h-3 text-slate-300 shrink-0" />
              <span className="truncate">{formattedDate}</span>
            </div>
          )}
        </div>
        {/* ВИПРАВЛЕНО: Відображення знижки як відсоток */}
        <div className="text-xl font-black text-slate-800 shrink-0 bg-white/60 px-2.5 py-1 rounded-xl">
          -{offer.discount}%
        </div>
      </div>
    </div>
  );
}
