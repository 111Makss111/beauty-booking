"use client";

import { signOut } from "next-auth/react";

interface DashboardOverviewProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function DashboardOverview({ user }: DashboardOverviewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl max-w-lg w-full text-center animate-in fade-in zoom-in-95 duration-500">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Привіт, <span className="text-pink-500">{user.firstName}</span>! 👋
        </h1>

        <p className="text-lg text-slate-600 mb-8">
          Ласкаво просимо до вашого особистого кабінету Beauty Nails. Тепер ваш
          акаунт повністю підтверджено!
        </p>

        <div className="p-5 bg-pink-50/50 rounded-2xl border border-pink-100 text-left mb-6">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
            Ваш профіль
          </p>
          <p className="text-slate-800 font-medium text-lg mb-1">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-slate-600">{user.email}</p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-colors active:scale-[0.98]"
        >
          Вийти з акаунта
        </button>
      </div>
    </div>
  );
}
