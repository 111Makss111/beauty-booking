"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import ProfileGeneralForm from "./profile-general-form";
import ProfileSecurityForm from "./profile-security-form";
import ProfileSidebar from "./profile-sidebar";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  role: string;
  phone?: string | null;
}

interface AdminProfileLayoutProps {
  user: UserData;
}

export default function AdminProfileLayout({ user }: AdminProfileLayoutProps) {
  const [activeTab, setActiveTab] = useState("Основне");
  const tabs = ["Основне", "Безпека"];

  const renderContent = () => {
    switch (activeTab) {
      case "Основне":
        return <ProfileGeneralForm user={user} />;
      case "Безпека":
        return <ProfileSecurityForm user={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md p-1.5 rounded-2xl w-fit border border-white shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === tab
                ? "bg-white text-pink-600 shadow-sm border border-pink-50"
                : "text-slate-500 hover:text-pink-500 hover:bg-white/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {renderContent()}

          <div className="flex items-center gap-2 text-xs text-slate-400 pl-4">
            <ShieldCheck className="w-4 h-4" />
            <p>Ми використовуємо захищене зєднання. Ваші дані в безпеці.</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <ProfileSidebar user={user} />
        </div>
      </div>
    </div>
  );
}
