"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Star,
  MoreHorizontal,
  Edit2,
  Trash2,
  User as UserIcon,
  Loader2,
} from "lucide-react";

interface Master {
  id: string;
  specialization: string;
  status: string;
  rating: number;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    image?: string | null;
  };
}

interface MastersTableProps {
  activeFilter: string;
  onEditClick: (id: string) => void;
}

export default function MastersTable({
  activeFilter,
  onEditClick,
}: MastersTableProps) {
  const [masters, setMasters] = useState<Master[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const response = await fetch("/api/admin/masters");
        if (response.ok) {
          const data = await response.json();
          setMasters(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMasters();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type: "master" }),
      });

      if (response.ok) {
        setMasters((prev) => prev.filter((m) => m.id !== id));
        setOpenDropdownId(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredMasters = masters.filter((master) => {
    if (activeFilter === "all") return true;
    return master.status === activeFilter;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-pink-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto pb-10">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-slate-400 border-b border-pink-100/50">
            <th className="pb-4 font-medium px-4">Майстер</th>
            <th className="pb-4 font-medium px-4">Контакти</th>
            <th className="pb-4 font-medium px-4">Статус</th>
            <th className="pb-4 font-medium px-4 text-right"></th>
          </tr>
        </thead>
        <tbody>
          {filteredMasters.map((master) => (
            <tr
              key={master.id}
              className="group border-b border-pink-50/50 hover:bg-white/40 transition-colors"
            >
              <td className="py-4 px-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-300 shrink-0 overflow-hidden">
                    {master.user.image ? (
                      <img
                        src={master.user.image}
                        alt={master.user.firstName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 leading-tight">
                      {master.user.firstName} {master.user.lastName}
                    </h4>
                    <p className="text-sm text-slate-400">
                      {master.specialization}
                    </p>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(master.rating) ? "fill-orange-400 text-orange-400" : "text-slate-200"}`}
                        />
                      ))}
                      <span className="text-[10px] font-bold text-slate-400 ml-1">
                        {master.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-300" />
                    {master.user.phone || "Не вказано"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-300" />
                    {master.user.email}
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    master.status === "WORKING"
                      ? "bg-emerald-50 text-emerald-500"
                      : "bg-orange-50 text-orange-500"
                  }`}
                >
                  {master.status === "WORKING" ? "Працює" : "Відпустка"}
                </span>
              </td>
              <td className="py-4 px-4 text-right relative">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEditClick(master.id)}
                    className="px-4 py-2 text-sm font-bold text-pink-500 hover:bg-pink-50 rounded-xl transition-colors"
                  >
                    Редагувати
                  </button>
                  <button
                    onClick={() =>
                      setOpenDropdownId(
                        master.id === openDropdownId ? null : master.id,
                      )
                    }
                    className="p-2 text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {openDropdownId === master.id && (
                  <div className="absolute right-4 top-14 w-40 bg-white rounded-2xl shadow-lg border border-pink-50 py-2 z-10 animate-in fade-in zoom-in-95">
                    <button
                      onClick={() => handleDelete(master.id)}
                      className="w-full text-left px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Видалити
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!isLoading && filteredMasters.length === 0 && (
        <div className="text-center py-20 flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-pink-50 mb-4 text-pink-200">
            <UserIcon className="w-8 h-8" />
          </div>
          <h3 className="text-slate-700 font-bold">Майстрів не знайдено</h3>
          <p className="text-slate-400 text-sm mt-1">
            Спробуйте змінити фільтр або додайте нового працівника.
          </p>
        </div>
      )}
    </div>
  );
}
