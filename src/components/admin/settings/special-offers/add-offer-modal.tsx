"use client";

import { useState, useEffect } from "react";
import { Plus, X, Loader2, AlertCircle } from "lucide-react";
import { createSpecialOffer } from "@/admin/settings/offers-actions";
import { getMastersList } from "@/admin/settings/masters-actions";
import { getServicesList } from "@/admin/settings/services-actions";
import { Offer } from "../special-offers/offer-card";

import { MasterSelect } from "./form/master-select";
import { ServiceSelect } from "./form/service-select";
import { DateTimeSelect } from "./form/date-time-select";

interface AddOfferModalProps {
  onClose: () => void;
  onCreated: (offer: Offer) => void;
}

interface Master {
  id: string;
  firstName: string;
  lastName: string;
}

interface Service {
  id: string;
  name: string;
}

export function AddOfferModal({ onClose, onCreated }: AddOfferModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [masters, setMasters] = useState<Master[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [newOffer, setNewOffer] = useState({
    discount: "",
    masterId: "",
    serviceId: "",
    dateVal: "",
    timeVal: "",
  });

  useEffect(() => {
    async function fetchAllData() {
      try {
        const [mastersData, servicesData] = await Promise.all([
          getMastersList(),
          getServicesList(),
        ]);
        setMasters(mastersData);
        setServices(servicesData);
      } catch (err) {
        setError("Помилка завантаження даних для форми.");
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchAllData();
  }, []);

  const handleAddOffer = async () => {
    if (
      !newOffer.discount ||
      !newOffer.masterId ||
      !newOffer.serviceId ||
      !newOffer.dateVal ||
      !newOffer.timeVal
    ) {
      setError("Будь ласка, заповніть усі поля");
      return;
    }

    setIsLoading(true);
    setError(null);

    const combinedDate = `${newOffer.dateVal} ${newOffer.timeVal}`;

    const selectedService = services.find((s) => s.id === newOffer.serviceId);
    const generatedTitle = selectedService
      ? selectedService.name
      : "Гаряче вікно";

    try {
      const created = await createSpecialOffer({
        type: "HOT_SLOT",
        title: generatedTitle,
        discount: newOffer.discount,
        masterId: newOffer.masterId,
        serviceId: newOffer.serviceId,
        dateTimeStr: combinedDate,
      });

      const selectedMaster = masters.find((m) => m.id === newOffer.masterId);
      const masterName = selectedMaster
        ? `${selectedMaster.firstName} ${selectedMaster.lastName}`
        : undefined;

      onCreated({
        ...created,
        master: masterName,
      } as Offer);
    } catch (err) {
      setError("Помилка створення. Перевірте з'єднання або дані.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Клікабельний фон для закриття вікна на мобільному */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Змінено структуру контейнера для правильного скролу */}
      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-lg p-5 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-300 relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 sm:right-6 sm:top-6 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors z-10 bg-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-5 sm:mb-6 flex items-center gap-3 pr-8 shrink-0">
          <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shrink-0">
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="truncate">Нове Гаряче вікно</span>
        </h3>

        {/* Форма поміщена в окремий блок зі скролом */}
        <div className="overflow-y-auto custom-scrollbar flex-1 -mr-2 pr-2 space-y-4 sm:space-y-5 pb-2">
          <ServiceSelect
            value={newOffer.serviceId}
            onChange={(val) => setNewOffer({ ...newOffer, serviceId: val })}
            services={services}
            isLoading={isLoadingData}
          />

          <MasterSelect
            value={newOffer.masterId}
            onChange={(val) => setNewOffer({ ...newOffer, masterId: val })}
            masters={masters}
            isLoading={isLoadingData}
          />

          <DateTimeSelect
            dateVal={newOffer.dateVal}
            timeVal={newOffer.timeVal}
            onDateChange={(val) => setNewOffer({ ...newOffer, dateVal: val })}
            onTimeChange={(val) => setNewOffer({ ...newOffer, timeVal: val })}
          />

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 ml-4 mb-1.5 block">
              Знижка / Ціна
            </label>
            <input
              type="text"
              value={newOffer.discount}
              onChange={(e) =>
                setNewOffer({ ...newOffer, discount: e.target.value })
              }
              placeholder="Наприклад: -20% або 500₴"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-rose-500 text-xs font-medium px-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="truncate">{error}</span>
            </div>
          )}

          <button
            onClick={handleAddOffer}
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 sm:py-4 rounded-[1.8rem] font-bold text-sm transition-all shadow-xl shadow-slate-200 mt-2 sm:mt-4 active:scale-95 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin shrink-0" />
            ) : (
              "Створити Гаряче вікно"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
