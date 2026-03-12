"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Star,
  Eye,
  EyeOff,
  Trash2,
  User,
  MessageSquare,
} from "lucide-react";
import {
  getAdminReviews,
  toggleReviewVisibility,
  deleteReview,
} from "@/actions/reviews";

// Створюємо точний інтерфейс замість any (Правило №99)
export interface AdminReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  isVisible: boolean;
  createdAt: Date | string;
  appointment: {
    client: {
      firstName: string;
      lastName: string | null;
      image: string | null;
    };
    master: {
      user: {
        firstName: string;
        lastName: string | null;
      };
    };
    service: {
      name: string;
    };
  };
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<AdminReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    // Перенесли функцію сюди, щоб уникнути помилки ініціалізації
    const loadReviews = async () => {
      setLoading(true);
      const res = await getAdminReviews();

      if (res.success && res.data) {
        // Завдяки unknown ми безпечно приводимо тип без використання any (Правило №3)
        setReviews(res.data as unknown as AdminReviewItem[]);
      }
      setLoading(false);
    };

    loadReviews();
  }, []);

  const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
    setProcessingId(id);
    const res = await toggleReviewVisibility(id, !currentStatus);

    if (res.success) {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, isVisible: !currentStatus } : r,
        ),
      );
    } else {
      alert("Помилка оновлення статусу");
    }

    setProcessingId(null);
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Ви впевнені, що хочете видалити цей відгук назавжди? Це вплине на рейтинг майстра.",
      )
    ) {
      return;
    }

    setProcessingId(id);
    const res = await deleteReview(id);

    if (res.success) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert("Помилка видалення");
    }

    setProcessingId(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-20">
        <Loader2 className="w-10 h-10 animate-spin text-pink-400 mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          Завантажуємо відгуки...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white/60 backdrop-blur-md rounded-[2.5rem] p-5 md:p-8 border border-white shadow-sm animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center gap-3 mb-8 ml-2">
        <div className="w-12 h-12 bg-pink-100 text-pink-500 rounded-2xl flex items-center justify-center">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800">
            Модерація відгуків
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Керування репутацією салону
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-center text-slate-400 py-10">
            Ще немає жодного відгуку
          </p>
        ) : (
          reviews.map((review) => {
            const isProcessing = processingId === review.id;
            const client = review.appointment.client;
            const master = review.appointment.master.user;

            return (
              <div
                key={review.id}
                className={`bg-white border rounded-[2rem] p-5 flex flex-col md:flex-row gap-4 justify-between transition-all ${
                  review.isVisible
                    ? "border-slate-100 shadow-sm"
                    : "border-rose-100 bg-rose-50/30 opacity-75"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden">
                        {client.image ? (
                          <img
                            src={client.image}
                            alt="Client"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-slate-400 m-2" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-700">
                          {client.firstName} {client.lastName}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Майстер: {master.firstName} (
                          {review.appointment.service.name})
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(review.createdAt).toLocaleDateString("uk-UA", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-100 text-slate-100"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {review.comment || (
                      <span className="italic text-slate-400">
                        Без коментаря
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex flex-row md:flex-col gap-2 justify-center shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4">
                  <button
                    onClick={() =>
                      handleToggleVisibility(review.id, review.isVisible)
                    }
                    disabled={isProcessing}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      review.isVisible
                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        : "bg-green-100 text-green-600 hover:bg-green-200"
                    }`}
                  >
                    {review.isVisible ? (
                      <>
                        <EyeOff className="w-4 h-4" /> Приховати
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" /> Показати
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 text-xs font-bold transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Видалити
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
