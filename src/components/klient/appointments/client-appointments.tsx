"use client";

import { useEffect, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  User,
  AlertCircle,
} from "lucide-react";

interface Appointment {
  id: string;
  dateTime: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  totalPrice: number;
  service: { name: string; duration: number };
  master: {
    user: { firstName: string; lastName: string | null; image: string | null };
  };
}

interface ClientAppointmentsProps {
  clientId: string;
}

export default function ClientAppointments({
  clientId,
}: ClientAppointmentsProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // НОВИЙ СТАН: зберігає ID запису, який клієнт хоче скасувати (відкриває модалку)
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          `/api/klient/my-appointments?clientId=${clientId}`,
          {
            cache: "no-store",
          },
        );
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

    if (clientId) fetchAppointments();
  }, [clientId]);

  // ФУНКЦІЯ: Тільки відкриває красиву модалку
  const handleOpenCancelModal = (appointmentId: string) => {
    setAppointmentToCancel(appointmentId);
  };

  // ФУНКЦІЯ: Реальне скасування (після підтвердження в модалці)
  const confirmCancel = async () => {
    if (!appointmentToCancel) return;

    setCancellingId(appointmentToCancel);
    try {
      const res = await fetch("/api/klient/appointments/cancel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: appointmentToCancel }),
      });

      if (res.ok) {
        setAppointments((prev) =>
          prev.map((app) =>
            app.id === appointmentToCancel
              ? { ...app, status: "CANCELLED" }
              : app,
          ),
        );
      } else {
        alert("Помилка скасування. Спробуйте ще раз.");
      }
    } catch (error) {
      console.error(error);
      alert("Помилка з'єднання з сервером.");
    } finally {
      setCancellingId(null);
      setAppointmentToCancel(null); // Закриваємо модалку
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    if (activeTab === "active") {
      return app.status === "PENDING" || app.status === "CONFIRMED";
    }
    return app.status === "COMPLETED" || app.status === "CANCELLED";
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1.5 w-fit">
            <Clock className="w-3 h-3" /> Очікує підтвердження
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="w-3 h-3" /> Підтверджено
          </span>
        );
      case "COMPLETED":
        return (
          <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold w-fit">
            Виконано
          </span>
        );
      case "CANCELLED":
        return (
          <span className="bg-red-100 text-red-600 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1.5 w-fit">
            <XCircle className="w-3 h-3" /> Скасовано
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-20">
        <Loader2 className="w-10 h-10 animate-spin text-pink-400 mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          Завантажуємо записи...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full bg-white/60 backdrop-blur-md rounded-[2.5rem] p-5 md:p-8 border border-white shadow-sm animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-black text-slate-800 ml-2">
            Мої записи
          </h2>

          <div className="flex bg-slate-100/80 p-1.5 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("active")}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "active"
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Активні
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
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
              <CalendarClock className="w-12 h-12 mb-3 opacity-50" />
              <p className="font-medium text-sm text-center px-4">
                У вас немає записів у цій категорії
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

              const isCancelling = cancellingId === app.id;

              return (
                <div
                  key={app.id}
                  className="bg-white border border-slate-100 rounded-[2rem] p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 shadow-sm hover:shadow-md transition-shadow group w-full"
                >
                  <div className="w-full md:w-auto min-w-[120px] flex flex-row md:flex-col items-center justify-between md:justify-center bg-pink-50 text-pink-600 rounded-2xl py-3 px-5 md:py-4 md:px-6 border border-pink-100 shrink-0">
                    <span className="text-xs font-bold uppercase tracking-wider text-pink-400 md:mb-1">
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
                      <div className="shrink-0">
                        {getStatusBadge(app.status)}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs md:text-sm font-medium text-slate-500 mt-1 md:mt-0">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                          {app.master.user.image ? (
                            <img
                              src={app.master.user.image}
                              alt="Master"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-3 h-3 text-slate-400" />
                          )}
                        </div>
                        <span className="truncate max-w-[140px] md:max-w-none">
                          Майстер {app.master.user.firstName}
                        </span>
                      </div>

                      <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full shrink-0" />
                      <span className="bg-slate-50 md:bg-transparent px-2 py-1 md:p-0 rounded-md whitespace-nowrap">
                        {app.service.duration} хв
                      </span>

                      <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full shrink-0" />
                      <span className="text-slate-800 font-bold bg-slate-50 md:bg-transparent px-2 py-1 md:p-0 rounded-md whitespace-nowrap">
                        {app.totalPrice} ₴
                      </span>
                    </div>
                  </div>

                  {activeTab === "active" && (
                    <div className="w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-none border-slate-50">
                      <button
                        onClick={() => handleOpenCancelModal(app.id)}
                        disabled={isCancelling}
                        className="w-full md:w-auto px-5 py-3 md:py-2.5 rounded-xl border border-rose-200 text-rose-500 text-sm font-bold hover:bg-rose-50 hover:border-rose-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isCancelling ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Обробка...
                          </>
                        ) : (
                          "Скасувати"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* КРАСИВЕ МОДАЛЬНЕ ВІКНО ПІДТВЕРДЖЕННЯ */}
      {appointmentToCancel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-5">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-slate-800 mb-2">
              Скасувати запис?
            </h3>
            <p className="text-sm text-slate-500 font-medium mb-8">
              Ви дійсно хочете скасувати цей візит? Цю дію неможливо відмінити.
            </p>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={confirmCancel}
                className="w-full py-3.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition-colors"
              >
                Так, скасувати
              </button>
              <button
                onClick={() => setAppointmentToCancel(null)}
                className="w-full py-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold transition-colors"
              >
                Ні, залишити
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
