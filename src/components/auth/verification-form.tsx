"use client";

import { useState } from "react";
import { verifyEmailCode } from "@/auth/auth";
import { useRouter } from "next/navigation";

export default function VerificationForm({ email }: { email: string }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Викликаємо нашу серверну функцію для перевірки коду
    const result = await verifyEmailCode(email, code);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      // Якщо код правильний, оновлюємо сторінку
      // Сервер побачить зміну в базі і автоматично пустить у кабінет
      router.refresh();
    }
  };

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ec4899"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"></path>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          <path d="m16 19 2 2 4-4"></path>
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        Підтвердіть пошту
      </h2>
      <p className="text-slate-500 mb-6 text-sm">
        Ми відправили 6-значний код на <br />
        <span className="font-bold text-slate-700">{email}</span>
      </p>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 animate-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          maxLength={6}
          placeholder="123456"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} // Дозволяємо вводити тільки цифри
          className="w-full text-center tracking-[0.5em] text-2xl font-bold px-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-pink-400 focus:bg-white outline-none transition-all disabled:opacity-50"
          required
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading || code.length !== 6}
          className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-pink-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? "Перевірка..." : "Підтвердити код"}
        </button>
      </form>

      <button
        onClick={() =>
          (window.location.href = "/api/auth/signout?callbackUrl=/")
        }
        className="mt-6 text-sm text-slate-400 hover:text-pink-500 transition-colors"
      >
        Вийти та спробувати з іншим акаунтом
      </button>
    </div>
  );
}
