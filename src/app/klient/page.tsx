import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import VerificationForm from "@/components/auth/verification-form";
import DashboardOverview from "@/components/klient/dashboard-overview";
// Імпортуємо функцію для отримання статусу Telegram (Правило №32)
import { getTelegramData } from "@/settings/telegram/actions";

export default async function KlientPage() {
  // 1. Перевірка сесії (Правило №25)
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/");
  }

  // 2. Отримання даних користувача та статусу Telegram (Правило №105)
  // Виконуємо запити паралельно для швидкості
  const [user, telegramData] = await Promise.all([
    prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        appointments: {
          include: {
            service: true,
            extraOptions: true,
            master: {
              include: { user: true },
            },
          },
          orderBy: { dateTime: "asc" },
        },
      },
    }),
    getTelegramData(), // <--- Отримуємо дані для TelegramCard
  ]);

  // 3. Валідація користувача та ролі
  if (!user) redirect("/");

  if (user.role === "ADMIN" || user.role === "MASTER") {
    redirect("/admin");
  }

  // 4. Перевірка верифікації (Правило №42)
  if (!user.emailVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
        <VerificationForm email={user.email} />
      </div>
    );
  }

  // 5. Рендеринг основного дашборду
  // Тепер і user, і telegramData визначені та передаються коректно
  return <DashboardOverview user={user} telegramData={telegramData} />;
}
