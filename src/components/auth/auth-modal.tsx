"use client";

import { useState, useEffect } from "react";
import { registerUser, sendPasswordResetEmail } from "@/auth/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [view, setView] = useState<
    "welcome" | "login" | "register" | "forgot-password"
  >("welcome");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+380");

  const router = useRouter();

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setView("welcome");
        setError("");
        setSuccess("");
        setShowPassword(false);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await registerUser({
      firstName,
      lastName,
      email,
      phone,
      countryCode,
      password,
    });

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setSuccess("Акаунт створено! Тепер увійдіть.");
      setIsLoading(false);
      setTimeout(() => setView("login"), 2000);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setSuccess("Успішний вхід! Завантаження...");
      setTimeout(() => {
        onClose();
        router.push("/klient");
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signIn("google", { callbackUrl: "/klient" });
  };

  // НОВА ФУНКЦІЯ: Відправка листа для скидання пароля
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const result = await sendPasswordResetEmail(email);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Посилання для відновлення відправлено на вашу пошту!");
      setTimeout(() => setView("login"), 4000);
    }
    setIsLoading(false);
  };

  const labelStyle =
    "block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1";
  const inputStyle =
    "w-full px-4 py-3 rounded-xl bg-white/80 border border-pink-100 focus:border-pink-400 outline-none transition-all disabled:opacity-50";
  const btnClickScale = "active:scale-[0.98] transition-all duration-150";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-md bg-gradient-to-br from-pink-100 via-rose-50 to-pink-100 rounded-[2.5rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        {view !== "welcome" && (
          <button
            onClick={() => setView("welcome")}
            className="absolute top-6 left-6 text-slate-400 hover:text-pink-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        )}

        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-pink-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h1
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500 mb-8 italic text-center"
          style={{ fontFamily: "cursive" }}
        >
          Beauty Nails
        </h1>

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

        {view === "welcome" && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className={`w-full bg-white flex items-center justify-center gap-3 text-slate-700 font-bold py-4 rounded-2xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 ${btnClickScale}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="22px"
                height="22px"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              {isLoading ? "Завантаження..." : "Продовжити з Google"}
            </button>
            <div className="flex items-center gap-3 my-2 opacity-50">
              <div className="flex-1 h-px bg-slate-400"></div>
              <span className="text-xs font-bold uppercase">або</span>
              <div className="flex-1 h-px bg-slate-400"></div>
            </div>
            <button
              onClick={() => setView("login")}
              className={`w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg ${btnClickScale}`}
            >
              Увійти
            </button>
            <button
              onClick={() => setView("register")}
              className={`w-full bg-white/60 text-pink-500 font-bold py-4 rounded-2xl border border-pink-100 ${btnClickScale}`}
            >
              Створити акаунт
            </button>
          </div>
        )}

        {view === "login" && (
          <form
            onSubmit={handleLoginSubmit}
            className="flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-300"
          >
            <div>
              <label className={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className={inputStyle}
                required
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <label className={labelStyle}>Пароль</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {/* ДОДАНО: Кнопка "Забули пароль?" */}
            <div className="flex justify-end -mt-2">
              <button
                type="button"
                onClick={() => setView("forgot-password")}
                className="text-xs font-bold text-slate-500 hover:text-pink-500 transition-colors"
                disabled={isLoading}
              >
                Забули пароль?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg mt-2 ${btnClickScale}`}
            >
              {isLoading ? "Завантаження..." : "Увійти"}
            </button>
          </form>
        )}

        {/* НОВИЙ СТАН: Форма відновлення пароля */}
        {view === "forgot-password" && (
          <form
            onSubmit={handleForgotPasswordSubmit}
            className="flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-300"
          >
            <div>
              <p className="text-sm text-slate-500 mb-6 text-center">
                Введіть свою електронну пошту, і ми надішлемо вам посилання для
                створення нового пароля.
              </p>
              <label className={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className={inputStyle}
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg mt-2 ${btnClickScale}`}
            >
              {isLoading ? "Відправка..." : "Надіслати посилання"}
            </button>
          </form>
        )}

        {view === "register" && (
          <form
            onSubmit={handleRegisterSubmit}
            className="flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-300"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelStyle}>Імя</label>
                <input
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ганна"
                  className={inputStyle}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className={labelStyle}>Прізвище</label>
                <input
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Коваль"
                  className={inputStyle}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <label className={labelStyle}>Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className={inputStyle}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className={labelStyle}>Телефон</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-20 px-1 rounded-xl bg-white/80 border border-pink-100 outline-none"
                  disabled={isLoading}
                >
                  <option value="+380">UA</option>
                  <option value="+48">PL</option>
                </select>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="99 123 4567"
                  className={inputStyle}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="relative">
              <label className={labelStyle}>Пароль</label>
              <input
                type={showPassword ? "text" : "password"}
                name="new-password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg mt-2 ${btnClickScale}`}
            >
              {isLoading ? "Обробка..." : "Створити акаунт"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
