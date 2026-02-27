"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Scissors, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";

export default function AuthScreen() {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isRegister) {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        signIn("credentials", {
          email: formData.email,
          password: formData.password,
          callbackUrl: "/",
        });
      }
    } else {
      signIn("credentials", {
        email: formData.email,
        password: formData.password,
        callbackUrl: "/",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF0F3] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl rounded-[45px] p-8 shadow-sm border border-white relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-rose-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-200">
            <Scissors size={32} />
          </div>
          <h1 className="text-3xl font-serif italic text-rose-500 font-bold tracking-tight">
            Beauty Nails
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Твій ідеальний манікюр починається тут
          </p>
        </div>

        <div className="flex bg-rose-50/50 p-1.5 rounded-2xl mb-8 border border-rose-100">
          <button
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${!isRegister ? "bg-white text-rose-500 shadow-sm" : "text-slate-400 hover:text-rose-300"}`}
          >
            Вхід
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${isRegister ? "bg-white text-rose-500 shadow-sm" : "text-slate-400 hover:text-rose-300"}`}
          >
            Реєстрація
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Ім'я та прізвище"
                  required
                  className="w-full bg-white border border-rose-50 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300"
                  size={18}
                />
                <input
                  type="tel"
                  placeholder="Номер телефону"
                  required
                  className="w-full bg-white border border-rose-50 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </>
          )}

          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300"
              size={18}
            />
            <input
              type="email"
              placeholder="Електронна пошта"
              required
              className="w-full bg-white border border-rose-50 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300"
              size={18}
            />
            <input
              type="password"
              placeholder="Пароль"
              required
              className="w-full bg-white border border-rose-50 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading
              ? "Зачекайте..."
              : isRegister
                ? "Створити акаунт"
                : "Увійти"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="my-8 flex items-center gap-4 text-slate-300">
          <div className="h-px bg-slate-100 flex-1"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest">
            або через
          </span>
          <div className="h-px bg-slate-100 flex-1"></div>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full bg-white border border-slate-100 py-4 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Продовжити з Google
        </button>
      </div>
    </div>
  );
}
