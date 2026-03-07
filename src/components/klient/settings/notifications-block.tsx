"use client";

import { useState, useEffect } from "react";
import ToggleSwitch from "./ui/toggle-switch";
import {
  getNotificationSettings,
  updateNotificationSetting,
} from "@/settings/actions";

export default function NotificationsBlock() {
  const [appointments, setAppointments] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      </div>
    </div>
  );
}
