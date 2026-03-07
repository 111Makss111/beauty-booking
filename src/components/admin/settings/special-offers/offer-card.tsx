"use client";

import { Flame, Percent, Trash2, User, Calendar, Sparkles } from "lucide-react";

// Оновлюємо інтерфейс під реальні дані з нашої бази
export interface Offer {
  id: string;
  type: "GLOBAL" | "HOT_SLOT";
  title: string;
  discount: string;
  // Майстер тепер приходить як об'єкт з Prisma
  master?:
    | {
        user?: {
          firstName: string;
          lastName: string;
        };
      }
    | string
    | null;
  // Послуга теж приходить як об'єкт
  service?: {
    name: string;
  } | null;
  // Замість date у нас тепер dateTime
  dateTime?: string | Date | null;
}

interface OfferCardProps {
  offer: Offer;
  onRemove: (id: string) => void;
}

export function OfferCard({ offer, onRemove }: OfferCardProps) {
  const isHotSlot = offer.type === "HOT_SLOT";

  // Правильно дістаємо ім'я майстра з об'єкта Prisma
  let masterName = null;
  if (typeof offer.master === "string") {
    masterName = offer.master; // Для старих даних, якщо вони залишились
  } else if (offer.master?.user) {
    masterName = `${offer.master.user.firstName} ${offer.master.user.lastName}`;
  }

  // Красиво форматуємо дату (напр. "10 бер., 11:00")
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
      className={`relative group p-5 rounded-[2rem] border transition-all ${
        isHotSlot
          ? "bg-orange-50/50 border-orange-100"
          : "bg-pink-50/50 border-pink-100"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight flex items-center gap-1.5 ${
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
          className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <h4 className="font-bold text-slate-800 text-sm mb-1">{offer.title}</h4>

      <div className="flex items-end justify-between mt-2">
        <div className="space-y-1.5">
          {masterName && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <User className="w-3 h-3 text-slate-400" /> {masterName}
            </div>
          )}

          {/* Якщо є послуга, показуємо її */}
          {offer.service && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <Sparkles className="w-3 h-3 text-orange-400" />{" "}
              {offer.service.name}
            </div>
          )}

          {formattedDate && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <Calendar className="w-3 h-3 text-slate-300" /> {formattedDate}
            </div>
          )}
        </div>
        <div className="text-xl font-black text-slate-800">
          {offer.discount}
        </div>
      </div>
    </div>
  );
}
