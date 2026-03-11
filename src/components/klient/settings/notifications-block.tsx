"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import ToggleSwitch from "./ui/toggle-switch";
import { updateNotificationSetting } from "@/settings/actions/notifications";

// Правило №99: Складний тип винесено в інтерфейс
interface NotificationSettings {
  notifyAppointments: boolean;
  notifyPromotions: boolean;
}

interface NotificationsBlockProps {
  initialSettings: NotificationSettings; // Правило №105: Дані з сервера
}

export default function NotificationsBlock({
  initialSettings,
}: NotificationsBlockProps) {
  const [settings, setSettings] =
    useState<NotificationSettings>(initialSettings);
  const [isUpdating, setIsUpdating] = useState<
    keyof NotificationSettings | null
  >(null);

  const handleToggle = async (field: keyof NotificationSettings) => {
    const oldValue = settings[field];
    const newValue = !oldValue;

    // Оптимістичне оновлення UI
    setSettings((prev) => ({ ...prev, [field]: newValue }));
    setIsUpdating(field);

    try {
      const result = await updateNotificationSetting(field, newValue);

      // Правило №42: Обробка помилки з сервера
      if (result && "error" in result) {
        throw new Error(result.error);
      }

      toast.success("Налаштування збережено");
    } catch (error) {
      // Правило №38: Звужуємо тип unknown без використання any
      const errorMessage =
        error instanceof Error ? error.message : "Сталася помилка";

      setSettings((prev) => ({ ...prev, [field]: oldValue }));
      toast.error(errorMessage);
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-8 shadow-sm border border-white h-full flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center text-xl">
          🔔
        </div>
        <div>
          <h3 className="text-slate-800 font-bold text-xl">Сповіщення</h3>
          <p className="text-sm text-slate-500 font-medium">
            Керуйте вашими повідомленнями
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
              Підтвердження, скасування та нагадування за 24 і 2 години до
              візиту.
            </p>
          </div>
          <ToggleSwitch
            checked={settings.notifyAppointments}
            disabled={isUpdating === "notifyAppointments"}
            onChange={() => handleToggle("notifyAppointments")}
          />
        </div>

        <div className="h-px w-full bg-slate-100 rounded-full"></div>

        <div className="flex items-center justify-between group">
          <div className="pr-4">
            <h4 className="text-slate-800 font-bold text-md mb-1 group-hover:text-pink-600 transition-colors">
              Акції та пропозиції
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Інформація про знижки та спеціальні пропозиції нашого салону.
            </p>
          </div>
          <ToggleSwitch
            checked={settings.notifyPromotions}
            disabled={isUpdating === "notifyPromotions"}
            onChange={() => handleToggle("notifyPromotions")}
          />
        </div>
      </div>
    </div>
  );
}
