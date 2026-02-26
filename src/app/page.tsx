"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF0F3]">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FFF0F3] p-4">
        <div className="w-full max-w-sm bg-white/70 backdrop-blur-xl p-10 rounded-[45px] shadow-xl border border-white/40 flex flex-col items-center min-h-[550px]">
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-slate-500 font-medium mb-1">Welcome to</p>
            <h1 className="text-5xl font-serif italic text-[#D85C7B] mb-4">
              Beauty Nails
            </h1>
            <div className="w-24 h-1 bg-[#D85C7B]/20 rounded-full"></div>
          </div>

          <div className="w-full space-y-4">
            <button
              onClick={() => signIn("google")}
              className="w-full bg-[#D85C7B] text-white font-semibold py-4 rounded-2xl shadow-lg hover:bg-[#c44d6b] transition-all active:scale-95"
            >
              Log In
            </button>
            <button className="w-full bg-white text-[#D85C7B] font-semibold py-4 rounded-2xl border border-[#D85C7B]/20 shadow-sm">
              Sign Up
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF0F3] pb-10">
      <header className="p-6 flex items-center gap-4">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="Profile"
            width={50}
            height={50}
            className="rounded-full border-2 border-white shadow-md"
          />
        )}
        <h2 className="text-xl font-bold text-slate-800">
          Hi, {session.user?.name?.split(" ")[0]}!
        </h2>
      </header>

      <div className="px-6 space-y-6">
        <section className="bg-white/80 backdrop-blur-md rounded-[30px] p-6 shadow-sm border border-white/50">
          <h3 className="text-slate-800 font-bold mb-4">Upcoming Visit</h3>
          <div className="flex gap-4 items-center">
            <div className="bg-rose-100 p-3 rounded-2xl text-[#D85C7B]">💅</div>
            <div className="flex-1">
              <p className="font-bold text-slate-800 text-sm">
                Nail Art Design
              </p>
              <p className="text-xs text-slate-500">
                Tuesday, Nov 19 | 3:00 PM
              </p>
              <p className="text-xs text-slate-400 mt-1">Artist: Anastasia</p>
            </div>
            <button className="bg-[#D85C7B] text-white text-[10px] px-3 py-2 rounded-xl font-bold">
              Reschedule
            </button>
          </div>
        </section>

        <section className="bg-white/80 backdrop-blur-md rounded-[30px] p-6 shadow-sm border border-white/50">
          <h3 className="text-slate-800 font-bold mb-4">Book Appointment</h3>
          <div className="space-y-3">
            {["Select Service", "Choose Date & Time", "Pick a Nail Artist"].map(
              (item) => (
                <div
                  key={item}
                  className="flex justify-between items-center p-3 border-b border-rose-50 cursor-pointer"
                >
                  <span className="text-sm text-slate-600 font-medium">
                    {item}
                  </span>
                  <span className="text-slate-400">›</span>
                </div>
              ),
            )}
            <button className="w-full bg-[#D85C7B] text-white font-bold py-3 mt-2 rounded-2xl shadow-md">
              Book Now
            </button>
          </div>
        </section>

        <section className="bg-white/80 backdrop-blur-md rounded-[30px] p-6 shadow-sm border border-white/50">
          <h3 className="text-slate-800 font-bold mb-4">My Appointments</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-slate-800">Gel Manicure</p>
                <p className="text-[10px] text-slate-400">
                  Nov 26, 2021 | 11:00 AM
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-600 text-[10px] px-3 py-1 rounded-full font-bold">
                Confirmed
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
