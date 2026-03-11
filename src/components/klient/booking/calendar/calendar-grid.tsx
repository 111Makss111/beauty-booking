"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarGridProps {
  currentMonth: Date;
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  fullyBookedDates?: string[];
}

export default function CalendarGrid({
  currentMonth,
  selectedDate,
  onDateClick,
  onPrevMonth,
  onNextMonth,
  fullyBookedDates = [], // За замовчуванням порожній масив, щоб не було помилок
}: CalendarGridProps) {
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).getDay();

  const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const labels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

  const monthName = currentMonth.toLocaleString("uk-UA", {
    month: "long",
    year: "numeric",
  });

  const nowWarsaw = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Warsaw" }),
  );

  const todayStart = new Date(
    nowWarsaw.getFullYear(),
    nowWarsaw.getMonth(),
    nowWarsaw.getDate(),
  );

  const isSelected = (day: number) => {
    return (
      selectedDate?.getDate() === day &&
      selectedDate?.getMonth() === currentMonth.getMonth() &&
      selectedDate?.getFullYear() === currentMonth.getFullYear()
    );
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6 px-1">
        <span className="text-sm font-bold text-slate-800 capitalize">
          {monthName}
        </span>
        <div className="flex gap-1">
          <button
            onClick={onPrevMonth}
            disabled={
              currentMonth.getMonth() === nowWarsaw.getMonth() &&
              currentMonth.getFullYear() === nowWarsaw.getFullYear()
            }
            className="p-1.5 hover:bg-pink-50 rounded-xl transition-colors text-slate-400 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNextMonth}
            className="p-1.5 hover:bg-pink-50 rounded-xl transition-colors text-slate-400"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-3">
        {labels.map((label) => (
          <div
            key={label}
            className="text-[10px] font-black text-slate-300 text-center uppercase tracking-tighter"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => {
          const cellDate = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day,
          );

          const isPast = cellDate < todayStart;

          // Формуємо рядок "YYYY-MM-DD" для перевірки з масивом забитих днів
          const year = currentMonth.getFullYear();
          const monthStr = String(currentMonth.getMonth() + 1).padStart(2, "0");
          const dayStr = String(day).padStart(2, "0");
          const currentDateStr = `${year}-${monthStr}-${dayStr}`;

          // Чи є цей день у списку повністю забитих?
          const isFullyBooked = fullyBookedDates.includes(currentDateStr);

          // Блокуємо день, якщо він минув АБО якщо він повністю зайнятий
          const isDisabled = isPast || isFullyBooked;

          return (
            <button
              key={day}
              disabled={isDisabled}
              onClick={() => onDateClick(cellDate)}
              className={`aspect-square flex items-center justify-center text-xs font-bold rounded-full transition-all duration-300 relative ${
                isDisabled
                  ? "text-slate-300 opacity-50 cursor-not-allowed bg-slate-50/50"
                  : isSelected(day)
                    ? "bg-pink-500 text-white shadow-lg shadow-pink-200 scale-110 z-10"
                    : "text-slate-600 hover:bg-pink-50 hover:text-pink-500"
              }`}
            >
              {day}
              {/* Додаємо лінію перекреслення тільки для повністю забитих (але не минулих) днів */}
              {isFullyBooked && !isPast && (
                <div className="absolute w-6 h-[1px] bg-slate-400 rotate-45" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
