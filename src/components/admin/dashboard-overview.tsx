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
            <h2 className="text-2xl font-bold text-slate-800">
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
      <div className="w-72 h-screen flex flex-col bg-gradient-to-b from-pink-50 to-white border-r border-pink-100 p-6 sticky top-0">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-200">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500">
            Beauty Nails
          </span>
        </div>

        <div className="flex flex-col items-center mb-10 px-2 py-4 bg-white/40 rounded-[2rem] border border-white shadow-sm text-center">
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

        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          {filteredMenuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-sm ${
                  isActive
                    ? "bg-white shadow-md text-pink-600 border border-pink-50"
                    : "text-slate-500 hover:bg-white/60 hover:text-pink-500"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-pink-500" : "text-slate-400"}`}
                />
                {item.name}
              </button>
            );
          })}
        </nav>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-6 flex items-center gap-3 px-4 py-4 text-slate-400 hover:text-rose-500 transition-colors font-medium text-sm group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Вийти
        </button>
      </div>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
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
