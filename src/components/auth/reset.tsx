"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/auth/auth";

// Внутрішній компонент форми, який працює з URL-параметрами
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!token) {
      setError("Недійсне посилання для скидання пароля. Зробіть новий запит.");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Пароль має містити щонайменше 6 символів.");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Паролі не співпадають!");
      setIsLoading(false);
      return;
    }

    const result = await resetPassword(token, newPassword);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setSuccess("Ваш пароль успішно змінено! Перенаправляємо на головну...");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  };

  const labelStyle =
    "block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1";
  const inputStyle =
    "w-full px-4 py-3 rounded-xl bg-white/80 border border-pink-100 focus:border-pink-400 outline-none transition-all disabled:opacity-50";
  const btnClickScale = "active:scale-[0.98] transition-all duration-150";

  return (
    <div className="w-full max-w-md bg-gradient-to-br from-pink-100 via-rose-50 to-pink-100 rounded-[2.5rem] shadow-2xl p-8 animate-in fade-in zoom-in-95">
      <h1
        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500 mb-2 italic text-center"
        style={{ fontFamily: "cursive" }}
      >
        Beauty Nails
      </h1>
      <p className="text-center text-slate-500 mb-8 font-medium">
        Створення нового пароля
      </p>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 animate-in slide-in-from-top-2">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 mb-4 text-sm text-emerald-600 bg-emerald-50 rounded-xl border border-emerald-100 animate-in slide-in-from-top-2">
          {success}
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <label className={labelStyle}>Новий пароль</label>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className={inputStyle}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[36px] text-slate-400 hover:text-pink-500 transition-colors"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.88 9.88L14.12 14.12" />
                  <path d="M2 2l20 20" />
                  <path d="M10.37 4.37a11 11 0 0 1 10.3 6.63" />
                  <path d="M12 8a4 4 0 0 1 3.18 6.42" />
                  <path d="M6.27 6.27a11 11 0 0 0-3.9 4.73" />
                  <path d="M14.91 14.91a4 4 0 0 1-5.82-5.82" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <div className="relative">
            <label className={labelStyle}>Підтвердіть пароль</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={inputStyle}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg mt-4 ${btnClickScale}`}
          >
            {isLoading ? "Збереження..." : "Зберегти новий пароль"}
          </button>
        </form>
      )}
    </div>
  );
}

// Головний компонент, який обгортає форму в Suspense (вимога Next.js)
export default function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Suspense
        fallback={
          <div className="text-pink-500 font-bold animate-pulse">
            Завантаження форми...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
