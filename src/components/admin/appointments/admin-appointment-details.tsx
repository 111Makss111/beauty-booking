"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Phone,
  Mail,
  Clock,
  CreditCard,
  XCircle,
  CheckCircle2,
  User,
  Send,
  MessageSquare,
  Loader2, // Додано іконку завантаження
} from "lucide-react";
import toast from "react-hot-toast";
import { sendSystemMessage } from "@/messages/actions";
// Правило №21: Використовуємо наш новий екшен
import { updateAppointmentStatus } from "@/actions/appointments";

type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

interface Appointment {
  id: string;
  dateTime: string;
  status: AppointmentStatus;
  totalPrice: number;
  service: { name: string; duration: number };
  client: {
    id: string;
    firstName: string;
    lastName: string | null;
    image: string | null;
    phone: string | null;
    email?: string | null;
  };
  master: {
    user: {
      id: string;
      firstName: string;
      lastName: string | null;
      image: string | null;
    };
  };
  notes?: string | null;
}

interface AdminAppointmentDetailsProps {
  appointment: Appointment | undefined;
  onClose?: () => void;
}

export default function AdminAppointmentDetails({
  appointment,
  onClose,
}: AdminAppointmentDetailsProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isSending, setIsSending] = useState(false);
  // Правило №62: Додано стан для оновлення статусу
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  if (!appointment) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 font-bold text-center px-4">
        Виберіть запис на таймлайні для перегляду деталей
      </div>
    );
  }

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case "PENDING":
        return "text-amber-500 bg-amber-50 border-amber-200";
      case "CONFIRMED":
        return "text-green-600 bg-green-50 border-green-200";
      case "COMPLETED":
        return "text-slate-600 bg-slate-50 border-slate-200";
      case "CANCELLED":
        return "text-rose-600 bg-rose-50 border-rose-200";
    }
  };

  const getStatusText = (status: AppointmentStatus) => {
    switch (status) {
      case "PENDING":
        return "Очікує підтвердження";
      case "CONFIRMED":
        return "Підтверджено";
      case "COMPLETED":
        return "Виконано";
      case "CANCELLED":
        return "Скасовано";
    }
  };

  const appointmentDate = new Date(appointment.dateTime);
  const formattedTime = appointmentDate.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = appointmentDate.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
  });

  const templates = [
    `Добрий день! Нагадуємо про ваш запис на ${formattedDate} о ${formattedTime}. Чекаємо на вас!`,
    `Добрий день! Просимо підтвердити ваш сьогоднішній візит о ${formattedTime}.`,
    `На жаль, ми змушені скасувати ваш запис. Будь ласка, зв'яжіться з нами для перенесення на інший зручний час.`,
    "Дякуємо за візит до Beauty Nails! Будемо вдячні, якщо ви залишите відгук про роботу нашого майстра.",
  ];

  const handleSendMessage = async () => {
    if (!selectedTemplate || !appointment?.client.id) {
      toast.error("Бракує даних для відправки!");
      return;
    }

    setIsSending(true);

    try {
      const res = await sendSystemMessage(
        appointment.client.id,
        selectedTemplate,
      );

      if (res?.error) {
        toast.error(`Помилка: ${res.error}`);
      } else {
        toast.success("Повідомлення успішно надіслано!");
        setSelectedTemplate("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Сталася помилка при відправці.");
    } finally {
      setIsSending(false);
    }
  };

  // Правило №19: Окрема функція для зміни статусу
  const handleStatusUpdate = async (newStatus: AppointmentStatus) => {
    setIsUpdatingStatus(true);

    try {
      const result = await updateAppointmentStatus(appointment.id, newStatus);

      if (result.success) {
        toast.success(
          `Статус змінено на "${getStatusText(newStatus)}" та відправлено сповіщення!`,
        );
        // Зверни увагу: revalidatePath в Server Action автоматично оновить дані компонента
      } else {
        toast.error(result.error || "Не вдалося оновити статус");
      }
    } catch (error) {
      toast.error("Сталася критична помилка під час оновлення");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">Деталі запису</h3>
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
        {/* БЛОК КЛІЄНТА */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden shrink-0 border-2 border-white shadow-sm">
            {appointment.client.image ? (
              <img
                src={appointment.client.image}
                alt="Client"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-slate-400 m-4" />
            )}
          </div>
          <div className="flex flex-col">
            <h4 className="text-lg font-bold text-slate-800">
              {appointment.client.firstName} {appointment.client.lastName}
            </h4>

            {appointment.client.phone ? (
              <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-1">
                <Phone className="w-3.5 h-3.5" /> {appointment.client.phone}
              </p>
            ) : (
              <p className="text-sm font-medium text-slate-400 flex items-center gap-1.5 mt-1 italic">
                <Phone className="w-3.5 h-3.5 opacity-50" /> Номер відсутній
              </p>
            )}

            <p className="text-sm font-medium text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" />{" "}
              {appointment.client.email || "Немає email"}
            </p>
          </div>
        </div>

        {/* БЛОК ПОСЛУГИ */}
        <div className="bg-pink-50/50 border border-pink-100 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-500 flex items-center justify-center shrink-0">
              <div className="w-5 h-5 bg-pink-500 rounded-sm rotate-45"></div>
            </div>
            <div>
              <h5 className="font-bold text-slate-800">
                {appointment.service.name}
              </h5>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />{" "}
                  {appointment.service.duration} хв
                </span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" />{" "}
                  {appointment.totalPrice} ₴
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-pink-50 w-fit">
            <div className="w-5 h-5 rounded-full bg-slate-100 overflow-hidden">
              {appointment.master.user.image ? (
                <img
                  src={appointment.master.user.image}
                  alt="M"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-3 h-3 text-slate-400 m-1" />
              )}
            </div>
            <span className="text-xs font-bold text-slate-600">
              {appointment.master.user.firstName}
            </span>
          </div>
        </div>

        {/* СТАТУС ТА КНОПКИ КЕРУВАННЯ */}
        <div className="flex flex-col gap-3">
          <div
            className={`flex items-center justify-between px-4 py-3 rounded-xl border ${getStatusColor(
              appointment.status,
            )} font-bold text-sm`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {getStatusText(appointment.status)}
            </div>
            {isUpdatingStatus && (
              <Loader2 className="w-4 h-4 animate-spin opacity-50" />
            )}
          </div>

          {/* Правило №26: Умови читаються легко (відображаємо кнопки залежно від статусу) */}
          <div className="flex items-center gap-2">
            {appointment.status === "PENDING" && (
              <button
                onClick={() => handleStatusUpdate("CONFIRMED")}
                disabled={isUpdatingStatus}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" /> Підтвердити
              </button>
            )}

            {(appointment.status === "PENDING" ||
              appointment.status === "CONFIRMED") && (
              <button
                onClick={() => handleStatusUpdate("CANCELLED")}
                disabled={isUpdatingStatus}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-200 text-rose-500 font-bold text-sm hover:bg-rose-50 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" /> Скасувати
              </button>
            )}

            {appointment.status === "CONFIRMED" && (
              <button
                onClick={() => handleStatusUpdate("COMPLETED")}
                disabled={isUpdatingStatus}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" /> Завершити
              </button>
            )}
          </div>
        </div>

        {/* НОТАТКИ */}
        {appointment.notes && (
          <div className="flex flex-col gap-2">
            <h5 className="text-sm font-bold text-slate-700">
              Нотатки клієнта
            </h5>
            <div className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600 font-medium leading-relaxed">
              {appointment.notes}
            </div>
          </div>
        )}

        {/* СИСТЕМНЕ ПОВІДОМЛЕННЯ В ЧАТ */}
        <div className="p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 bg-white">
          <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <MessageSquare className="w-4 h-4 text-pink-500" /> Надіслати
            повідомлення
          </span>

          <div className="flex flex-col gap-3">
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-600 bg-slate-50 outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 transition-all cursor-pointer truncate"
            >
              <option value="" disabled>
                Оберіть шаблон...
              </option>
              {templates.map((tpl, i) => (
                <option key={i} value={tpl} className="truncate">
                  {tpl.length > 50 ? tpl.substring(0, 50) + "..." : tpl}
                </option>
              ))}
            </select>

            <button
              onClick={handleSendMessage}
              disabled={!selectedTemplate || isSending}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-pink-500 text-white font-bold text-sm hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-pink-200"
            >
              {isSending ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Надіслати в чат
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
