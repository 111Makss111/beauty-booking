"use client";

import { useEffect, useState } from "react";
import { Loader2, CalendarSearch } from "lucide-react";

interface TimeSlotsProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onTimeClick: (time: string) => void;
  masterId?: string;
  serviceDuration?: number;
}

interface ApiInterval {
  start: string;
  end: string;
}

export default function TimeSlots({
  selectedDate,
  selectedTime,
  onTimeClick,
  masterId,
  serviceDuration = 60,
}: TimeSlotsProps) {
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

  const [bookedIntervals, setBookedIntervals] = useState<
    { startMs: number; endMs: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  // Стан для збереження години, на яку клікнули, але вона зайнята
  const [unavailableClicked, setUnavailableClicked] = useState<string | null>(
    null,
  );

  const dateStr = selectedDate
    ? new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .split("T")[0]
    : "";

  // Скидаємо підказку, якщо клієнт обрав інший день
  useEffect(() => {
    setUnavailableClicked(null);
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedDate || !masterId || !dateStr) return;

    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/klient/availability?masterId=${masterId}&date=${dateStr}`,
          {
            cache: "no-store",
          },
        );
        if (res.ok) {
          const data = await res.json();
          const intervals = data.bookedIntervals.map((inv: ApiInterval) => ({
            startMs: new Date(inv.start).getTime(),
            endMs: new Date(inv.end).getTime(),
          }));
          setBookedIntervals(intervals);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [selectedDate, masterId, dateStr]);

  const now = new Date();
  const isToday =
    selectedDate &&
    selectedDate.getDate() === now.getDate() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getFullYear() === now.getFullYear();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-pink-400 mb-2" />
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Перевіряємо графік...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
        Доступні вікна
      </h4>

      <div className="grid grid-cols-4 gap-2">
        {allSlots.map((time) => {
          let isUnavailable = false;

          if (selectedDate && dateStr) {
            const [hours, minutes] = time.split(":").map(Number);

            // 1. Перевірка на минулий час (якщо сьогодні)
            if (isToday) {
              if (
                hours < now.getHours() ||
                (hours === now.getHours() && minutes <= now.getMinutes())
              ) {
                isUnavailable = true;
              }
            }

            // 2. Перевірка бази даних
            if (!isUnavailable) {
              const slotStart = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                hours,
                minutes,
                0,
              );
              const slotStartMs = slotStart.getTime();
              const slotEndMs = slotStartMs + serviceDuration * 60000;

              for (const interval of bookedIntervals) {
                if (
                  slotStartMs < interval.endMs &&
                  slotEndMs > interval.startMs
                ) {
                  isUnavailable = true;
                  break;
                }
              }
            }
          }

          return (
            <button
              key={time}
              onClick={() => {
                if (isUnavailable) {
                  // Якщо зайнято — показуємо підказку, знімаємо вибір з вільного часу
                  setUnavailableClicked(time);
                  onTimeClick("");
                } else {
                  // Якщо вільно — прибираємо підказку і обираємо час
                  setUnavailableClicked(null);
                  onTimeClick(time);
                }
              }}
              className={`py-2.5 rounded-xl text-[11px] font-bold border transition-all duration-300 ${
                isUnavailable
                  ? unavailableClicked === time
                    ? "bg-slate-100 border-slate-300 text-slate-500 line-through ring-2 ring-slate-200"
                    : "bg-slate-50 border-slate-100 text-slate-300 opacity-60 line-through hover:opacity-80"
                  : selectedTime === time
                    ? "bg-pink-500 border-pink-500 text-white shadow-md"
                    : "bg-white border-slate-100 text-slate-600 hover:border-pink-200 hover:text-pink-500"
              }`}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
}
