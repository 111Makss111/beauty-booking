"use client";

import { useState, useEffect } from "react";
import {
  getTelegramData,
  disconnectTelegram,
} from "@/settings/telegram/actions";

export default function TelegramCard() {
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [botLink, setBotLink] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Той самий "золотий ключик" для оновлення
  const [refreshKey, setRefreshKey] = useState(0);

  // Вся логіка тепер живе виключно всередині ефекту
  useEffect(() => {
    let isMounted = true; // Захист від витоку пам'яті

    const fetchStatus = async () => {
      try {
        const data = await getTelegramData();
        if (isMounted && data) {
          setIsConnected(data.isConnected);
          setUsername(data.username);
          setBotLink(data.link);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStatus();

    // Якщо компонент зникне до завершення завантаження, ми скасуємо оновлення стану
    return () => {
      isMounted = false;
    };
  }, [refreshKey]); // Ефект запуститься знову ТІЛЬКИ якщо зміниться refreshKey

  const handleDisconnect = async () => {
    setIsLoading(true);
    await disconnectTelegram();
    // Просто збільшуємо лічильник на 1, і useEffect сам зрозуміє, що треба оновити дані!
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border border-white flex flex-col gap-4 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#0088cc]/10 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#0088cc"
            className="w-6 h-6"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
          </svg>
        </div>
        <div>
          <h3 className="text-slate-800 font-bold text-lg">Telegram</h3>
          <p className="text-sm text-slate-500 font-medium h-5">
            {isLoading
              ? "Завантаження..."
              : isConnected && username
                ? username
                : "Не підключено"}
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-500 leading-relaxed">
        Нагадування і підтвердження будуть надсилатись в Telegram, де Ви зможете
        зручно керувати записами.
      </p>

      <div className="flex gap-3 mt-2">
        {isConnected ? (
          <>
            <button
              onClick={handleDisconnect}
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors active:scale-95 disabled:opacity-50"
            >
              Вимкнути
            </button>
            <a
              href={botLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-pink-400 to-pink-500 shadow-md shadow-pink-200 hover:shadow-lg transition-all active:scale-95 text-center disabled:opacity-50 flex items-center justify-center"
            >
              Перейти
            </a>
          </>
        ) : (
          <a
            href={botLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-3 px-4 rounded-xl font-bold text-white bg-[#0088cc] hover:bg-[#0077b3] shadow-md shadow-blue-200 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
          >
            {isLoading ? "Завантаження..." : "Підключити Telegram"}
          </a>
        )}
      </div>
    </div>
  );
}
