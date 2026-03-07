"use client";

import { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "@/profile/actions";

export default function PersonalInfoForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        if (data) {
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setPhone(data.phone || "");
          setEmail(data.email || "");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      await updateUserProfile({ firstName, lastName, phone });
      setMessage("✅ Дані успішно збережено!");

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("❌ Помилка збереження");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-8 shadow-sm border border-white h-full flex items-center justify-center">
        <div className="text-slate-400 font-medium">
          Завантаження профілю...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-8 shadow-sm border border-white h-full">
      <h3 className="text-slate-800 font-bold text-xl mb-6">Особисті дані</h3>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-500 pl-1">
              Імя
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-slate-700"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-500 pl-1">
              Прізвище
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-slate-700"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-500 pl-1">
            Номер телефону
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+380..."
            className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-slate-700"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-500 pl-1">
            Електронна пошта
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 cursor-not-allowed"
          />
          <span className="text-xs text-slate-400 pl-1">
            Пошту змінити неможливо, вона використовується для входу
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-green-500">{message}</span>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? "Збереження..." : "Зберегти зміни"}
          </button>
        </div>
      </form>
    </div>
  );
}
