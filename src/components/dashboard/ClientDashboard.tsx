import { signOut } from "next-auth/react";
import Image from "next/image";
import type { Session } from "next-auth";
import {
  LogOut,
  CalendarPlus,
  CalendarDays,
  MessageSquare,
  User,
  Settings,
  Search,
  Heart,
  Bell,
  ChevronRight,
  Star,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function ClientDashboard({ session }: { session: Session }) {
  const userName = session.user?.name?.split(" ")[0] || "Клієнт";

  return (
    // Головний контейнер: на весь екран на ПК, без скролу всієї сторінки
    <div className="flex h-screen bg-[#FFF0F3] overflow-hidden font-sans text-slate-800 animate-in fade-in duration-500">
      {/* ================= 1. ЛІВА ПАНЕЛЬ (SIDEBAR) - Тільки для ПК ================= */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-white/40 backdrop-blur-xl border-r border-white/60 p-6 justify-between">
        <div>
          {/* Логотип */}
          <div className="flex items-center gap-3 mb-12 pl-2">
            <div className="bg-gradient-to-br from-rose-400 to-rose-500 text-white p-2 rounded-xl shadow-rose-200 shadow-lg">
              <Sparkles size={20} />
            </div>
            <h1 className="text-2xl font-serif italic text-rose-500 font-bold tracking-tight">
              Beauty Nails
            </h1>
          </div>

          {/* Профіль міні */}
          <div className="flex items-center gap-4 mb-10 bg-white/60 p-3 rounded-2xl border border-white shadow-sm">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt="Avatar"
                width={40}
                height={40}
                className="rounded-full shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-500">
                <User size={20} />
              </div>
            )}
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">
                З поверненням,
              </p>
              <p className="font-bold text-sm text-slate-700">{userName}!</p>
            </div>
          </div>

          {/* Навігація */}
          <nav className="space-y-2">
            {[
              {
                name: "Новий запис",
                icon: <CalendarPlus size={18} />,
                active: true,
              },
              { name: "Мої записи", icon: <CalendarDays size={18} /> },
              {
                name: "Повідомлення",
                icon: <MessageSquare size={18} />,
                badge: 2,
              },
              { name: "Мій профіль", icon: <User size={18} /> },
              { name: "Налаштування", icon: <Settings size={18} /> },
            ].map((item) => (
              <button
                key={item.name}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                  item.active
                    ? "bg-white text-rose-500 shadow-sm border border-white font-bold"
                    : "text-slate-500 hover:bg-white/50 hover:text-rose-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm">{item.name}</span>
                </div>
                {item.badge && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                {item.active && (
                  <ChevronRight size={16} className="text-rose-300" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Кнопка Виходу */}
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 p-4 text-slate-400 hover:text-rose-500 hover:bg-white/50 rounded-2xl transition-all"
        >
          <LogOut size={18} />
          <span className="text-sm font-semibold">Вийти з акаунту</span>
        </button>
      </aside>

      {/* ================= 2. ЦЕНТРАЛЬНА ТА ПРАВА ЧАСТИНИ (SCROLLABLE) ================= */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Верхня панель (Топбар) */}
        <header className="flex justify-between items-center p-6 lg:px-10">
          <div className="relative w-full max-w-md hidden md:block">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <input
              type="text"
              placeholder="Пошук послуг чи майстрів..."
              className="w-full bg-white/60 backdrop-blur-md border border-white/80 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors shadow-sm">
              <Heart size={18} />
            </button>
            <button className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors shadow-sm relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <div className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center font-bold text-slate-600 shadow-sm border border-white">
              UA
            </div>
            {/* Мобільна кнопка виходу (видно тільки на телефонах) */}
            <button
              onClick={() => signOut()}
              className="lg:hidden w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 shadow-sm"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Сітка контенту (2 колонки на великих екранах) */}
        <div className="px-6 lg:px-10 pb-10 grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* === ЦЕНТРАЛЬНА КОЛОНКА (Займає 2 частини) === */}
          <div className="xl:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight hidden lg:block">
              Оформлення запису
            </h2>

            {/* Банер Найближчого візиту */}
            <section className="bg-gradient-to-r from-rose-100 to-[#FFD6E0] rounded-[35px] p-6 shadow-sm border border-white relative overflow-hidden">
              <div className="relative z-10 w-full md:w-2/3">
                <p className="text-rose-500 font-bold uppercase tracking-wider text-[10px] mb-2">
                  Найближчий візит
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
                    💅
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Художній манікюр</h3>
                    <p className="text-xs text-slate-600">
                      Вівторок, 19 Лис | 15:00
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 bg-white/50 rounded-full flex items-center justify-center">
                    <User size={12} className="text-rose-400" />
                  </div>
                  <span className="text-xs font-medium text-slate-700">
                    Анастасія
                  </span>
                </div>
                <button className="bg-rose-400 hover:bg-rose-500 text-white px-6 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-rose-200 transition-all active:scale-95">
                  Перенести
                </button>
              </div>
              {/* Декоративний елемент (Імітація картинки збоку) */}
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-rose-200/50 hidden md:block rounded-l-full blur-2xl"></div>
            </section>

            {/* Блок нового запису */}
            <section className="bg-white/60 backdrop-blur-xl rounded-[35px] p-6 shadow-sm border border-white">
              <h3 className="font-bold text-lg mb-6">Новий запис</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-2xl cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-rose-100 group">
                  <div className="flex items-center gap-4">
                    <div className="bg-rose-50 p-3 rounded-xl text-rose-400 group-hover:bg-rose-400 group-hover:text-white transition-colors">
                      <Sparkles size={20} />
                    </div>
                    <span className="font-semibold text-slate-700">
                      Оберіть послугу
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
                </div>

                <div className="flex justify-between items-center p-4 bg-white rounded-2xl cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-rose-100 group">
                  <div className="flex items-center gap-4">
                    <div className="bg-rose-50 p-3 rounded-xl text-rose-400 group-hover:bg-rose-400 group-hover:text-white transition-colors">
                      <Calendar size={20} />
                    </div>
                    <span className="font-semibold text-slate-700">
                      Оберіть дату та час
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
                </div>

                {/* Вибір майстра (Імітація відкритого списку) */}
                <div className="p-4 bg-white rounded-2xl border border-rose-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-rose-400 p-3 rounded-xl text-white">
                      <User size={20} />
                    </div>
                    <span className="font-semibold text-slate-700">
                      Оберіть майстра
                    </span>
                  </div>
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center justify-between p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-sm shadow-sm">
                          👩‍🎨
                        </div>
                        <div>
                          <p className="text-sm font-bold">Анастасія</p>
                          <div className="flex text-amber-400 text-[10px]">
                            <Star size={10} fill="currentColor" />
                            <Star size={10} fill="currentColor" />
                            <Star size={10} fill="currentColor" />
                            <Star size={10} fill="currentColor" />
                            <Star size={10} fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-4 border-rose-400 bg-white"></div>
                    </div>
                  </div>
                </div>

                {/* Підсумок */}
                <div className="mt-8 pt-6 border-t border-rose-100/50 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">
                      Орієнтовна вартість
                    </p>
                    <p className="text-2xl font-bold text-slate-800">₴ 850</p>
                  </div>
                  <button className="bg-rose-400 text-white font-bold py-4 px-10 rounded-2xl shadow-lg shadow-rose-200 active:scale-95 transition-all">
                    Забронювати
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* === ПРАВА КОЛОНКА (Віджети) === */}
          <div className="space-y-8 hidden xl:block">
            {/* Мої записи (Коротко) */}
            <section className="bg-white/60 backdrop-blur-xl rounded-[35px] p-6 shadow-sm border border-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800">Мої записи</h3>
                <span className="text-xs text-rose-400 font-bold cursor-pointer hover:underline">
                  Всі
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-3 rounded-2xl shadow-sm border border-rose-50">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-sm">
                      ✨
                    </div>
                    <div>
                      <p className="text-xs font-bold">Гель-лак</p>
                      <p className="text-[10px] text-slate-400">
                        Пн, 25 Лис | 11:00
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
              </div>
            </section>

            {/* Спеціальні пропозиції */}
            <section className="bg-gradient-to-br from-[#FFC1CC] to-rose-300 rounded-[35px] p-6 shadow-md border border-white text-white relative overflow-hidden">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-80">
                Спеціальна пропозиція
              </p>
              <h3 className="text-4xl font-black mb-1">-20%</h3>
              <p className="text-sm font-medium mb-6">Для нових клієнтів</p>
              <button className="bg-white text-rose-500 text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg hover:bg-rose-50 transition-colors">
                Переглянути
              </button>
            </section>

            {/* Повідомлення від салону */}
            <section className="bg-white/60 backdrop-blur-xl rounded-[35px] p-6 shadow-sm border border-white">
              <h3 className="font-bold text-slate-800 mb-4 text-sm">
                Повідомлення
              </h3>
              <div className="bg-white p-4 rounded-2xl border border-rose-50 shadow-sm relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-rose-400 rounded-full flex items-center justify-center text-white text-xs">
                    <Sparkles size={12} />
                  </div>
                  <p className="text-xs font-bold">
                    Beauty Nails{" "}
                    <span className="text-slate-400 font-normal ml-1">
                      11:24
                    </span>
                  </p>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Привіт, {userName}! Нагадуємо про ваш запис на манікюр завтра
                  о 15:00. Чекаємо на вас! 💅
                </p>
                <button className="mt-3 w-full border border-rose-200 text-rose-400 text-[10px] font-bold py-2 rounded-xl hover:bg-rose-50 transition-colors">
                  Відповісти
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
