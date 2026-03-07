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
} from "lucide-react";

const menuItems = [
  { id: "overview", name: "Панель керування", icon: LayoutDashboard },
  { id: "appointments", name: "Записи", icon: CalendarCheck },
  { id: "requests", name: "Заявки", icon: BellRing },
  { id: "messages", name: "Повідомлення", icon: MessageSquare },
  { id: "masters", name: "Майстри", icon: Users },
  { id: "services", name: "Послуги", icon: Sparkles },
  { id: "profile", name: "Мій профіль", icon: UserCog },
  { id: "settings", name: "Налаштування", icon: Settings },
];

interface UserData {
  firstName: string;
  image?: string | null;
  role?: string;
}

interface AdminSidebarProps {
  user: UserData;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function AdminSidebar({
  user,
  activeTab,
  onTabChange,
}: AdminSidebarProps) {
  return (
    <div className="w-72 h-screen flex flex-col bg-gradient-to-b from-pink-50 to-white border-r border-pink-100 p-6 sticky top-0">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-200">
          <Sparkles className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500">
          Beauty Nails
        </span>
      </div>

      <div className="flex flex-col items-center mb-10 px-2 py-4 bg-white/40 rounded-[2rem] border border-white shadow-sm">
        <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden mb-3 bg-pink-50 flex items-center justify-center">
          {user.image ? (
            <img
              src={user.image}
              alt="Admin"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-pink-300 uppercase">
              {user.firstName.charAt(0)}
            </span>
          )}
        </div>
        <h3 className="font-bold text-slate-800">{user.firstName}</h3>
        <p className="text-xs text-pink-500 font-medium mt-1">
          {user.role === "ADMIN" ? "Адміністратор" : "Головний майстер"}
        </p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? "bg-white shadow-md shadow-pink-100 text-pink-600 border border-pink-50"
                  : "text-slate-500 hover:bg-white/60 hover:text-pink-500"
              }`}
            >
              <div className="flex items-center gap-3 font-medium text-sm">
                <Icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-pink-500" : "text-slate-400"}`}
                />
                {item.name}
              </div>
            </button>
          );
        })}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-auto flex items-center gap-3 px-4 py-4 text-slate-400 hover:text-rose-500 transition-colors font-medium text-sm group"
      >
        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Вийти з кабінету
      </button>
    </div>
  );
}
