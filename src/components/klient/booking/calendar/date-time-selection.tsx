"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import CalendarGrid from "./calendar-grid";
import TimeSlots from "./time-slots";

interface DateTimeSelectionProps {
  onSelect: (date: Date, time: string) => void;
  selectedDate: Date | null;
  selectedTime: string | null;
  masterId?: string;
  serviceDuration?: number;
}

interface ApiInterval {
  start: string;
  end: string;
}

export default function DateTimeSelection({
  onSelect,
  selectedDate,
  selectedTime,
  masterId,
  serviceDuration = 60,
}: DateTimeSelectionProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [fullyBookedDates, setFullyBookedDates] = useState<string[]>([]);

  const handlePrevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  const handleNextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );

  const handleDateSelect = (date: Date) => {
    if (selectedTime) onSelect(date, selectedTime);
    else onSelect(date, "");
  };

  useEffect(() => {
    if (!masterId) return;

    const fetchMonthAvailability = async () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;

      try {
        const res = await fetch(
          `/api/klient/availability/month?masterId=${masterId}&year=${year}&month=${month}`,
          { cache: "no-store" },
        );
        if (res.ok) {
          const data = await res.json();
          const intervals = data.bookedIntervals.map((inv: ApiInterval) => ({
            startMs: new Date(inv.start).getTime(),
            endMs: new Date(inv.end).getTime(),
          }));

          const daysInMonth = new Date(year, month, 0).getDate();
          const bookedDaysStr: string[] = [];
          const now = new Date();
          const allSlots = [
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "13:30",
            "14:30",
            "15:30",
            "16:30",
            "17:00",
            "18:00",
            "19:00",
            "20:00",
          ];

          for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            let hasFreeSlot = false;

            for (const time of allSlots) {
              const [hours, minutes] = time.split(":").map(Number);
              let isUnavailable = false;

              // Перевірка минулого часу
              if (
                year === now.getFullYear() &&
                month === now.getMonth() + 1 &&
                day === now.getDate()
              ) {
                if (
                  hours < now.getHours() ||
                  (hours === now.getHours() && minutes <= now.getMinutes())
                ) {
                  isUnavailable = true;
                }
              } else if (
                new Date(year, month - 1, day) <
                new Date(now.getFullYear(), now.getMonth(), now.getDate())
              ) {
                isUnavailable = true;
              }

              // ФІКС: Ідеальний збіг локального часу з базою
              if (!isUnavailable) {
                const slotStart = new Date(
                  year,
                  month - 1,
                  day,
                  hours,
                  minutes,
                  0,
                );
                const slotStartMs = slotStart.getTime();
                const slotEndMs = slotStartMs + serviceDuration * 60000;

                for (const inv of intervals) {
                  if (slotStartMs < inv.endMs && slotEndMs > inv.startMs) {
                    isUnavailable = true;
                    break;
                  }
                }
              }

              if (!isUnavailable) {
                hasFreeSlot = true;
                break; // Знайшли вільне вікно — день НЕ забитий
              }
            }

            if (!hasFreeSlot) {
              bookedDaysStr.push(dateStr);
            }
          }
          setFullyBookedDates(bookedDaysStr);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchMonthAvailability();
  }, [currentMonth, masterId, serviceDuration]);

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
      <CalendarGrid
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onDateClick={handleDateSelect}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        fullyBookedDates={fullyBookedDates} // Передаємо справжній список
      />

      <TimeSlots
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onTimeClick={(time) => selectedDate && onSelect(selectedDate, time)}
        masterId={masterId}
        serviceDuration={serviceDuration}
      />

      <div className="mt-auto pt-6 flex items-center gap-2 text-slate-300 border-t border-slate-50">
        <Clock className="w-3 h-3" />
        <span className="text-[10px] font-medium italic tracking-tight">
          Час відображено за вашим місцевим поясом
        </span>
      </div>
    </div>
  );
}
