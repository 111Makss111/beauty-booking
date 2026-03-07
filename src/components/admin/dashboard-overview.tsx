"use client";

import { useState } from "react";
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
  Menu, // Додано іконку гамбургера
  X, // Додано іконку хрестика для закриття меню
} from "lucide-react";
import { signOut } from "next-auth/react";
import MessagesLayout from "@/components/klient/messages/messages-layout";
import AdminProfile from "./profile/admin-profile-layout";
import ServicesLayout from "./neils/services-layout";
import MastersLayout from "./masters/masters-layout";
import SettingsLayout from "./settings/settings-layout";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  role: string;
  phone?: string | null;
}

interface AdminDashboardProps {
  user: UserData;
}

const allMenuItems = [
  {
    id: "overview",
    name: "Панель керування",
    icon: LayoutDashboard,
    roles: ["ADMIN"],
  },
  {
    id: "appointments",
    name: "Мої записи",
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
  { id: "masters", name: "Персонал", icon: Users, roles: ["ADMIN"] },
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

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const filteredMenuItems = allMenuItems.filter((item) =>
    item.roles.includes(user.role),
  );

  const [activeTab, setActiveTab] = useState(
    filteredMenuItems[0]?.id || "profile",
  );

  // Стан для керування мобільним меню
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Функція для перемикання вкладок, яка також закриває мобільне меню
  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "messages":
        return (
          <div className="h-[calc(100vh-160px)] animate-in fade-in duration-500">
            <MessagesLayout />
          </div>
        );
      case "profile":
        return <AdminProfile user={user} />;
      case "services":
        return <ServicesLayout />;
      case "masters":
        return <MastersLayout />;
      case "settings":
        return <SettingsLayout />;
      case "appointments":
        return (
          <div className="p-8 bg-white rounded-[2rem] border border-pink-50 shadow-sm text-center animate-in zoom-in-95 duration-500">
            <h2 className="text-xl font-bold text-slate-800">
              Розклад {user.role === "MASTER" ? "майстра" : "салону"}
            </h2>
            <p className="text-slate-500 mt-2">
              Тут незабаром буде календар записів.
            </p>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] bg-white/70 backdrop-blur-md rounded-[2rem] shadow-sm border border-white animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center text-4xl mb-4 text-pink-500">
              ✨
            </div>
            <h2 className="text-2xl font-bold text-slate-800 text-center">
              Вітаємо у кабінеті
            </h2>
            <p className="text-slate-500 mt-2 text-center max-w-xs">
              Ви увійшли як{" "}
              {user.role === "MASTER" ? "майстер" : "адміністратор"}.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fdf8fa]">
      {/* Мобільна кнопка гамбургера (видима тільки на малих екранах) */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-40 p-3 bg-white rounded-full shadow-md text-pink-500 hover:bg-pink-50 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Оверлей для затемнення фону на мобільному при відкритому меню */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Сайдбар */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-pink-50 to-white border-r border-pink-100 p-6 flex flex-col
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Кнопка закриття меню для мобільних */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-pink-500 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

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
              <span className="text-2xl font-bold text-pink-300">
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
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-sm ${
                  isActive
                    ? "bg-white shadow-md text-pink-600 border border-pink-50"
                    : "text-slate-500 hover:bg-white/60 hover:text-pink-500"
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${isActive ? "text-pink-500" : "text-slate-400"}`}
                />
                <span className="truncate">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-4 mt-auto">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 rounded-2xl transition-all font-medium text-sm group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform shrink-0" />
            Вийти
          </button>
        </div>
      </div>

      {/* Головний контент */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto w-full lg:w-auto mt-16 lg:mt-0">
        <header className="mb-6 lg:mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            {allMenuItems.find((m) => m.id === activeTab)?.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Панель{" "}
            {user.role === "ADMIN" ? "керування салоном" : "робочого кабінету"}.
          </p>
        </header>
        <div className="min-h-[calc(100vh-180px)]">{renderContent()}</div>
      </main>
    </div>
  );
}
