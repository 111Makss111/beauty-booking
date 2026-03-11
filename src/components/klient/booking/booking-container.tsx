"use client";

import { useState } from "react";
import { ChevronLeft, CheckCircle2, AlertCircle } from "lucide-react";
import ServiceSelection from "./service-selection";
import MasterSelection, { Master } from "./master-selection";
import DateTimeSelection from "./calendar/date-time-selection";
import ExtraOptionsSelection, { ExtraOption } from "./extra-options-selection";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  image?: string | null;
}

interface BookingContainerProps {
  clientId: string;
}

export default function BookingContainer({ clientId }: BookingContainerProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedMaster, setSelectedMaster] = useState<Master | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [mobileStep, setMobileStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Обрали послугу -> йдемо до майстра
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setBookingError(null);
    setMobileStep(2);
  };

  // 2. Обрали майстра -> йдемо до календаря
  const handleMasterSelect = (master: Master) => {
    setSelectedMaster(master);
    setBookingError(null);
    setMobileStep(3);
  };

  // 3. Обрали час -> йдемо до додаткових опцій
  const handleDateTimeSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time !== "" ? time : null);
    setBookingError(null);

    if (time !== "") {
      setMobileStep(4);
    }
  };

  const handleConfirmBooking = async (selectedExtras: ExtraOption[]) => {
    if (!selectedService || !selectedMaster || !selectedDate || !selectedTime)
      return;

    setIsSubmitting(true);
    setBookingError(null);

    const extrasPrice = selectedExtras.reduce((sum, opt) => sum + opt.price, 0);
    const totalPrice = selectedService.price + extrasPrice;
    const totalDuration =
      selectedService.duration + (selectedExtras.length > 0 ? 30 : 0);

    // ІДЕАЛЬНИЙ ЧАС: Беремо обрану дату і намертво пришиваємо до неї години і хвилини
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const exactStartDateTime = new Date(selectedDate);
    exactStartDateTime.setHours(hours, minutes, 0, 0);

    const payload = {
      serviceId: selectedService.id,
      masterUserId: selectedMaster.id,
      clientId: clientId,
      // Відправляємо серверу єдиний, ідеально точний формат часу
      dateTime: exactStartDateTime.toISOString(),
      totalPrice,
      totalDuration,
      extraOptionIds: selectedExtras.map((opt) => opt.id),
    };
    // ... далі код fetch без змін

    try {
      const res = await fetch("/api/klient/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        const data = await res.json();
        setBookingError(
          data.error || "Не вдалося створити запис. Спробуйте ще раз.",
        );
      }
    } catch (error) {
      setBookingError("Помилка з'єднання з сервером.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetBooking = () => {
    setIsSuccess(false);
    setMobileStep(1);
    setSelectedService(null);
    setSelectedMaster(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingError(null);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-md rounded-[2.5rem] p-10 lg:p-16 shadow-xl border border-white text-center w-full max-w-2xl mx-auto animate-in zoom-in-95 fade-in duration-500 mt-4 lg:mt-10">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-black text-slate-800 mb-4">
          Запис успішно створено!
        </h2>
        <p className="text-slate-500 font-medium mb-10 max-w-md">
          Вашу заявку відправлено на розгляд. Ви можете слідкувати за її
          статусом у розділі{" "}
          <span className="text-pink-500 font-bold">Мої записи</span>.
        </p>
        <button
          onClick={resetBooking}
          className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg shadow-slate-200 hover:shadow-xl hover:-translate-y-0.5"
        >
          Зробити ще один запис
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-black text-slate-800 ml-2">
        Записи на Манікюр
      </h2>
      <p className="text-slate-500 font-medium">
        Оберіть послугу,майстра, дату та час
      </p>
      <p></p>
      {bookingError && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-bold">{bookingError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start relative overflow-hidden lg:overflow-visible p-1">
        {/* ================= КОЛОНКА 1: Послуги ================= */}
        <div
          className={`bg-white/60 backdrop-blur-md rounded-[2.5rem] p-6 border border-white shadow-sm h-[600px] flex-col transition-all duration-500 ${mobileStep === 1 ? "flex animate-in fade-in slide-in-from-left-4" : "hidden lg:flex"}`}
        >
          <ServiceSelection
            selectedServiceId={selectedService?.id || null}
            onSelect={handleServiceSelect}
          />
        </div>

        {/* ================= КОЛОНКА 2: Майстер (Тепер тут!) ================= */}
        <div
          className={`bg-white/60 backdrop-blur-md rounded-[2.5rem] p-6 border border-white shadow-sm h-[600px] flex-col transition-all duration-500 ${mobileStep === 2 ? "flex animate-in fade-in slide-in-from-right-4" : "hidden lg:flex"} ${!selectedService ? "lg:opacity-50 lg:pointer-events-none" : "lg:opacity-100"}`}
        >
          <button
            onClick={() => setMobileStep(1)}
            className="lg:hidden flex items-center gap-1 text-slate-400 hover:text-pink-500 mb-4 text-xs font-bold transition-colors w-fit"
          >
            <ChevronLeft className="w-4 h-4" /> Назад до послуг
          </button>
          {!selectedService ? (
            <div className="flex flex-col items-center justify-center h-full">
              <h3 className="text-sm font-bold text-slate-700 mb-4 w-full text-left">
                Оберіть майстра
              </h3>
              <div className="flex-1 flex items-center justify-center text-slate-400 text-xs italic text-center">
                Спочатку оберіть послугу...
              </div>
            </div>
          ) : (
            <MasterSelection
              selectedMasterId={selectedMaster?.id || null}
              onSelect={handleMasterSelect}
            />
          )}
        </div>

        {/* ================= КОЛОНКА 3: Дата та час (Тепер тут!) ================= */}
        <div
          className={`bg-white/60 backdrop-blur-md rounded-[2.5rem] p-6 border border-white shadow-sm h-[600px] flex-col transition-all duration-500 overflow-y-auto custom-scrollbar ${mobileStep === 3 ? "flex animate-in fade-in slide-in-from-right-4" : "hidden lg:flex"} ${!selectedMaster ? "lg:opacity-50 lg:pointer-events-none" : "lg:opacity-100"}`}
        >
          <button
            onClick={() => setMobileStep(2)}
            className="lg:hidden flex items-center gap-1 text-slate-400 hover:text-pink-500 mb-4 text-xs font-bold transition-colors w-fit"
          >
            <ChevronLeft className="w-4 h-4" /> Назад до майстрів
          </button>
          {!selectedMaster ? (
            <div className="flex flex-col items-center justify-center h-full">
              <h3 className="text-sm font-bold text-slate-700 mb-4 w-full text-left">
                Оберіть дату та час
              </h3>
              <div className="flex-1 flex items-center justify-center text-slate-400 text-xs italic text-center">
                Оберіть майстра...
              </div>
            </div>
          ) : (
            <DateTimeSelection
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelect={handleDateTimeSelect}
              masterId={selectedMaster.id} // ДОДАЙ ЦЕ
              serviceDuration={selectedService?.duration} // І ДОДАЙ ЦЕ
            />
          )}
        </div>

        {/* ================= КОЛОНКА 4: Додаткові опції ================= */}
        <div
          className={`bg-white/60 backdrop-blur-md rounded-[2.5rem] p-6 border border-white shadow-sm h-[600px] flex-col transition-all duration-500 ${mobileStep === 4 ? "flex animate-in fade-in slide-in-from-right-4" : "hidden lg:flex"} ${!selectedTime ? "lg:opacity-50 lg:pointer-events-none" : "lg:opacity-100"}`}
        >
          <button
            onClick={() => setMobileStep(3)}
            className="lg:hidden flex items-center gap-1 text-slate-400 hover:text-pink-500 mb-4 text-xs font-bold transition-colors w-fit"
          >
            <ChevronLeft className="w-4 h-4" /> Назад до календаря
          </button>
          {!selectedService ||
          !selectedMaster ||
          !selectedDate ||
          !selectedTime ? (
            <h3 className="text-sm font-bold text-slate-700 mb-4">
              Додаткові опції
            </h3>
          ) : (
            <div className="relative h-full">
              <ExtraOptionsSelection
                selectedService={selectedService}
                selectedMaster={selectedMaster}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onConfirm={handleConfirmBooking}
              />
              {isSubmitting && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-[1.5rem] flex items-center justify-center z-10">
                  <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
