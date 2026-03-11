"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, User } from "lucide-react";

// Інтерфейс для майстра
export interface SidebarMaster {
  id: string;
  firstName: string;
  image: string | null;
}

interface AdminAppointmentsSidebarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  masters: SidebarMaster[];
  selectedMasters: string[];
  onMasterToggle: (masterId: string) => void;
}

export default function AdminAppointmentsSidebar({
  selectedDate,
  onDateSelect,
  masters,
  selectedMasters,
  onMasterToggle,
}: AdminAppointmentsSidebarProps) {
  // Стан для гортання місяців у міні-календарі
  const [currentMonthView, setCurrentMonthView] = useState(
    new Date(selectedDate),
  );

  // Логіка календаря
  const year = currentMonthView.getFullYear();
  const month = currentMonthView.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Зміщуємо, щоб Пн був першим

  const monthName = currentMonthView.toLocaleString("uk-UA", {
    month: "long",
    year: "numeric",
  });
  const dayLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

  const handlePrevMonth = () =>
    setCurrentMonthView(new Date(year, month - 1, 1));
  const handleNextMonth = () =>
    setCurrentMonthView(new Date(year, month + 1, 1));

  const isSelectedDate = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  return (
    <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-6">
      {/* 1. БЛОК КАЛЕНДАРЯ */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-slate-800 capitalize">
            {monthName}
          </span>
          <div className="flex gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1 text-slate-400 hover:text-pink-500 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 text-slate-400 hover:text-pink-500 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Дні тижня */}
        <div className="grid grid-cols-7 mb-2">
          {dayLabels.map((label) => (
            <div
              key={label}
              className="text-[10px] font-bold text-slate-400 text-center uppercase"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Сітка чисел */}
        <div className="grid grid-cols-7 gap-y-1 gap-x-1">
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const selected = isSelectedDate(day);
            return (
              <button
                key={day}
                onClick={() => onDateSelect(new Date(year, month, day))}
                className={`aspect-square flex items-center justify-center text-xs font-bold rounded-full transition-all ${
                  selected
                    ? "bg-pink-300 text-white shadow-md shadow-pink-200" // Стиль як на макеті (рожевий кружечок)
                    : "text-slate-600 hover:bg-pink-50 hover:text-pink-500"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. БЛОК МАЙСТРІВ */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50 flex-1">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Майстри</h3>

        <div className="flex flex-col gap-3">
          {masters.length === 0 ? (
            <p className="text-xs text-slate-400 font-medium">
              Майстрів не знайдено
            </p>
          ) : (
            masters.map((master) => {
              const isChecked = selectedMasters.includes(master.id);

              return (
                <div
                  key={master.id}
                  onClick={() => onMasterToggle(master.id)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  {/* Кастомний чекбокс */}
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors border-2 shrink-0 ${
                      isChecked
                        ? "bg-pink-500 border-pink-500 text-white"
                        : "border-slate-200 text-transparent group-hover:border-pink-300"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>

                  {/* Аватар */}
                  <div className="w-8 h-8 rounded-full bg-pink-50 overflow-hidden flex items-center justify-center shrink-0 border border-slate-100">
                    {master.image ? (
                      <img
                        src={master.image}
                        alt={master.firstName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-pink-300" />
                    )}
                  </div>

                  {/* Ім'я */}
                  <span
                    className={`text-sm font-medium transition-colors ${isChecked ? "text-slate-800" : "text-slate-600 group-hover:text-slate-800"}`}
                  >
                    {master.firstName}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
