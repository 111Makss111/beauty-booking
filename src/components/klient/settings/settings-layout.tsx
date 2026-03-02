"use client";

import TelegramCard from "./telegram-card";
import NotificationsBlock from "./notifications-block";

export default function SettingsLayout() {
  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8 pl-2">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Налаштування</h2>
        <p className="text-slate-500 font-medium">
          Керуйте сповіщеннями, безпекою облікового запису та додатковими
          інтеграціями
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <NotificationsBlock />
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border border-white flex flex-col gap-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center">
                ✨
              </div>
              <h3 className="text-slate-800 font-bold text-lg">Мої бонуси</h3>
            </div>
            <p className="text-sm text-slate-500">
              Нагадування і підтвердження будуть надсилатись в Telegram, де Ви
              зможете керувати записами.
            </p>
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 text-sm font-medium">
              Функціонал у розробці
            </div>
          </div>

          <TelegramCard />
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3 text-slate-400 text-sm pl-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
            clipRule="evenodd"
          />
        </svg>
        <p className="font-medium">
          Ми використовуємо шифроване підключення, Ваші дані в безпеці.
        </p>
      </div>
    </div>
  );
}
