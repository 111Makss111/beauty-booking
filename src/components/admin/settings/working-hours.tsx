"use client";

import { useState } from "react";
import { Clock, Save, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast"; // Правило №44: Видимі помилки
import { updateWorkingHours, DaySchedule } from "@/settings/actions/salon"; // Оновлений шлях
import { DayRow } from "./working-hours/day-row";

// Правило №99: Типи винесені окремо
interface WorkingHoursProps {
  initialSchedule: DaySchedule[];
  initialAllowWeekends: boolean;
}

// Правило №28: Статичні константи винесені за межі компонента
const DAY_NAMES = [
  "Понеділок",
  "Вівторок",
  "Середа",
  "Четвер",
  "П'ятниця",
  "Субота",
  "Неділя",
];

const TIME_SLOTS = Array.from({ length: 24 * 2 }, (_, i) => {
  const hours = Math.floor(i / 2)
    .toString()
    .padStart(2, "0");
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${hours}:${minutes}`;
});

export default function WorkingHours({
  initialSchedule,
  initialAllowWeekends,
}: WorkingHoursProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  // Правило №105: Використовуємо дані з сервера, без useEffect
  const [allowWeekends, setAllowWeekends] = useState(initialAllowWeekends);
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);

  const toggleDay = (index: number) => {
    setSchedule((prev) => {
      const newSchedule = [...prev];
      newSchedule[index].isOpen = !newSchedule[index].isOpen;
      return newSchedule;
    });
    setIsSaved(false);
  };

  const updateTime = (index: number, field: "start" | "end", value: string) => {
    setSchedule((prev) => {
      const newSchedule = [...prev];
      newSchedule[index][field] = value;
      return newSchedule;
    });
    setIsSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Працюємо з нашою новою об'єктною структурою
      const result = await updateWorkingHours(schedule, allowWeekends);

      if (result && !result.success) {
        throw new Error(result.error || "Не вдалося зберегти графік");
      }

      setIsSaved(true);
      toast.success("Графік успішно збережено!");
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      // Правило №38 та №44: Безпечне виведення помилки без any
      const message =
        error instanceof Error ? error.message : "Сталася помилка";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  // Правило №102: Блок if (isLoading) повністю видалено — він більше не потрібен

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
            key={DAY_NAMES[index]}
            dayName={DAY_NAMES[index]}
            isOpen={item.isOpen}
            start={item.start}
            end={item.end}
            timeSlots={TIME_SLOTS}
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
