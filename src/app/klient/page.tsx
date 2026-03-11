import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import VerificationForm from "@/components/auth/verification-form";
import DashboardOverview from "@/components/klient/dashboard-overview";

export default async function KlientPage() {
  // 1. Перевірка сесії (Правило №25)
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/");
  }

  // 2. Отримання даних користувача (Правило №105)
  // Ми дістаємо і записи, і тумблери сповіщень в одному запиті до БД
  const user = await prisma.user.findUnique({
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
  });

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
  // У DashboardOverview тепер можна передати налаштування сповіщень з об'єкта user
  return <DashboardOverview user={user} />;
}
