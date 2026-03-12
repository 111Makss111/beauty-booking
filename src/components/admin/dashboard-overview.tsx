"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "./admin-sidebar";
import MessagesLayout from "@/components/klient/messages/messages-layout";
import AdminProfile from "./profile/admin-profile-layout";
import ServicesLayout from "./neils/services-layout";
import MastersLayout from "./masters/masters-layout";
import SettingsLayout from "./settings/settings-layout";
import MasterAppointments from "../../components/master/appointments/master-appointments";
import AdminAppointments from "../../components/admin/appointments/admin-appointments";
import AdminRequests from "../../components/admin/requests/admin-requests";
// ДОДАНО: Імпорт нашої нової панелі відгуків
import AdminReviews from "../../components/admin/reviews/admin-reviews";

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

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState(
    user.role === "ADMIN" ? "overview" : "profile",
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "messages":
        return (
          <div className="h-[calc(100vh-160px)]">
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

      // Залишили тільки ОДИН правильний case для записів
      case "appointments":
        return (
          <div className="h-[calc(100vh-160px)]">
            {user.role === "ADMIN" ? (
              <AdminAppointments />
            ) : (
              <MasterAppointments />
            )}
          </div>
        );

      case "requests":
        return (
          <div className="h-[calc(100vh-160px)]">
            <AdminRequests />
          </div>
        );

      // ДОДАНО: Вкладка відгуків для адміна
      case "reviews":
        return (
          <div className="h-[calc(100vh-160px)]">
            <AdminReviews />
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

  const getHeaderTitle = () => {
    const titles: Record<string, string> = {
      overview: "Панель керування",
      appointments: "Записи",
      requests: "Заявки",
      reviews: "Відгуки",
      messages: "Повідомлення",
      masters: "Майстри",
      services: "Послуги",
      profile: "Мій профіль",
      settings: "Налаштування",
    };
    return titles[activeTab] || "Кабінет";
  };

  return (
    <div className="flex min-h-screen bg-[#fdf8fa]">
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-40 p-3 bg-white rounded-full shadow-md text-pink-500 hover:bg-pink-50 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <AdminSidebar
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="flex-1 p-4 lg:p-8 overflow-y-auto w-full lg:w-auto mt-16 lg:mt-0">
        <header className="mb-6 lg:mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            {getHeaderTitle()}
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
