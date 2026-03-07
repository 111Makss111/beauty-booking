"use client";

import { useState } from "react";
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
      <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto p-8 flex flex-col">
        {renderContent()}
      </main>
    </div>
  );
}
