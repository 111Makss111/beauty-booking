"use client";

import { useSession } from "next-auth/react";
import Loader from "@/components/shared/Loader";
import AuthScreen from "@/components/auth/AuthScreen";
import ClientDashboard from "@/components/dashboard/ClientDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loader />;
  if (!session) return <AuthScreen />;

  // Перевірка в консолі (натисни F12 в браузері, щоб побачити)
  console.log("Пошта сесії:", session.user?.email);
  console.log("Пошта з ENV:", process.env.NEXT_PUBLIC_ADMIN_EMAIL);

  const isAdmin = session.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return isAdmin ? (
    <AdminDashboard session={session} />
  ) : (
    <ClientDashboard session={session} />
  );
}
