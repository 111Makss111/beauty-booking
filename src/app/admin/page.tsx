// src/app/admin/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth/auth-options"; // Перевір, чи правильний шлях до твого auth-options
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/dashboard-overview";

export default async function AdminPage() {
  // Дістаємо "паспорт" користувача
  const session = await getServerSession(authOptions);

  // 1. Якщо взагалі не авторизований — на головну
  if (!session) {
    redirect("/");
  }

  // 2. Якщо це КЛІЄНТ (намагається схитрувати і ввів /admin) — викидаємо в його кабінет
  if (session.user.role !== "ADMIN") {
    redirect("/klient");
  }

  // 3. Якщо перевірки пройдені — показуємо адмінку
  return <AdminDashboard />;
}
