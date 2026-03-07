"use client";

import { Users, Star } from "lucide-react";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  role: string;
  phone?: string | null;
}

interface ProfileSidebarProps {
  user: UserData;
}

export default function ProfileSidebar({ user }: ProfileSidebarProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-500 h-full">
      <div className="bg-white/70 backdrop-blur-md rounded-[2rem] border border-white shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-800 mb-4">
          Швидка статистика
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-500">
              <div className="p-2 bg-pink-50 rounded-lg text-pink-500">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Клієнти</span>
            </div>
            <span className="font-bold text-slate-800">245</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-500">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
                <Star className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Середній рейтинг</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-slate-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              4.9
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-md rounded-[2rem] border border-white shadow-sm p-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800">Кращі майстри</h3>
          <button className="text-slate-400 hover:text-pink-500 transition-colors">
            •••
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-pink-50 shadow-sm transition-all hover:shadow-md">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-pink-50 flex items-center justify-center flex-shrink-0">
            {user.image ? (
              <img
                src={user.image}
                alt="Master"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-pink-400">
                {user.firstName.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-800 truncate">
              {user.firstName}
            </h4>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
              <span className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                4.9
              </span>
              <span>•</span>
              <span>152 відгуки</span>
            </div>
          </div>
        </div>
      </div>

      <button className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold rounded-[1.5rem] shadow-lg shadow-pink-200 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg mt-auto">
        Зберегти зміни
      </button>
    </div>
  );
}
