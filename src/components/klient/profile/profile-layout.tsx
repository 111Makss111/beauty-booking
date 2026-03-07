"use client";

import AvatarUpload from "./avatar-upload";
import PersonalInfoForm from "./personal-info-form";
import BonusesCard from "./bonuses-card";
import SecurityForm from "./security-form";
import { useState, useEffect } from "react";
import { getUserProfile } from "@/profile/actions";

export default function ProfileLayout() {
  const [activeTab, setActiveTab] = useState<"general" | "security">("general");
  const [userData, setUserData] = useState<{
    image?: string | null;
    firstName?: string | null;
    hasPassword?: boolean;
  }>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        if (data) {
          setUserData({
            image: data.image,
            firstName: data.firstName,
            hasPassword: data.hasPassword,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pl-2">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Мій профіль
          </h2>
          <p className="text-slate-500 font-medium">
            Ваші контактні дані та налаштування безпеки
          </p>
        </div>

        <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-white shadow-sm w-fit">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === "general"
                ? "bg-white text-pink-500 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Загальне
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === "security"
                ? "bg-white text-pink-500 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Безпека
          </button>
        </div>
      </div>

      {activeTab === "general" ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <AvatarUpload
              image={userData.image}
              firstName={userData.firstName}
            />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <PersonalInfoForm />
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6">
            <BonusesCard />
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <SecurityForm user={userData} />
        </div>
      )}
    </div>
  );
}
