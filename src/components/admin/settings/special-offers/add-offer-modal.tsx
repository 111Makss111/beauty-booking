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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-300 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
            <Plus className="w-6 h-6" />
          </div>
          Нове Гаряче вікно
        </h3>

        <div className="space-y-5">
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
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-rose-500 text-xs font-medium px-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <button
            onClick={handleAddOffer}
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-[1.8rem] font-bold text-sm transition-all shadow-xl shadow-slate-200 mt-4 active:scale-95 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Створити Гаряче вікно"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
