"use client";

import { useEffect, useState } from "react";
import { User, Loader2, Star, X, MessageSquare } from "lucide-react";

// 1. ОНОВЛЕНІ ТИПИ ДЛЯ РЕАЛЬНИХ ДАНИХ
export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  clientName: string;
  clientImage: string | null;
}

export interface Master {
  id: string;
  firstName: string;
  lastName?: string | null;
  rating: number;
  reviewsCount: number;
  image?: string | null;
  reviews: Review[];
}

interface MasterSelectionProps {
  selectedMasterId: string | null;
  onSelect: (master: Master) => void;
}

export default function MasterSelection({
  selectedMasterId,
  onSelect,
}: MasterSelectionProps) {
  const [masters, setMasters] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);

  // Стан для модального вікна з відгуками
  const [reviewsModalMaster, setReviewsModalMaster] = useState<Master | null>(
    null,
  );

  useEffect(() => {
    const loadMasters = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/klient/masters");
        if (!res.ok) throw new Error("Помилка мережі");

        // Тепер ми просто отримуємо готові реальні дані з нашого оновленого API
        const data: Master[] = await res.json();
        setMasters(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMasters();
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
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500 relative">
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
            <div
              key={master.id}
              onClick={() => onSelect(master)}
              className={`w-full flex items-center gap-4 p-3 rounded-[1.8rem] border transition-all duration-300 cursor-pointer group ${
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

                {/* КНОПКА ВІДКРИТТЯ ВІДГУКІВ */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Зупиняє клік, щоб не обрати майстра випадково
                    if (master.reviewsCount > 0) setReviewsModalMaster(master);
                  }}
                  className={`flex items-center gap-1.5 px-2 py-1 -ml-2 rounded-lg transition-colors ${
                    master.reviewsCount > 0
                      ? "hover:bg-slate-100"
                      : "cursor-default"
                  }`}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${master.rating > 0 ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
                  />
                  <span className="text-xs font-bold text-slate-700">
                    {master.rating > 0 ? master.rating.toFixed(1) : "Новий"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    ({master.reviewsCount} відгуків)
                  </span>
                </button>
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
            </div>
          ))
        )}
      </div>

      {/* 2. МОДАЛЬНЕ ВІКНО З ВІДГУКАМИ */}
      {reviewsModalMaster && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md rounded-[2.5rem] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100 shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">
                  Відгуки клієнтів
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">
                  {reviewsModalMaster.firstName}
                </p>
              </div>
            </div>
            <button
              onClick={() => setReviewsModalMaster(null)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3 bg-slate-50/50">
            {reviewsModalMaster.reviews.length === 0 ? (
              <p className="text-center text-slate-400 text-xs mt-10">
                Ще немає відгуків
              </p>
            ) : (
              reviewsModalMaster.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
                        {review.clientImage ? (
                          <img
                            src={review.clientImage}
                            alt="Клієнт"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-700">
                        {review.clientName}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(review.createdAt).toLocaleDateString("uk-UA")}
                    </span>
                  </div>

                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-100"}`}
                      />
                    ))}
                  </div>

                  {review.comment ? (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {review.comment}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      Оцінка без коментаря
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
