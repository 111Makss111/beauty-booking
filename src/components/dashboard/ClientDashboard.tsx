import { signOut } from "next-auth/react";
import Image from "next/image";
import type { Session } from "next-auth";
import { LogOut, Calendar, ChevronRight } from "lucide-react";

export default function ClientDashboard({ session }: { session: Session }) {
  return (
    <main className="min-h-screen bg-[#FFF0F3] pb-10 animate-in fade-in duration-500">
      {/* --- ШАПКА --- */}
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {session.user?.image && (
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
              <Image
                src={session.user.image}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Клієнт
            </p>
            <h2 className="text-xl font-bold text-slate-800">
              Привіт, {session.user?.name?.split(" ")[0]}!
            </h2>
          </div>
        </div>

        {/* Кнопка виходу */}
        <button
          onClick={() => signOut()}
          className="p-3 bg-white/50 hover:bg-white text-rose-500 rounded-2xl transition-all active:scale-90 shadow-sm border border-white"
          title="Вийти з акаунта"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* --- КОНТЕНТ --- */}
      <div className="px-6 space-y-6">
        {/* Секція: Найближчий візит */}
        <section className="bg-white/80 backdrop-blur-md rounded-[35px] p-6 shadow-sm border border-white/50">
          <h3 className="text-slate-800 font-bold mb-4">Найближчий візит</h3>
          <div className="flex gap-4 items-center">
            <div className="bg-rose-100 p-4 rounded-[20px] text-[#D85C7B] text-2xl shadow-inner">
              💅
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800 text-sm">
                Художній манікюр
              </p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                <Calendar size={12} /> Вівторок, 19 Лис | 15:00
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Майстер: Анастасія
              </p>
            </div>
            <button className="bg-rose-400 hover:bg-rose-500 text-white text-[10px] px-3 py-2 rounded-xl font-bold shadow-md shadow-rose-100 transition-colors">
              Змінити
            </button>
          </div>
        </section>

        {/* Секція: Швидкий запис */}
        <section className="bg-white/80 backdrop-blur-md rounded-[35px] p-6 shadow-sm border border-white/50">
          <h3 className="text-slate-800 font-bold mb-4">Записатися</h3>
          <div className="space-y-3">
            {[
              { title: "Оберіть послугу", icon: "✨" },
              { title: "Дата та час", icon: "⏰" },
              { title: "Ваш майстер", icon: "👩‍🎨" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex justify-between items-center p-4 bg-white/40 rounded-2xl cursor-pointer hover:bg-white/60 transition-all group border border-transparent hover:border-rose-100"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm text-slate-600 font-semibold">
                    {item.title}
                  </span>
                </div>
                <ChevronRight
                  size={16}
                  className="text-slate-300 group-hover:text-rose-400 transition-colors"
                />
              </div>
            ))}
            <button className="w-full bg-[#D85C7B] text-white font-bold py-4 mt-2 rounded-[22px] shadow-lg shadow-rose-200 active:scale-[0.98] transition-all">
              Забронювати зараз
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
