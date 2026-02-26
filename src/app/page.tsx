"use client";

import { useSession } from "next-auth/react";
import Loader from "@/components/shared/Loader";
import AuthScreen from "@/components/auth/AuthScreen";
import ClientDashboard from "@/components/dashboard/ClientDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default function Page() {
  const { data: session, status } = useSession();

  // 1. Стан завантаження
  if (status === "loading") return <Loader />;

  // 2. Стан неавторизованого користувача
  if (!session) return <AuthScreen />;

  // 3. Перевірка ролі (припускаємо, що поле role є в сесії)
  // Для тестування можна вручну змінити умову
  const isAdmin = session.user?.email === "твій-email@gmail.com";

  return isAdmin ? (
    <AdminDashboard session={session} />
  ) : (
    <ClientDashboard session={session} />
  );
}
