"use client";

import { useSession } from "next-auth/react";
import WorkingHours from "./working-hours";
import TelegramSettings from "./telegram-settings";
import SpecialOffers from "./special-offers";

export default function SettingsLayout() {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const isAdmin = role === "ADMIN";
  const isMaster = role === "MASTER";

  return (
    <div className="w-full max-w-7xl mx-auto pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
        {/* Робочі години бачить ТІЛЬКИ адмін */}
        {isAdmin && (
          <div className="lg:col-span-5 w-full">
            <WorkingHours />
          </div>
        )}

        {/* Права частина адаптується під роль */}
        <div
          className={`${isAdmin ? "lg:col-span-7" : "lg:col-span-12"} w-full space-y-8`}
        >
          {/* Спеціальні пропозиції (розсилки) бачить ТІЛЬКИ адмін */}
          {isAdmin && <SpecialOffers />}

          {/* Telegram-блок бачать УСІ (і адмін, і майстер) */}
          <TelegramSettings />

          {/* Додаткова картка для майстра (опціонально) */}
          {isMaster && (
            <div className="p-8 bg-pink-50/50 rounded-[2.5rem] border border-pink-100 text-center">
              <h3 className="font-bold text-pink-600">
                Вітаємо у вашому кабінеті!
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Підключіть Telegram, щоб отримувати миттєві сповіщення про нові
                записи та зміни у вашому графіку.
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-slate-400 text-[10px] mt-16 uppercase tracking-widest opacity-60">
        Beauty Nails Professional • Settings v4.1
      </p>
    </div>
  );
}
