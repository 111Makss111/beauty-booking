"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./sidebar";
import SettingsLayout from "./settings/settings-layout";
import ProfileLayout from "./profile/profile-layout";
import MessagesLayout from "./messages/messages-layout";

interface DashboardOverviewProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    image?: string | null;
  };
}

export default function DashboardOverview({ user }: DashboardOverviewProps) {
  const [activeTab, setActiveTab] = useState("book");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "settings":
        return <SettingsLayout />;
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
            <p className="text-slate-500 mb-8">
              Зараз активна вкладка: {activeTab}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-pink-50 to-rose-100 overflow-hidden">
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-40 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-md text-pink-500 hover:bg-pink-50 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

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

      <main className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col mt-16 lg:mt-0">
        {renderContent()}
      </main>
    </div>
  );
}
