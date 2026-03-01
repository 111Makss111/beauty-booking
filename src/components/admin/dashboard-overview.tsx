// src/components/admin/dashboard-overview.tsx
"use client";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
      <h1 className="text-5xl font-bold mb-4 text-pink-500">Вітаю, Бос! 😎</h1>
      <p className="text-xl text-slate-300">
        Це секретний кабінет Адміністратора.
      </p>
      <p className="mt-8 text-sm text-slate-500">
        Звичайні клієнти сюди ніколи не потраплять.
      </p>
    </div>
  );
}
