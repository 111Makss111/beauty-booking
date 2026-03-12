"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, Receipt, Clock, Sparkles } from "lucide-react";
import { Master } from "./master-selection";
import { formatPrice } from "@/lib/utils/currency";
import { createAppointment } from "@/actions/appointments"; // Імпортуємо наш екшен
import { useRouter } from "next/navigation";

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
}: ExtraOptionsSelectionProps) {
  const router = useRouter();
  const [options, setOptions] = useState<ExtraOption[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  // СТАН ДЛЯ БОНУСІВ
  const [useBonuses, setUseBonuses] = useState(false);
  const [userBonusBalance, setUserBonusBalance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Отримуємо допи та дані про поточного клієнта (баланс)
        const [extrasRes, userRes] = await Promise.all([
          fetch("/api/klient/extra-options"),
          fetch("/api/klient/me"),
        ]);

        if (extrasRes.ok) setOptions(await extrasRes.json());
        if (userRes.ok) {
          const userData = await userRes.json();
          setUserBonusBalance(userData.bonusBalance || 0);
        }
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleOption = (option: ExtraOption) => {
    setSelectedExtras((prev) =>
      prev.some((item) => item.id === option.id)
        ? prev.filter((item) => item.id !== option.id)
        : [...prev, option],
    );
  };

  // РОЗРАХУНОК ЦІНИ
  const extrasPrice = selectedExtras.reduce((sum, opt) => sum + opt.price, 0);
  const baseTotalPrice = selectedService.price + extrasPrice;

  // Клієнт може оплатити бонусами не більше 50% вартості
  const maxBonusDiscount = baseTotalPrice * 0.5;
  const actualBonusDiscount = useBonuses
    ? Math.min(userBonusBalance, maxBonusDiscount)
    : 0;

  const finalPrice = baseTotalPrice - actualBonusDiscount;

  const totalDuration =
    selectedService.duration + (selectedExtras.length > 0 ? 30 : 0);

  const formattedDate = selectedDate.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
  });

  // ФУНКЦІЯ ПІДТВЕРДЖЕННЯ ЗАПИСУ
  const handleFinalBooking = async () => {
    setIsBooking(true);
    try {
      const result = await createAppointment({
        serviceId: selectedService.id,
        masterId: selectedMaster.id,
        dateTime: selectedDate,
        useBonuses: useBonuses,
      });

      if (result.success) {
        router.push("/dashboard/my-bookings?status=success");
      } else {
        alert(result.error || "Помилка при бронюванні");
      }
    } catch (error) {
      alert("Виникла непередбачувана помилка");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-pink-300">
        <Loader2 className="w-8 h-8 animate-spin mb-3" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-center">
          Завантажуємо
          <br />
          ваш рахунок...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
      <h3 className="text-sm font-bold text-slate-800 mb-4 px-1">
        Додаткові опції
      </h3>

      {/* Список доп. послуг */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar mb-4">
        {options.length > 0 &&
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
                  + {formatPrice(option.price)}
                </span>
              </button>
            );
          })}
      </div>

      {/* БЛОК БОНУСІВ (показуємо, якщо баланс > 0) */}
      {userBonusBalance > 0 && (
        <button
          onClick={() => setUseBonuses(!useBonuses)}
          className={`mb-4 p-4 rounded-[1.5rem] border-2 transition-all flex items-center justify-between ${
            useBonuses
              ? "bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-200"
              : "bg-white border-pink-100 text-slate-700 hover:border-pink-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${useBonuses ? "bg-white/20" : "bg-pink-50"}`}
            >
              <Sparkles
                className={`w-5 h-5 ${useBonuses ? "text-white" : "text-pink-500"}`}
              />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                Бонусна програма
              </p>
              <p className="text-sm font-black">
                {useBonuses
                  ? `Списуємо ${formatPrice(actualBonusDiscount)}`
                  : `Доступно ${formatPrice(userBonusBalance)}`}
              </p>
            </div>
          </div>
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              useBonuses ? "border-white bg-white" : "border-pink-200"
            }`}
          >
            {useBonuses && <Check className="w-4 h-4 text-pink-500" />}
          </div>
        </button>
      )}

      {/* ПІДСУМКОВИЙ ЧЕК */}
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
          {useBonuses && (
            <div className="flex justify-between text-pink-500 font-bold">
              <span>Знижка (бонуси):</span>
              <span>-{formatPrice(actualBonusDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Тривалість:
            </span>
            <span>~{totalDuration} хв</span>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Разом до сплати
          </span>
          <span className="text-xl font-black text-pink-600">
            {formatPrice(finalPrice)}
          </span>
        </div>
      </div>

      <button
        onClick={handleFinalBooking}
        disabled={isBooking}
        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isBooking ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Підтвердити запис"
        )}
      </button>
    </div>
  );
}
