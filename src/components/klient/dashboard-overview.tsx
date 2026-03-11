"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./sidebar";
import SettingsLayout from "./settings/settings-layout";
import ProfileLayout from "./profile/profile-layout";
import MessagesLayout from "./messages/messages-layout";
import BookingContainer from "./booking/booking-container";
import ClientAppointments from "./appointments/client-appointments";

// Правило №99: Типізація для Telegram
interface TelegramData {
  isConnected: boolean;
  username: string | null;
  link: string;
}

interface DashboardOverviewProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    image?: string | null;
    id: string;
    notifyAppointments: boolean;
    notifyPromotions: boolean;
  };
  telegramData: TelegramData | null; // <-- ДОДАЛИ ЦЕЙ РЯДОК
}

export default function DashboardOverview({
  user,
  telegramData,
}: DashboardOverviewProps) {
  const [activeTab, setActiveTab] = useState("book");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "book":
        return <BookingContainer clientId={user.id} />;
      case "appointments":
        return <ClientAppointments clientId={user.id} />;
      case "settings":
        return (
          <SettingsLayout
            notificationSettings={{
              notifyAppointments: user.notifyAppointments,
              notifyPromotions: user.notifyPromotions,
            }}
            telegramData={telegramData} // <-- ПЕРЕДАЄМО ДАНІ В НАЛАШТУВАННЯ
          />
        );
      case "profile":
        return <ProfileLayout />;
      case "messages":
        return <MessagesLayout />;
      default:
        return (
          <div className="bg-white/80 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-xl max-w-lg mx-auto w-full text-center animate-in fade-in zoom-in-95 duration-500 border border-white">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Привіт, <span className="text-pink-500">{user.firstName}</span>!
              👋
            </h1>
            <p className="text-slate-500">Оберіть розділ у меню</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-pink-50 to-rose-100 overflow-hidden">
      {/* Кнопка мобільного меню */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-40 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-md text-pink-500 hover:bg-pink-50 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Оверлей мобільного меню */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Сайдбар */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:h-screen
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 z-50 p-2 text-slate-400 hover:text-pink-500 transition-colors bg-white/50 backdrop-blur-md rounded-full shadow-sm"
        >
          <X className="w-6 h-6" />
        </button>

        <Sidebar
          user={user}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
        />
      </div>

      {/* Основний контент */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col mt-16 lg:mt-0">
        <div className="max-w-[1600px] mx-auto w-full">{renderContent()}</div>
      </main>
    </div>
  );
}
