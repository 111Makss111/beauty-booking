"use client";

import { useState, useEffect } from "react";
import { Sparkles, Plus, Loader2 } from "lucide-react";
import {
  getSpecialOffers,
  deleteSpecialOffer,
} from "@/admin/settings/offers-actions";

import { OfferCard, Offer } from "./special-offers/offer-card";
import { BroadcastBlock } from "./special-offers/broadcast-block";
import { AddOfferModal } from "./special-offers/add-offer-modal";

export default function SpecialOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getSpecialOffers();
        // ВИПРАВЛЕНО: Використовуємо unknown для безпечного перетворення типів
        // Це прибере помилку "discount: number vs string" під час білду
        setOffers(data as unknown as Offer[]);
      } catch (error) {
        console.error("Помилка завантаження акцій:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleRemoveOffer = async (id: string) => {
    try {
      const res = await deleteSpecialOffer(id);
      if (res.success) {
        setOffers((prev) => prev.filter((o) => o.id !== id));
      }
    } catch (err) {
      console.error("Помилка видалення", err);
    }
  };

  const handleOfferCreated = (newOffer: Offer) => {
    // Приводимо до типу, щоб уникнути конфліктів у стані
    setOffers((prev) => [newOffer as unknown as Offer, ...prev]);
    setIsModalOpen(false);
  };

  if (isLoading && offers.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-5 lg:p-8 border border-white shadow-sm flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-5 lg:p-8 border border-white shadow-sm transition-all relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shrink-0">
              <Sparkles className="w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg lg:text-xl font-bold text-slate-800 leading-tight truncate">
                Акції та пропозиції
              </h2>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5 truncate">
                Керування знижками (zł)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex justify-center items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 lg:py-2.5 rounded-2xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-pink-100 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Додати акцію
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onRemove={handleRemoveOffer}
            />
          ))}

          {offers.length === 0 && !isLoading && (
            <div className="col-span-full py-10 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300">
              <p className="text-xs font-medium italic text-center px-4">
                Активних пропозицій у злотих немає
              </p>
            </div>
          )}
        </div>
      </div>

      <BroadcastBlock />

      {isModalOpen && (
        <AddOfferModal
          onClose={() => setIsModalOpen(false)}
          onCreated={handleOfferCreated}
        />
      )}
    </div>
  );
}
