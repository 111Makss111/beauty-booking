"use client";

import { useState, useEffect } from "react";
import {
  MoreHorizontal,
  Edit2,
  Copy,
  Trash2,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  category: string;
  duration: number;
  price: number;
  isActive: boolean;
  image?: string | null;
}

interface ServicesTableProps {
  showOnlyActive: boolean;
  onEditClick: (id: string) => void;
}

export default function ServicesTable({
  showOnlyActive,
  onEditClick,
}: ServicesTableProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/admin/services");
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours} год ${mins} хв`;
    if (hours > 0) return `${hours} година`;
    return `${mins} хв`;
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, isActive: !currentStatus } : service,
      ),
    );
  };

  const handleDelete = async (id: string) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
    setOpenDropdownId(null);
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  const filteredServices = services.filter((service) => {
    return showOnlyActive ? service.isActive : true;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-pink-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto pb-24">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-slate-400 border-b border-pink-100/50">
            <th className="pb-4 font-medium px-4">Послуги</th>
            <th className="pb-4 font-medium px-4">Тривалість</th>
            <th className="pb-4 font-medium px-4">Ціна</th>
            <th className="pb-4 font-medium px-4">Стан</th>
            <th className="pb-4 font-medium px-4 text-right"></th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.map((service) => (
            <tr
              key={service.id}
              className="group border-b border-pink-50/50 hover:bg-white/40 transition-colors"
            >
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-300 shrink-0 overflow-hidden">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="font-medium text-slate-700">
                    {service.name}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4 text-slate-600">
                {formatDuration(service.duration)}
              </td>
              <td className="py-4 px-4 text-slate-600">€{service.price}</td>
              <td className="py-4 px-4">
                <label className="flex items-center gap-2 cursor-pointer w-max">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={service.isActive}
                      onChange={() =>
                        toggleStatus(service.id, service.isActive)
                      }
                    />
                    <div
                      className={`block w-10 h-5 rounded-full transition-colors duration-300 ${
                        service.isActive ? "bg-emerald-400" : "bg-slate-200"
                      }`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform duration-300 ${
                        service.isActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></div>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      service.isActive ? "text-emerald-500" : "text-slate-400"
                    }`}
                  >
                    {service.isActive ? "Активна" : "Неактивна"}
                  </span>
                </label>
              </td>
              <td className="py-4 px-4 text-right relative">
                <button
                  onClick={() => toggleDropdown(service.id)}
                  className="p-2 text-slate-300 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>

                {openDropdownId === service.id && (
                  <div className="absolute right-8 top-12 w-48 bg-white rounded-2xl shadow-lg border border-pink-50 py-2 z-10 animate-in fade-in zoom-in-95 duration-200">
                    <button
                      onClick={() => {
                        onEditClick(service.id);
                        setOpenDropdownId(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-pink-50 hover:text-pink-600 flex items-center gap-2 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Редагувати
                    </button>
                    <button
                      onClick={() => setOpenDropdownId(null)}
                      className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-pink-50 hover:text-pink-600 flex items-center gap-2 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      Скопіювати
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="w-full text-left px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 flex items-center gap-2 transition-colors"
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

      {!isLoading && filteredServices.length === 0 && (
        <div className="text-center py-12 flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-pink-50 mb-3 text-pink-300">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-slate-700 font-medium">Послуг ще немає</h3>
          <p className="text-slate-400 text-sm mt-1">
            Додайте першу послугу, щоб вона зявилася тут.
          </p>
        </div>
      )}
    </div>
  );
}
