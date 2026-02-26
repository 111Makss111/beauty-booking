import { signOut } from "next-auth/react";
import { LogOut, TrendingUp, Users, Calendar } from "lucide-react";
import type { Session } from "next-auth";

interface AdminProps {
  session: Session;
}

export default function AdminDashboard({ session }: AdminProps) {
  return (
    <main className="min-h-screen bg-[#FFF0F3] p-6 animate-in zoom-in-95 duration-500">
      {/* --- ШАПКА АДМІНА --- */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Панель Майстра
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">
              Адміністратор: {session.user?.name?.split(" ")[0]}
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="p-3 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-2xl shadow-sm transition-all active:scale-90 border border-white"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* --- СТАТИСТИКА (Віджети) --- */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-[30px] shadow-sm border border-white transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-2">
            <Users size={18} className="text-rose-300" />
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
              +2
            </span>
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">
            Клієнти сьогодні
          </p>
          <p className="text-2xl font-bold text-slate-800">8</p>
        </div>

        <div className="bg-white p-5 rounded-[30px] shadow-sm border border-white transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-2">
            <TrendingUp size={18} className="text-rose-300" />
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
              +12%
            </span>
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">
            Прибуток
          </p>
          <p className="text-2xl font-bold text-[#D85C7B]">$1,250</p>
        </div>
      </div>

      {/* --- ГРАФІК ЗАПИСІВ --- */}
      <section className="bg-white/80 backdrop-blur-md rounded-[35px] p-6 shadow-sm border border-white/50 min-h-[300px]">
        <div className="flex items-center gap-2 mb-6">
          <Calendar size={18} className="text-[#D85C7B]" />
          <h3 className="font-bold text-slate-700 tracking-tight">
            Черга записів на сьогодні
          </h3>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
            <Calendar className="text-rose-200" size={32} />
          </div>
          <p className="text-slate-400 text-sm italic">
            Поки що нових записів немає.
          </p>
          <p className="text-slate-300 text-[11px] mt-1">
            Всі клієнти відобразяться тут автоматично.
          </p>
        </div>
      </section>
    </main>
  );
}
