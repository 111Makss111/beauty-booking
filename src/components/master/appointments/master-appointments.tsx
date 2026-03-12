"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  User,
  CheckCircle2,
  XCircle,
  BellRing,
  Phone,
} from "lucide-react";

// ДОДАНО: Імпортуємо наш правильний Server Action
import { updateAppointmentStatus } from "@/actions/appointments";

type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

interface AppointmentRequest {
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
    user: { firstName: string; lastName: string | null; image: string | null };
  };
}

export default function AdminRequests() {
  const [requests, setRequests] = useState<AppointmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/admin/requests", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setRequests(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const changeStatus = async (
    appointmentId: string,
    newStatus: AppointmentStatus,
  ) => {
    setProcessingId(appointmentId);
    try {
      // ЗМІНЕНО: Використовуємо Server Action замість старого fetch (Правило №105)
      // Це автоматично запустить нашу логіку сповіщень для Клієнта і Майстра!
      const res = await updateAppointmentStatus(appointmentId, newStatus);

      if (res.success) {
        // Якщо успішно, прибираємо заявку зі списку
        setRequests((prev) => prev.filter((req) => req.id !== appointmentId));
      } else {
        alert(res.error || "Помилка оновлення статусу");
      }
    } catch (error) {
      console.error(error);
      alert("Помилка з'єднання");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-20">
        <Loader2 className="w-10 h-10 animate-spin text-pink-400 mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          Завантажуємо заявки...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white/60 backdrop-blur-md rounded-[2.5rem] p-5 md:p-8 border border-white shadow-sm animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center gap-3 mb-8 ml-2">
        <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center">
          <BellRing className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800">Нові заявки</h2>
          <p className="text-sm font-medium text-slate-500">
            Очікують на підтвердження:{" "}
            <span className="text-rose-500 font-bold">{requests.length}</span>
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 md:pr-2 space-y-4">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white/50 rounded-[2rem] border border-dashed border-slate-200">
            <CheckCircle2 className="w-16 h-16 mb-4 text-green-400 opacity-50" />
            <p className="font-bold text-lg text-slate-600">
              Всі заявки опрацьовано!
            </p>
            <p className="text-sm">Наразі немає нових бронювань.</p>
          </div>
        ) : (
          requests.map((req) => {
            const dateObj = new Date(req.dateTime);
            const dateStr = dateObj.toLocaleDateString("uk-UA", {
              day: "numeric",
              month: "long",
            });
            const timeStr = dateObj.toLocaleTimeString("uk-UA", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const isProcessing = processingId === req.id;

            return (
              <div
                key={req.id}
                className="bg-white border border-rose-100 rounded-[2rem] p-4 md:p-6 flex flex-col xl:flex-row items-start xl:items-center gap-4 md:gap-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-rose-400 to-pink-500" />

                <div className="w-full xl:w-auto min-w-[140px] flex flex-row xl:flex-col items-center justify-between xl:justify-center bg-rose-50 text-rose-600 rounded-2xl py-3 px-5 border border-rose-100 shrink-0 ml-2 xl:ml-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400 xl:mb-1">
                    {dateStr}
                  </span>
                  <span className="text-xl md:text-2xl font-black">
                    {timeStr}
                  </span>
                </div>

                <div className="flex-1 w-full flex flex-col gap-3 ml-2 xl:ml-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-slate-800">
                      {req.service.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl w-fit">
                      <User className="w-4 h-4 text-pink-500" />
                      До майстра: {req.master.user.firstName}{" "}
                      {req.master.user.lastName}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-slate-500">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200">
                        {req.client.image ? (
                          <img
                            src={req.client.image}
                            alt="Client"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <span className="font-bold text-slate-700">
                        {req.client.firstName} {req.client.lastName}
                      </span>
                    </div>

                    {req.client.phone && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Phone className="w-3.5 h-3.5" />
                        {req.client.phone}
                      </div>
                    )}

                    <div className="hidden sm:block w-1.5 h-1.5 bg-slate-300 rounded-full shrink-0" />
                    <span>{req.service.duration} хв</span>
                    <div className="hidden sm:block w-1.5 h-1.5 bg-slate-300 rounded-full shrink-0" />
                    <span className="text-pink-600 font-bold">
                      {req.totalPrice} ₴
                    </span>
                  </div>
                </div>

                <div className="w-full xl:w-auto mt-2 xl:mt-0 pt-4 xl:pt-0 border-t xl:border-none border-slate-50 flex flex-col sm:flex-row gap-2 ml-2 xl:ml-0">
                  <button
                    onClick={() => changeStatus(req.id, "CONFIRMED")}
                    disabled={isProcessing}
                    className="flex-1 xl:flex-none px-6 py-3 rounded-xl bg-green-500 text-white text-sm font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-md shadow-green-200"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Підтвердити
                  </button>
                  <button
                    onClick={() => changeStatus(req.id, "CANCELLED")}
                    disabled={isProcessing}
                    className="flex-1 xl:flex-none px-6 py-3 rounded-xl border-2 border-rose-100 text-rose-500 text-sm font-bold hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" /> Відхилити
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
