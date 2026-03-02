"use client";

import { useState, useEffect } from "react";
import ToggleSwitch from "./ui/toggle-switch";
import {
  getNotificationSettings,
  updateNotificationSetting,
} from "@/settings/actions";
import { testDelayedNotification } from "@/settings/telegram/actions";

export default function NotificationsBlock() {
  const [appointments, setAppointments] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getNotificationSettings();
        if (data) {
          setAppointments(data.notifyAppointments);
          setPromotions(data.notifyPromotions);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = async (
    field: "notifyAppointments" | "notifyPromotions",
    currentValue: boolean,
    setter: (val: boolean) => void,
  ) => {
    const newValue = !currentValue;
    setter(newValue);

    try {
      await updateNotificationSetting(field, newValue);
    } catch (error) {
      console.error(error);
      setter(currentValue);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult("");
    try {
      const res = await testDelayedNotification();
      if (res.error) {
        setTestResult(`❌ ${res.error}`);
      } else {
        setTestResult("✅ Повідомлення надіслано!");
      }
    } catch (error) {
      setTestResult("❌ Помилка: Vercel обірвав з'єднання (Таймаут 10-15с)");
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-8 shadow-sm border border-white h-full flex items-center justify-center">
        <div className="text-slate-400 font-medium">
          Завантаження налаштувань...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-8 shadow-sm border border-white h-full flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center text-xl">
          🔔
        </div>
        <div>
          <h3 className="text-slate-800 font-bold text-xl">Сповіщення</h3>
          <p className="text-sm text-slate-500 font-medium">
            Керуйте тим, які повідомлення ви отримуєте
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 flex-1 justify-center">
        <div className="flex items-center justify-between group">
          <div className="pr-4">
            <h4 className="text-slate-800 font-bold text-md mb-1 group-hover:text-pink-600 transition-colors">
              Нагадування про записи
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Отримуйте повідомлення за 24 години та за 2 години до вашого
              візиту, а також інформацію про підтвердження або скасування.
            </p>
          </div>
          <ToggleSwitch
            checked={appointments}
            onChange={() =>
              handleToggle("notifyAppointments", appointments, setAppointments)
            }
          />
        </div>

        <div className="h-px w-full bg-slate-100 rounded-full"></div>

        <div className="flex items-center justify-between group">
          <div className="pr-4">
            <h4 className="text-slate-800 font-bold text-md mb-1 group-hover:text-pink-600 transition-colors">
              Акції та пропозиції
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Отримуйте інформацію про знижки, нові послуги та спеціальні
              пропозиції від нашого салону.
            </p>
          </div>
          <ToggleSwitch
            checked={promotions}
            onChange={() =>
              handleToggle("notifyPromotions", promotions, setPromotions)
            }
          />
        </div>

        {/* --- ТЕСТОВА ЗОНА --- */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col items-center gap-2">
          <button
            onClick={handleTest}
            disabled={isTesting}
            className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-xl hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            {isTesting
              ? "Очікуємо 1 хвилину..."
              : "Відправити тестове нагадування (1 хв)"}
          </button>
          {testResult && (
            <span
              className={`text-sm font-medium ${testResult.includes("❌") ? "text-red-500" : "text-green-500"}`}
            >
              {testResult}
            </span>
          )}
        </div>
        {/* --- КІНЕЦЬ ТЕСТОВОЇ ЗОНИ --- */}
      </div>
    </div>
  );
}
