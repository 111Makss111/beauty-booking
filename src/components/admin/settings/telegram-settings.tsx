"use client";

import { useState, useEffect } from "react";
import { Send, ExternalLink, RefreshCw, Unlink, Settings2 } from "lucide-react";
// Переконайся, що файл actions.ts справді лежить за цим шляхом
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
        // Якщо data === null (немає сесії або юзера), код не впаде
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
    // Додаємо window.confirm для стабільності в Next.js
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
    <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-sky-50 rounded-[1.2rem] flex items-center justify-center text-sky-500 shadow-inner relative">
            <Send className="w-7 h-7 rotate-[15deg]" />
            {isConnected && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-800 leading-tight">
                Telegram Інтеграція
              </h3>
              {!isLoading && isConnected && (
                <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Active
                </span>
              )}
            </div>
            <div className="text-sm text-slate-500 font-medium mt-1">
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

        <div className="flex items-center gap-3">
          {isConnected ? (
            <>
              <a
                href={botLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl text-xs font-bold transition-all active:scale-95"
              >
                <Settings2 className="w-4 h-4" />
                Налаштувати
              </a>
              <button
                onClick={handleDisconnect}
                disabled={isLoading}
                className="flex items-center gap-2 bg-rose-50 text-rose-500 px-5 py-3 rounded-2xl text-xs font-bold hover:bg-rose-100 transition-all active:scale-95 disabled:opacity-50"
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
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-2xl text-xs font-bold transition-all shadow-lg shadow-sky-100 active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              Підключити зараз
            </a>
          )}
        </div>
      </div>

      {!isConnected && !isLoading && (
        <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
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
