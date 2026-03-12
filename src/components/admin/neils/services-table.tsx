"use client";

import { useEffect, useState } from "react";
import {
  MoreHorizontal,
  Edit2,
  Copy,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Clock,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/currency"; // Імпортуємо утиліту

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
        console.error("Помилка завантаження послуг:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours} г ${mins} хв`;
    if (hours > 0) return `${hours} год`;
    return `${mins} хв`;
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, isActive: !currentStatus } : service,
      ),
    );
    // Тут варто додати запит до API для збереження статусу
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Видалити цю послугу?")) return;
    setServices((prev) => prev.filter((service) => service.id !== id));
    setOpenDropdownId(null);
    // Додай fetch(..., { method: 'DELETE' }) за потреби
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
    <div className="w-full pb-20">
      <table className="w-full text-left border-collapse block lg:table">
        <thead className="hidden lg:table-header-group">
          <tr className="text-slate-400 border-b border-pink-100/50">
            <th className="pb-4 font-medium px-4">Послуги</th>
            <th className="pb-4 font-medium px-4">Тривалість</th>
            <th className="pb-4 font-medium px-4">Ціна</th>
            <th className="pb-4 font-medium px-4">Стан</th>
            <th className="pb-4 font-medium px-4 text-right"></th>
          </tr>
        </thead>
        <tbody className="block lg:table-row-group space-y-4 lg:space-y-0">
          {filteredServices.map((service) => (
            <tr
              key={service.id}
              className="group block lg:table-row bg-white lg:bg-transparent rounded-2xl lg:rounded-none border border-pink-50 lg:border-0 lg:border-b lg:border-pink-50/50 hover:bg-white/40 transition-colors p-4 lg:p-0 relative shadow-sm lg:shadow-none"
            >
              {/* НАЗВА ТА ФОТО */}
              <td className="block lg:table-cell py-2 lg:py-4 px-0 lg:px-4 mb-2 lg:mb-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-300 shrink-0 overflow-hidden shadow-inner">
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
                  <div className="min-w-0 pr-10 lg:pr-0">
                    <span className="font-bold text-slate-700 block truncate lg:whitespace-normal">
                      {service.name}
                    </span>
                    <span className="lg:hidden text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      {service.category || "Без категорії"}
                    </span>
                  </div>
                </div>
              </td>

              {/* ТРИВАЛІСТЬ ТА ЦІНА (Мобільна версія) */}
              <td className="block lg:table-cell py-1 lg:py-4 px-0 lg:px-4 text-slate-600">
                <div className="flex lg:block items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm lg:text-base font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400 lg:hidden" />
                    {formatDuration(service.duration)}
                  </div>
                  <div className="lg:hidden w-1 h-1 bg-slate-200 rounded-full" />
                  {/* ВИПРАВЛЕНО: Ціна для мобілки */}
                  <div className="flex lg:hidden items-center gap-1 text-pink-600 font-bold">
                    {formatPrice(service.price)}
                  </div>
                </div>
              </td>

              {/* ЦІНА (Десктоп) */}
              <td className="hidden lg:table-cell py-4 px-4 text-slate-700 font-bold">
                {formatPrice(service.price)}
              </td>

              {/* СТАН */}
              <td className="block lg:table-cell py-3 lg:py-4 px-0 lg:px-4">
                <label className="flex items-center justify-between lg:justify-start gap-2 cursor-pointer w-full lg:w-max bg-slate-50 lg:bg-transparent p-2 lg:p-0 rounded-xl">
                  <span className="lg:hidden text-xs font-bold text-slate-500 pl-1">
                    Статус:
                  </span>
                  <div className="flex items-center gap-3">
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
                        className={`block w-10 h-5 rounded-full transition-colors duration-300 ${service.isActive ? "bg-emerald-400" : "bg-slate-300"}`}
                      />
                      <div
                        className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform duration-300 ${service.isActive ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </div>
                    <span
                      className={`text-xs font-bold uppercase tracking-tight ${service.isActive ? "text-emerald-500" : "text-slate-400"}`}
                    >
                      {service.isActive ? "Активна" : "Пауза"}
                    </span>
                  </div>
                </label>
              </td>

              {/* МЕНЮ */}
              <td className="absolute lg:static top-4 right-4 py-0 lg:py-4 px-0 lg:px-4 text-right">
                <button
                  onClick={() => toggleDropdown(service.id)}
                  className="p-2 text-slate-300 hover:text-pink-500 bg-slate-50 lg:bg-transparent rounded-full transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>

                {openDropdownId === service.id && (
                  <div className="absolute right-0 lg:right-8 top-10 lg:top-12 w-48 bg-white rounded-2xl shadow-xl border border-pink-50 py-2 z-10 animate-in fade-in zoom-in-95 duration-200">
                    <button
                      onClick={() => {
                        onEditClick(service.id);
                        setOpenDropdownId(null);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-pink-50 hover:text-pink-600 flex items-center gap-2 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Редагувати
                    </button>
                    <button
                      onClick={() => setOpenDropdownId(null)}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-pink-50 hover:text-pink-600 flex items-center gap-2 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      Дублювати
                    </button>
                    <div className="h-px bg-slate-50 my-1 mx-2" />
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="w-full text-left px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 flex items-center gap-2 transition-colors"
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
        <div className="text-center py-20 flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-pink-50 mb-3 text-pink-200">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-slate-700 font-bold">Послуг не знайдено</h3>
          <p className="text-slate-400 text-sm mt-1 px-10">
            Спробуйте змінити фільтри або додайте нову послугу.
          </p>
        </div>
      )}
    </div>
  );
}
