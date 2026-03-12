"use client";

import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarCheck,
  BellRing,
  MessageSquare,
  Users,
  Sparkles,
  UserCog,
  Settings,
  LogOut,
  X,
  Star, // ДОДАЛИ ІКОНКУ РЕЙТИНГУ
} from "lucide-react";

// Додали ролі до кожного пункту меню
const menuItems = [
  {
    id: "overview",
    name: "Панель керування",
    icon: LayoutDashboard,
    roles: ["ADMIN"],
  },
  {
    id: "appointments",
    name: "Записи",
    icon: CalendarCheck,
    roles: ["ADMIN", "MASTER"],
  },
  { id: "requests", name: "Заявки", icon: BellRing, roles: ["ADMIN"] },
  {
    id: "messages",
    name: "Повідомлення",
    icon: MessageSquare,
    roles: ["ADMIN", "MASTER"],
  },
  // ДОДАЛИ ВІДГУКИ ТІЛЬКИ ДЛЯ АДМІНА
  {
    id: "reviews",
    name: "Відгуки",
    icon: Star,
    roles: ["ADMIN"],
  },
  { id: "masters", name: "Майстри", icon: Users, roles: ["ADMIN"] },
  { id: "services", name: "Послуги", icon: Sparkles, roles: ["ADMIN"] },
  {
    id: "profile",
    name: "Мій профіль",
    icon: UserCog,
    roles: ["ADMIN", "MASTER"],
  },
  {
    id: "settings",
    name: "Налаштування",
    icon: Settings,
    roles: ["ADMIN", "MASTER"],
  },
];

interface UserData {
  firstName: string;
  lastName?: string;
  image?: string | null;
  role: string; // Роль тепер обов'язкова для фільтрації
}

interface AdminSidebarProps {
  user: UserData;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  // Додані пропси для мобілки
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
}

export default function AdminSidebar({
  user,
  activeTab,
  onTabChange,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen,
}: AdminSidebarProps) {
  // Фільтруємо меню: показуємо тільки те, куди пускає роль юзера
  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user.role),
  );

  return (
    <div
      className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-pink-50 to-white border-r border-pink-100 p-6 flex flex-col
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Кнопка закриття для телефону */}
      {setIsMobileMenuOpen && (
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-pink-500 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      <div className="flex items-center gap-3 px-2 mb-10 mt-2 lg:mt-0">
        <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-200 shrink-0">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500 truncate">
          Beauty Nails
        </span>
      </div>

      <div className="flex flex-col items-center mb-8 px-2 py-4 bg-white/40 rounded-[2rem] border border-white shadow-sm text-center shrink-0">
        <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden mb-3 bg-pink-50 flex items-center justify-center">
          {user.image ? (
            <img
              src={user.image}
              alt="User"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-pink-300 uppercase">
              {user.firstName.charAt(0)}
            </span>
          )}
        </div>
        <h3 className="font-bold text-slate-800 px-2 truncate w-full">
          {user.firstName} {user.lastName}
        </h3>
        <p className="text-[10px] uppercase tracking-wider text-pink-500 font-bold mt-1">
          {user.role === "ADMIN" ? "Адміністратор" : "Майстер"}
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2">
        {filteredMenuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                if (setIsMobileMenuOpen) setIsMobileMenuOpen(false); // Ховаємо меню на телефоні після кліку
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-sm group ${
                isActive
                  ? "bg-white shadow-md shadow-pink-100 text-pink-600 border border-pink-50"
                  : "text-slate-500 hover:bg-white/60 hover:text-pink-500"
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-pink-500" : "text-slate-400"}`}
              />
              <span className="truncate">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-auto flex items-center gap-3 px-4 py-4 text-slate-400 hover:text-rose-500 transition-colors font-medium text-sm group shrink-0"
      >
        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Вийти з кабінету
      </button>
    </div>
  );
}
