"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  ToggleLeft,
  ToggleRight,
  Save,
  Check,
  Loader2,
} from "lucide-react";
import {
  getWorkingHours,
  updateWorkingHours,
  DaySchedule,
} from "@/settings/actions";
import { DayRow } from "./working-hours/day-row";

export default function WorkingHours() {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allowWeekends, setAllowWeekends] = useState(false);
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { isOpen: true, start: "09:00", end: "18:00" },
    { isOpen: true, start: "09:00", end: "18:00" },
    { isOpen: true, start: "09:00", end: "18:00" },
    { isOpen: true, start: "09:00", end: "18:00" },
    { isOpen: true, start: "09:00", end: "18:00" },
    { isOpen: true, start: "10:00", end: "16:00" },
    { isOpen: false, start: "09:00", end: "18:00" },
  ]);

  const dayNames = [
    "Понеділок",
    "Вівторок",
    "Середа",
    "Четвер",
    "П'ятниця",
    "Субота",
    "Неділя",
  ];

  useEffect(() => {
    async function loadData() {
      const data = await getWorkingHours();
      if (data) {
        setAllowWeekends(data.allowWeekendBooking);
        if (data.workingDays && data.workingDays.length > 0) {
          const sortedDays = [...data.workingDays].sort(
            (a, b) => a.dayOfWeek - b.dayOfWeek,
          );
          setSchedule(
            sortedDays.map((d) => ({
              isOpen: d.isOpen,
              start: d.startTime,
              end: d.endTime,
            })),
          );
        }
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const timeSlots = Array.from({ length: 24 * 2 }, (_, i) => {
    const hours = Math.floor(i / 2)
      .toString()
      .padStart(2, "0");
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hours}:${minutes}`;
  });

  const toggleDay = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index].isOpen = !newSchedule[index].isOpen;
    setSchedule(newSchedule);
    setIsSaved(false);
  };

  const updateTime = (index: number, field: "start" | "end", value: string) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
    setIsSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateWorkingHours(schedule, allowWeekends);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Помилка збереження:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-sm h-[600px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Робочі години</h2>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {schedule.map((item, index) => (
          <DayRow
            key={dayNames[index]}
            dayName={dayNames[index]}
            isOpen={item.isOpen}
            start={item.start}
            end={item.end}
            timeSlots={timeSlots}
            onToggle={() => toggleDay(index)}
            onTimeChange={(field, value) => updateTime(index, field, value)}
          />
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`mt-8 w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] ${
          isSaved
            ? "bg-emerald-500 text-white shadow-emerald-100"
            : "bg-slate-900 text-white shadow-slate-200 hover:bg-slate-800"
        }`}
      >
        {isSaving ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isSaved ? (
          <>
            <Check className="w-5 h-5" /> Збережено
          </>
        ) : (
          <>
            <Save className="w-5 h-5" /> Зберегти графік
          </>
        )}
      </button>
    </div>
  );
}
