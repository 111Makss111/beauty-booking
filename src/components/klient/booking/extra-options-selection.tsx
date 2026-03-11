"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, Receipt, Clock } from "lucide-react";
import { Master } from "./master-selection";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export interface ExtraOption {
  id: string;
  name: string;
  price: number;
}

interface ExtraOptionsSelectionProps {
  selectedService: Service;
  selectedMaster: Master;
  selectedDate: Date;
  selectedTime: string;
  onConfirm: (selectedExtras: ExtraOption[]) => void;
}

export default function ExtraOptionsSelection({
  selectedService,
  selectedMaster,
  selectedDate,
  selectedTime,
  onConfirm,
}: ExtraOptionsSelectionProps) {
  const [options, setOptions] = useState<ExtraOption[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch("/api/klient/extra-options");
        if (res.ok) {
          const data = await res.json();
          setOptions(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const toggleOption = (option: ExtraOption) => {
    setSelectedExtras((prev) =>
      prev.some((item) => item.id === option.id)
        ? prev.filter((item) => item.id !== option.id)
        : [...prev, option],
    );
  };

  const extrasPrice = selectedExtras.reduce((sum, opt) => sum + opt.price, 0);
  const totalPrice = selectedService.price + extrasPrice;
  const totalDuration =
    selectedService.duration + (selectedExtras.length > 0 ? 30 : 0);

  const formattedDate = selectedDate.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-pink-300">
        <Loader2 className="w-8 h-8 animate-spin mb-3" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-center">
          Рахуємо
          <br />
          підсумок...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-sm font-bold text-slate-800 mb-4 px-1">
        Додаткові опції
      </h3>

      <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar mb-4">
        {options.length === 0 ? (
          <p className="text-center text-slate-400 text-xs py-4">
            Немає додаткових опцій
          </p>
        ) : (
          options.map((option) => {
            const isSelected = selectedExtras.some(
              (item) => item.id === option.id,
            );
            return (
              <button
                key={option.id}
                onClick={() => toggleOption(option)}
                className={`w-full flex items-center justify-between p-3.5 rounded-[1.2rem] border transition-all text-left ${
                  isSelected
                    ? "bg-pink-50 border-pink-200 shadow-sm"
                    : "bg-white border-slate-100 hover:border-pink-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-pink-500 border-pink-500"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span
                    className={`text-sm font-bold ${isSelected ? "text-pink-700" : "text-slate-700"}`}
                  >
                    {option.name}
                  </span>
                </div>
                <span className="text-xs font-black text-slate-400">
                  +€{option.price}
                </span>
              </button>
            );
          })
        )}
      </div>

      <div className="bg-slate-50 rounded-[1.5rem] p-4 mb-4 border border-slate-100">
        <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold text-sm">
          <Receipt className="w-4 h-4 text-pink-500" />
          Ваш запис
        </div>

        <div className="space-y-2 text-xs font-medium text-slate-500 border-b border-slate-200 pb-3 mb-3">
          <div className="flex justify-between">
            <span>Майстер:</span>
            <span className="text-slate-800 font-bold">
              {selectedMaster.firstName} {selectedMaster.lastName || ""}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Дата та час:</span>
            <span className="text-slate-800 font-bold">
              {formattedDate} о {selectedTime}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Тривалість:
            </span>
            <span>~{totalDuration} хв</span>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Разом
          </span>
          <span className="text-2xl font-black text-pink-500">
            €{totalPrice}
          </span>
        </div>
      </div>

      <button
        onClick={() => onConfirm(selectedExtras)}
        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-slate-200"
      >
        Підтвердити запис
      </button>
    </div>
  );
}
