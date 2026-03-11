"use client";

import { useEffect, useState } from "react";
import { ImageIcon, Loader2, Clock, Euro } from "lucide-react";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  image?: string | null;
}

interface ServiceSelectionProps {
  selectedServiceId: string | null;
  onSelect: (service: Service) => void;
}

export default function ServiceSelection({
  selectedServiceId,
  onSelect,
}: ServiceSelectionProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Завантажуємо послуги з нашого API
  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/klient");
        if (!res.ok) throw new Error("Помилка мережі");
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error("Не вдалося завантажити послуги:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-pink-300">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
          Оновлюємо прайс...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-bold text-slate-800 mb-5 px-1">
        Оберіть послугу
      </h3>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {services.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-10">
            Послуг поки немає...
          </p>
        ) : (
          services.map((service) => (
            <button
              key={service.id}
              onClick={() => onSelect(service)}
              className={`w-full flex items-center gap-4 p-3 rounded-[1.8rem] border transition-all duration-300 text-left group ${
                selectedServiceId === service.id
                  ? "bg-pink-50 border-pink-200 shadow-sm ring-1 ring-pink-100"
                  : "bg-white border-slate-100 hover:border-pink-100 hover:shadow-md"
              }`}
            >
              {/* Фото послуги або іконка-заглушка */}
              <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                ) : (
                  <ImageIcon className="w-7 h-7 text-slate-200" />
                )}
              </div>

              {/* Текстова інформація */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-700 text-sm leading-tight mb-1 truncate">
                  {service.name}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span className="text-[11px] font-semibold">
                      {service.duration} хв
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 text-pink-500 font-black">
                    <span className="text-[11px]">€</span>
                    <span className="text-xs">{service.price}</span>
                  </div>
                </div>
              </div>

              {/* Кастомний радіо-індикатор */}
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedServiceId === service.id
                    ? "border-pink-400 bg-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.3)]"
                    : "border-slate-100 bg-slate-50 group-hover:border-pink-200"
                }`}
              >
                {selectedServiceId === service.id && (
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
