"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  CheckSquare,
} from "lucide-react";

// 1. СТВОРЮЄМО ОКРЕМИЙ ТИП ДЛЯ СТАТУСІВ
type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

interface Appointment {
  id: string;
  dateTime: string;
  status: AppointmentStatus; // Використовуємо наш тип
  totalPrice: number;
  service: { name: string; duration: number };
  client: { firstName: string; lastName: string | null; image: string | null };
}

interface MasterAppointmentsProps {
  userId: string;
}

export default function MasterAppointments({
  userId,
}: MasterAppointmentsProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "pending" | "confirmed" | "history"
  >("pending");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`/api/master/appointments?userId=${userId}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setAppointments(data);
        }
      } catch (error) {
        console.error("Помилка:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchAppointments();
  }, [userId]);

  // 2. ВКАЗУЄМО ПРАВИЛЬНИЙ ТИП ДЛЯ newStatus ЗАМІСТЬ string
  const changeStatus = async (
    appointmentId: string,
    newStatus: AppointmentStatus,
  ) => {
    setProcessingId(appointmentId);
    try {
      const res = await fetch("/api/master/appointments/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, status: newStatus }),
      });

      if (res.ok) {
        // 3. ТЕПЕР ТУТ НЕ ТРЕБА "as any", ТАЙПСКРИПТ ЗАДОВОЛЕНИЙ
        setAppointments((prev) =>
          prev.map((app) =>
            app.id === appointmentId ? { ...app, status: newStatus } : app,
          ),
        );
      } else {
        alert("Помилка оновлення статусу");
      }
    } catch (error) {
      console.error(error);
      alert("Помилка з'єднання");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    if (activeTab === "pending") return app.status === "PENDING";
    if (activeTab === "confirmed") return app.status === "CONFIRMED";
    return app.status === "COMPLETED" || app.status === "CANCELLED";
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-20">
        <Loader2 className="w-10 h-10 animate-spin text-pink-400 mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          Завантажуємо розклад...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white/60 backdrop-blur-md rounded-[2.5rem] p-5 md:p-8 border border-white shadow-sm animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-black text-slate-800 ml-2">
          Керування записами
        </h2>

        <div className="flex bg-slate-100/80 p-1.5 rounded-2xl w-full lg:w-auto overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 lg:flex-none whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "pending"
                ? "bg-white text-amber-500 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Нові заявки
            {appointments.filter((a) => a.status === "PENDING").length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                {appointments.filter((a) => a.status === "PENDING").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("confirmed")}
            className={`flex-1 lg:flex-none whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "confirmed"
                ? "bg-white text-pink-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Заплановані
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 lg:flex-none whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "history"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Історія
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 md:pr-2 space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white/50 rounded-[2rem] border border-dashed border-slate-200">
            <Clock className="w-12 h-12 mb-3 opacity-50" />
            <p className="font-medium text-sm text-center px-4">
              Тут поки що порожньо
            </p>
          </div>
        ) : (
          filteredAppointments.map((app) => {
            const dateObj = new Date(app.dateTime);
            const dateStr = dateObj.toLocaleDateString("uk-UA", {
              day: "numeric",
              month: "long",
            });
            const timeStr = dateObj.toLocaleTimeString("uk-UA", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const isProcessing = processingId === app.id;

            return (
              <div
                key={app.id}
                className="bg-white border border-slate-100 rounded-[2rem] p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 shadow-sm hover:shadow-md transition-shadow group w-full"
              >
                <div className="w-full md:w-auto min-w-[120px] flex flex-row md:flex-col items-center justify-between md:justify-center bg-slate-50 text-slate-700 rounded-2xl py-3 px-5 md:py-4 md:px-6 border border-slate-100 shrink-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 md:mb-1">
                    {dateStr}
                  </span>
                  <span className="text-xl md:text-2xl font-black">
                    {timeStr}
                  </span>
                </div>

                <div className="flex-1 w-full flex flex-col gap-3 md:gap-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 md:gap-4">
                    <h3 className="text-base md:text-lg font-bold text-slate-800 leading-tight pr-2">
                      {app.service.name}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs md:text-sm font-medium text-slate-500">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                        {app.client.image ? (
                          <img
                            src={app.client.image}
                            alt="Client"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                      <span className="font-bold text-slate-700">
                        Клієнт: {app.client.firstName}
                      </span>
                    </div>
                    <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full shrink-0" />
                    <span className="bg-slate-50 md:bg-transparent px-2 py-1 md:p-0 rounded-md">
                      {app.service.duration} хв
                    </span>
                    <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full shrink-0" />
                    <span className="text-pink-600 font-bold bg-pink-50 md:bg-transparent px-2 py-1 md:p-0 rounded-md">
                      {app.totalPrice} ₴
                    </span>
                  </div>
                </div>

                <div className="w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-none border-slate-50 flex flex-col sm:flex-row gap-2">
                  {activeTab === "pending" && (
                    <>
                      <button
                        onClick={() => changeStatus(app.id, "CONFIRMED")}
                        disabled={isProcessing}
                        className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-green-500 text-white text-sm font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Підтвердити
                      </button>
                      <button
                        onClick={() => changeStatus(app.id, "CANCELLED")}
                        disabled={isProcessing}
                        className="flex-1 md:flex-none px-5 py-2.5 rounded-xl border border-rose-200 text-rose-500 text-sm font-bold hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Відхилити
                      </button>
                    </>
                  )}

                  {activeTab === "confirmed" && (
                    <button
                      onClick={() => changeStatus(app.id, "COMPLETED")}
                      disabled={isProcessing}
                      className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-bold hover:bg-slate-900 transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                      <CheckSquare className="w-4 h-4 text-green-400" />{" "}
                      Завершити візит
                    </button>
                  )}

                  {activeTab === "history" && (
                    <span
                      className={`px-4 py-2 rounded-xl text-xs font-bold w-full md:w-auto text-center ${app.status === "COMPLETED" ? "bg-slate-100 text-slate-600" : "bg-red-50 text-red-500"}`}
                    >
                      {app.status === "COMPLETED"
                        ? "Візит завершено"
                        : "Скасовано"}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
