import { signOut } from "next-auth/react";
import Image from "next/image";
import type { Session } from "next-auth";
import {
  LogOut,
  LayoutDashboard,
  CalendarDays,
  Users,
  Scissors,
  Settings,
  Search,
  Bell,
  Star,
  UserPlus,
  DollarSign,
  Check,
  X,
} from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  val: string;
  sub?: string;
}

interface AppointmentRowProps {
  time: string;
  service: string;
  name: string;
  status: "Confirmed" | "Pending";
}

interface ArtistCardProps {
  name: string;
  rate: string;
  rating: string;
}

interface RequestCardProps {
  name: string;
  time: string;
}

function StatCard({ icon, label, val, sub }: StatCardProps) {
  return (
    <div className="bg-white/60 backdrop-blur-md p-6 rounded-[35px] border border-white shadow-sm transition-transform hover:scale-105">
      <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
        {label}
      </p>
      <p className="text-xl font-black text-slate-700">
        {val}
        {sub && (
          <span className="text-xs font-normal text-slate-400">{sub}</span>
        )}
      </p>
    </div>
  );
}

function AppointmentRow({ time, service, name, status }: AppointmentRowProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/40 rounded-3xl border border-white/50 hover:bg-white/60 transition-all cursor-default">
      <div className="flex gap-4 items-center">
        <span className="text-xs font-bold text-slate-400 w-16">{time}</span>
        <div className="w-2 h-2 bg-rose-300 rounded-full" />
        <div>
          <p className="text-sm font-bold text-slate-700">{service}</p>
          <p className="text-[10px] text-slate-500">{name}</p>
        </div>
      </div>
      <span
        className={`text-[10px] px-3 py-1 rounded-full font-bold ${
          status === "Confirmed"
            ? "bg-green-100 text-green-600"
            : "bg-amber-100 text-amber-600"
        }`}
      >
        ● {status}
      </span>
    </div>
  );
}

function ArtistCard({ name, rate, rating }: ArtistCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/40 rounded-3xl border border-white/50">
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 bg-rose-200 rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center text-rose-500 font-bold text-xs">
            {name[0]}
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-700">{name}</p>
          <p className="text-[10px] text-slate-400 font-medium">{rate}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
        <Star size={12} className="text-amber-400" fill="currentColor" />{" "}
        {rating}
      </div>
    </div>
  );
}

