"use client";

import { useState, useEffect } from "react";
// Залишив тільки ті іконки, які реально використовуються
import { Filter, ArrowLeft } from "lucide-react";

import AdminAppointmentsSidebar, {
  SidebarMaster,
} from "./admin-appointments-sidebar";
import AdminTimelineView from "./admin-timeline-view";
import AdminAppointmentDetails from "./admin-appointment-details";

type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

interface Appointment {
  id: string;
  dateTime: string;
  status: AppointmentStatus;
  totalPrice: number;
  service: { name: string; duration: number };
  client: {
    id: string; // Додав id клієнта, бо він потрібен в деталях
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
  notes?: string | null; // Додав notes для панелі деталей
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMasters, setSelectedMasters] = useState<string[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);

  const [mobileView, setMobileView] = useState<
    "sidebar" | "timeline" | "details"
  >("timeline");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("/api/admin/appointments", {
          cache: "no-store",
        });
        if (res.ok) {
          // Строга типізація тут замінює потребу в (app: any)
          const data: Appointment[] = await res.json();
          setAppointments(data);

          const uniqueMasterIds = Array.from(
            new Set(data.map((app) => app.master.user.id)),
          );
          setSelectedMasters(uniqueMasterIds);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const uniqueMasters: SidebarMaster[] = Array.from(
    new Map(
      appointments.map((app) => [app.master.user.id, app.master.user]),
    ).values(),
  );

  const toggleMaster = (masterId: string) => {
    setSelectedMasters((prev) =>
      prev.includes(masterId)
        ? prev.filter((id) => id !== masterId)
        : [...prev, masterId],
    );
  };

  const handleAppointmentSelect = (id: string | null) => {
    setSelectedAppointmentId(id);
    if (id) {
      setMobileView("details");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#fdf8fa]">
      <div className="lg:hidden flex items-center gap-2 mb-4">
        {mobileView !== "timeline" && (
          <button
            onClick={() => {
              setMobileView("timeline");
              setSelectedAppointmentId(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm font-bold text-slate-600 shadow-sm border border-pink-50"
          >
            <ArrowLeft className="w-4 h-4" /> Назад
          </button>
        )}
        {mobileView === "timeline" && (
          <button
            onClick={() => setMobileView("sidebar")}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm font-bold text-pink-600 shadow-sm border border-pink-50 flex-1 justify-center"
          >
            <Filter className="w-4 h-4" /> Календар та Майстри
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden min-h-[600px]">
        <div
          className={`${mobileView === "sidebar" ? "flex" : "hidden"} lg:flex w-full lg:w-[280px] shrink-0 flex-col h-full`}
        >
          <AdminAppointmentsSidebar
            selectedDate={selectedDate}
            onDateSelect={(date) => {
              setSelectedDate(date);
              setMobileView("timeline");
            }}
            masters={uniqueMasters}
            selectedMasters={selectedMasters}
            onMasterToggle={toggleMaster}
          />
        </div>

        <div
          className={`${mobileView === "timeline" ? "flex" : "hidden"} lg:flex flex-1 bg-white rounded-[2rem] shadow-sm border border-pink-50 flex-col overflow-hidden`}
        >
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100">
            <h3 className="text-base md:text-lg font-bold text-slate-800 capitalize truncate">
              {selectedDate.toLocaleDateString("uk-UA", {
                weekday: "short",
                day: "numeric",
                month: "long",
              })}
            </h3>
          </div>

          <AdminTimelineView
            appointments={appointments}
            selectedDate={selectedDate}
            selectedMasters={selectedMasters}
            selectedAppointmentId={selectedAppointmentId}
            onSelectAppointment={handleAppointmentSelect}
          />
        </div>

        <div
          className={`${mobileView === "details" ? "flex" : "hidden"} lg:flex w-full lg:w-[320px] bg-white rounded-[2rem] shadow-sm border border-pink-50 shrink-0 flex-col overflow-y-auto custom-scrollbar p-6`}
        >
          <AdminAppointmentDetails
            appointment={appointments.find(
              (app) => app.id === selectedAppointmentId,
            )}
            onClose={() => setMobileView("timeline")}
          />
        </div>
      </div>
    </div>
  );
}
