"use client";

import { useState, useEffect } from "react";
import { Send, ExternalLink, RefreshCw, Unlink, Settings2 } from "lucide-react";
import {
  getTelegramData,
  disconnectTelegram,
} from "@/settings/telegram/actions";

export default function TelegramSettings() {
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [botLink, setBotLink] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      try {
        const data = await getTelegramData();
        if (isMounted && data) {
          setIsConnected(data.isConnected);
          setUsername(data.username);
          setBotLink(data.link);
        }
      } catch (error) {
        console.error("Помилка при завантаженні Telegram:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchStatus();
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const handleDisconnect = async () => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        "Ви впевнені, що хочете відключити бота? Це припинить можливість розсилок.",
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await disconnectTelegram();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Помилка при відключенні:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-5 lg:p-8 border border-white shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 lg:gap-6">
        {/* Ліва частина: Іконка та статус */}
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-sky-50 rounded-[1.2rem] flex items-center justify-center text-sky-500 shadow-inner relative shrink-0">
            <Send className="w-6 h-6 lg:w-7 lg:h-7 rotate-[15deg]" />
            {isConnected && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 lg:w-4 lg:h-4 bg-emerald-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg lg:text-xl font-bold text-slate-800 leading-tight truncate">
                Telegram Інтеграція
              </h3>
              {!isLoading && isConnected && (
                <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                  Active
                </span>
              )}
            </div>
            <div className="text-xs lg:text-sm text-slate-500 font-medium mt-1 truncate">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Перевірка
                  звязку...
                </span>
              ) : isConnected ? (
                `Бот: ${username}`
              ) : (
                "Система не підключена до бота"
              )}
            </div>
          </div>
        </div>

        {/* Права частина: Кнопки */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
          {isConnected ? (
            <>
              <a
                href={botLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-3 lg:py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl text-xs font-bold transition-all active:scale-95"
              >
                <Settings2 className="w-4 h-4" />
                Налаштувати
              </a>
              <button
                onClick={handleDisconnect}
                disabled={isLoading}
                className="w-full sm:w-auto flex justify-center items-center gap-2 bg-rose-50 text-rose-500 px-5 py-3 lg:py-2.5 rounded-2xl text-xs font-bold hover:bg-rose-100 transition-all active:scale-95 disabled:opacity-50"
              >
                <Unlink className="w-4 h-4" />
                Вимкнути
              </button>
            </>
          ) : (
            <a
              href={botLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex justify-center items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-8 py-3.5 lg:py-3 rounded-2xl text-sm lg:text-xs font-bold transition-all shadow-lg shadow-sky-100 active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              Підключити зараз
            </a>
          )}
        </div>
      </div>

      {!isConnected && !isLoading && (
        <div className="mt-5 lg:mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <p className="text-xs text-amber-700 font-medium leading-relaxed">
            Важливо: Без підключення до Telegram ви не зможете використовувати
            функцію <strong>«Швидка розсилка»</strong> для інформування клієнтів
            про гарячі вікна та акції.
          </p>
        </div>
      )}
    </div>
  );
}