function RequestCard({ name, time }: RequestCardProps) {
  return (
    <div className="p-4 bg-white/40 rounded-3xl border border-white/50">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-400 font-bold">
            {name[0]}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700">{name}</p>
            <p className="text-[10px] text-slate-400">{time}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 bg-green-500 text-white py-2.5 rounded-xl text-[10px] font-bold shadow-md shadow-green-100 flex items-center justify-center gap-1 active:scale-95 transition-all">
          <Check size={12} /> Confirm
        </button>
        <button className="flex-1 bg-rose-100 text-rose-500 py-2.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all">
          <X size={12} /> Decline
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard({ session }: { session: Session }) {
  const adminName = "Anastasia";

  return (
    <div className="flex h-screen bg-[#FFF0F3] overflow-hidden font-sans text-slate-800 animate-in fade-in duration-500">
      <aside className="hidden lg:flex flex-col w-[260px] bg-white/40 backdrop-blur-xl border-r border-white/60 p-6 justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10 pl-2">
            <div className="bg-rose-500 text-white p-2 rounded-xl shadow-lg shadow-rose-200">
              <Scissors size={20} />
            </div>
            <h1 className="text-2xl font-serif italic text-rose-500 font-bold uppercase tracking-tighter">
              Beauty Nails
            </h1>
          </div>

          <div className="text-center mb-10 bg-white/30 py-6 px-4 rounded-[35px] border border-white/50 shadow-sm">
            <div className="relative w-20 h-20 mx-auto mb-3">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Admin"
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 text-2xl font-bold">
                  A
                </div>
              )}
            </div>
            <p className="text-[10px] text-rose-400 font-black uppercase tracking-widest mb-1">
              Hi,
            </p>
            <p className="font-black text-slate-700 text-lg tracking-tight">
              {adminName}!
            </p>
          </div>

          <nav className="space-y-1">
            {[
              {
                name: "Dashboard",
                icon: <LayoutDashboard size={18} />,
                active: true,
              },
              { name: "Appointments", icon: <CalendarDays size={18} /> },
              { name: "Client Management", icon: <Users size={18} /> },
              { name: "Services", icon: <Scissors size={18} /> },
              { name: "Settings", icon: <Settings size={18} /> },
            ].map((item) => (
              <button
                key={item.name}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${
                  item.active
                    ? "bg-white text-rose-500 shadow-sm border border-white font-bold"
                    : "text-slate-500 hover:bg-white/50 hover:text-rose-400"
                }`}
              >
                {item.icon} <span className="text-sm">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 p-4 text-slate-400 hover:text-rose-500 transition-all font-bold"
        >
          <LogOut size={18} /> <span className="text-sm">Log Out</span>
        </button>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-white/20">
        <header className="flex justify-between items-center p-6 lg:px-10">
          <div className="relative w-96 hidden md:block">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-white/50 border-white border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <div className="w-10 h-10 bg-white/50 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-white cursor-pointer hover:text-rose-400 transition-colors">
              <Bell size={18} />
            </div>
            <div className="w-10 h-10 bg-white/50 rounded-2xl flex items-center justify-center font-bold text-slate-600 shadow-sm border border-white cursor-pointer">
              UA
            </div>
          </div>
        </header>

        <div className="px-6 lg:px-10 pb-10 space-y-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            Dashboard
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<CalendarDays className="text-rose-400" />}
              label="Today's Appointments"
              val="15"
            />
            <StatCard
              icon={<UserPlus className="text-rose-400" />}
              label="New Clients this Month"
              val="28"
            />
            <StatCard
              icon={<DollarSign className="text-rose-400" />}
              label="Total Earnings"
              val="$12,580"
            />
            <StatCard
              icon={<Star className="text-amber-400" />}
              label="Average Rating"
              val="4.9"
              sub=" (252)"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <section className="bg-white/60 backdrop-blur-xl rounded-[45px] p-8 border border-white shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-black text-xl text-slate-700">
                    Today Appointments
                  </h3>
                  <button className="bg-rose-400 hover:bg-rose-500 text-white text-xs font-black px-6 py-3 rounded-2xl shadow-lg shadow-rose-100 transition-all active:scale-95">
                    + Add Appointment
                  </button>
                </div>
                <div className="space-y-4">
                  <AppointmentRow
                    time="10:00 AM"
                    service="Gel Manicure"
                    name="Anna"
                    status="Confirmed"
                  />
                  <AppointmentRow
                    time="11:30 AM"
                    service="Nail Art"
                    name="Maria"
                    status="Pending"
                  />
                  <AppointmentRow
                    time="01:00 PM"
                    service="Pedicure"
                    name="Olga"
                    status="Confirmed"
                  />
                </div>
              </section>

              <section className="bg-white/60 backdrop-blur-xl rounded-[45px] p-8 border border-white shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-black text-xl text-slate-700">
                    Nail Artists
                  </h3>
                  <button className="text-rose-400 text-xs font-bold hover:underline">
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ArtistCard
                    name="Anastasia"
                    rate="£330 / hour"
                    rating="4.9"
                  />
                  <ArtistCard name="Miya" rate="£330 / hour" rating="4.8" />
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className="bg-white/60 backdrop-blur-xl rounded-[45px] p-8 border border-white shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-lg text-slate-700">
                    Revenue Overview
                  </h3>
                  <select className="bg-transparent text-[10px] font-bold text-slate-400 outline-none">
                    <option>Jan - Apr</option>
                  </select>
                </div>
                <div className="w-full h-40 bg-rose-50/30 rounded-[30px] flex items-end p-4 gap-3 border border-white/50">
                  {[40, 70, 45, 90, 65, 80].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="flex-1 bg-gradient-to-t from-rose-400 to-rose-300 rounded-xl transition-all hover:brightness-110"
                    />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-6">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400">Week</p>
                    <p className="text-sm font-black text-slate-700">$4,150</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400">
                      Today
                    </p>
                    <p className="text-sm font-black text-slate-700">$620</p>
                  </div>
                  <div className="text-center bg-rose-500 rounded-2xl py-2 shadow-lg shadow-rose-100">
                    <p className="text-[10px] font-bold text-white/80 text-center">
                      Total
                    </p>
                    <p className="text-sm font-black text-white text-center">
                      Today
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-white/60 backdrop-blur-xl rounded-[45px] p-8 border border-white shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-black text-lg text-slate-700">
                    Recent Client Requests
                  </h3>
                  <button className="text-slate-300">
                    <Settings size={14} />
                  </button>
                </div>
                <div className="space-y-4">
                  <RequestCard name="Natalia" time="Nov 25 at 12:00 PM" />
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
