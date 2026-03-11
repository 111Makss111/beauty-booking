"use client";

import { User, Check, Clock, X } from "lucide-react";

// Інтерфейси для типізації
type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

interface Appointment {
  id: string;
  dateTime: string;
  status: AppointmentStatus;
  totalPrice: number;
  service: { name: string; duration: number };
  client: {
    firstName: string;
    lastName: string | null;
    image: string | null;
    phone: string | null;
  };
  master: {
    user: {
      id: string;
      firstName: string;
      lastName: string | null;
      image: string | null;
    };
  };
}

interface AdminTimelineViewProps {
  appointments: Appointment[];
  selectedDate: Date;
  selectedMasters: string[];
  selectedAppointmentId: string | null;
  onSelectAppointment: (id: string | null) => void;
}

export default function AdminTimelineView({
  appointments,
  selectedDate,
  selectedMasters,
  selectedAppointmentId,
  onSelectAppointment,
}: AdminTimelineViewProps) {
  // 1. Фільтруємо записи по вибраній даті та вибраних майстрах
  const filteredAppointments = appointments.filter((app) => {
    const appDate = new Date(app.dateTime);
    const isSameDay =
      appDate.getDate() === selectedDate.getDate() &&
      appDate.getMonth() === selectedDate.getMonth() &&
      appDate.getFullYear() === selectedDate.getFullYear();

    const isMasterSelected = selectedMasters.includes(app.master.user.id);

    return isSameDay && isMasterSelected;
  });

  // 2. Генеруємо часові слоти з кроком 30 хвилин (з 09:00 до 19:00)
  const timeSlots: string[] = [];
  for (let h = 9; h <= 23; h++) {
    timeSlots.push(`${h.toString().padStart(2, "0")}:00`);
    if (h !== 19) timeSlots.push(`${h.toString().padStart(2, "0")}:30`);
  }

  // Функція для визначення іконки статусу як на макеті
  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case "CONFIRMED":
      case "COMPLETED":
        return (
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500 shrink-0 border border-green-100">
            <Check className="w-4 h-4" strokeWidth={3} />
          </div>
        );
      case "PENDING":
        return (
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 border border-amber-100">
            <Clock className="w-4 h-4" strokeWidth={3} />
          </div>
        );
      case "CANCELLED":
        return (
          <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0 border border-rose-100">
            <X className="w-4 h-4" strokeWidth={3} />
          </div>
        );
    }
  };

  return (
    <div className="flex-1 bg-slate-50/30 p-2 md:p-6 overflow-y-auto custom-scrollbar relative">
      <div className="flex flex-col gap-4 min-w-[400px]">
        {timeSlots.map((time) => {
          // Шукаємо, чи є запис, який починається в цей час
          const slotAppointments = filteredAppointments.filter((app) => {
            const appDate = new Date(app.dateTime);
            const appTime = `${appDate.getHours().toString().padStart(2, "0")}:${appDate.getMinutes().toString().padStart(2, "0")}`;
            return appTime === time;
          });

          // Якщо записів немає - малюємо порожній слот (або пунктир)
          if (slotAppointments.length === 0) {
            // Щоб не перевантажувати екран, малюємо пунктир тільки для рівних годин
            if (time.endsWith(":00")) {
              return (
                <div
                  key={`empty-${time}`}
                  className="flex items-center gap-6 opacity-40"
                >
                  <span className="w-12 text-sm font-bold text-slate-500 text-right shrink-0">
                    {time}
                  </span>
                  <div className="flex-1 border-t border-dashed border-slate-300"></div>
                </div>
              );
            }
            return null; // Приховуємо порожні :30 для чистоти
          }

          // Якщо записи є - малюємо картки
          return (
            <div
              key={`slot-${time}`}
              className="flex items-start gap-4 md:gap-6 relative"
            >
              {/* Час зліва */}
              <span className="w-12 text-sm font-bold text-slate-600 text-right mt-3 shrink-0">
                {time}
              </span>

              {/* Контейнер для карток (їх може бути кілька в один час, якщо кілька майстрів) */}
              <div className="flex-1 flex flex-col gap-3">
                {slotAppointments.map((app) => {
                  const isSelected = selectedAppointmentId === app.id;

                  return (
                    <button
                      key={app.id}
                      onClick={() =>
                        onSelectAppointment(isSelected ? null : app.id)
                      } // Клік виділяє або знімає виділення
                      className={`w-full flex items-center justify-between p-3 md:p-4 rounded-2xl transition-all border text-left group
                        ${
                          isSelected
                            ? "bg-white border-pink-400 shadow-md ring-2 ring-pink-50"
                            : "bg-white border-slate-100 shadow-sm hover:border-pink-200 hover:shadow-md"
                        }
                      `}
                    >
                      {/* Ліва частина картки (інфо) */}
                      <div className="flex items-start gap-4 overflow-hidden">
                        {/* Кольорова лінія статусу */}
                        <div
                          className={`w-1 h-10 rounded-full shrink-0 ${
                            app.status === "PENDING"
                              ? "bg-amber-400"
                              : app.status === "CONFIRMED"
                                ? "bg-pink-400"
                                : app.status === "COMPLETED"
                                  ? "bg-green-400"
                                  : "bg-rose-400"
                          }`}
                        />

                        <div className="flex flex-col truncate">
                          <h4 className="text-sm font-bold text-slate-800 truncate">
                            {app.service.name}{" "}
                            <span className="text-slate-400 font-medium">
                              — {app.client.firstName} {app.client.lastName}
                            </span>
                          </h4>
                          <div className="flex items-center gap-2 mt-1.5 text-xs font-medium text-slate-500">
                            <div className="w-4 h-4 rounded-full bg-pink-50 overflow-hidden flex items-center justify-center shrink-0">
                              {app.master.user.image ? (
                                <img
                                  src={app.master.user.image}
                                  alt="M"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-2.5 h-2.5 text-pink-400" />
                              )}
                            </div>
                            <span className="text-pink-600">
                              {app.master.user.firstName}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Права частина картки (іконка статусу) */}
                      {getStatusIcon(app.status)}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
