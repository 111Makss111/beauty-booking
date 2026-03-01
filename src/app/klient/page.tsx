import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import VerificationForm from "@/components/auth/verification-form";
import DashboardOverview from "@/components/klient/dashboard-overview";

const prisma = new PrismaClient();

export default async function KlientPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/");
  }

  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  if (!user.emailVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
        <VerificationForm email={user.email} />
      </div>
    );
  }

  return <DashboardOverview user={user} />;
}
