"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { sendBroadcastToClients } from "@/settings/telegram/actions";

export function BroadcastBlock() {
  const [isSending, setIsSending] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [broadcastText, setBroadcastText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSendBroadcast = async () => {
    if (!broadcastText.trim()) return;
    setIsSending(true);
    setError(null);
    try {
      const result = await sendBroadcastToClients(broadcastText);
      if (result.error) {
        setError(result.error);
      } else {
        setBroadcastSent(true);
        setBroadcastText("");
        setTimeout(() => setBroadcastSent(false), 3000);
      }
    } catch (err) {
      setError("Помилка розсилки.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200 border border-slate-800 overflow-hidden relative mt-6">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-sky-500/20 rounded-2xl flex items-center justify-center text-sky-400">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white leading-tight">
              Швидка розсилка
            </h2>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
              Повідомлення всім клієнтам
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <textarea
            value={broadcastText}
            onChange={(e) => setBroadcastText(e.target.value)}
            placeholder="Напишіть текст повідомлення..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-[1.5rem] p-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 min-h-[120px] transition-all resize-none"
          />
          {error && (
            <div className="flex items-center gap-2 text-rose-400 text-xs font-medium px-4">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
          <button
            onClick={handleSendBroadcast}
            disabled={isSending || !broadcastText.trim()}
            className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              broadcastSent
                ? "bg-emerald-500 text-white"
                : "bg-sky-500 hover:bg-sky-600 text-white disabled:opacity-50 disabled:grayscale"
            }`}
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : broadcastSent ? (
              <>
                <CheckCircle2 className="w-5 h-5" /> Повідомлення надіслано!
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Надіслати всім клієнтам
              </>
            )}
          </button>
        </div>
      </div>
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl" />
    </div>
  );
}
