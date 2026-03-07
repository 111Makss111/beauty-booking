"use client";

import { useState, useEffect } from "react";
import { Sparkles, Plus, Loader2 } from "lucide-react";
import {
  getSpecialOffers,
  deleteSpecialOffer,
} from "@/admin/settings/offers-actions";

// Імпортуємо наші нові маленькі компоненти
import { OfferCard, Offer } from "./special-offers/offer-card";
import { BroadcastBlock } from "./special-offers/broadcast-block";
import { AddOfferModal } from "./special-offers/add-offer-modal";

export default function SpecialOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Завантажуємо акції при старті
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getSpecialOffers();
        setOffers(data as Offer[]);
      } catch (error) {
        console.error("Помилка завантаження акцій:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Видалення акції
  const handleRemoveOffer = async (id: string) => {
    try {
      await deleteSpecialOffer(id);
      setOffers((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Помилка видалення", err);
    }
  };

  // Додавання нової акції після її створення в модалці
  const handleOfferCreated = (newOffer: Offer) => {
    setOffers((prev) => [newOffer, ...prev]);
    setIsModalOpen(false); // Закриваємо модалку
  };

  if (isLoading && offers.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-sm flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Основний блок з акціями */}
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-sm transition-all relative">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 leading-tight">
                Акції та пропозиції
              </h2>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                Керування лояльністю
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-pink-100"
          >
            <Plus className="w-4 h-4" />
            Додати акцію
          </button>
        </div>

        {/* Сітка карток */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onRemove={handleRemoveOffer}
            />
          ))}

          {offers.length === 0 && !isLoading && (
            <div className="col-span-full py-10 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300">
              <p className="text-xs font-medium italic">
                Активних пропозицій немає
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Окремий блок розсилки */}
      <BroadcastBlock />

      {/* Модальне вікно (рендериться тільки якщо isModalOpen === true) */}
      {isModalOpen && (
        <AddOfferModal
          onClose={() => setIsModalOpen(false)}
          onCreated={handleOfferCreated}
        />
      )}
    </div>
  );
}
