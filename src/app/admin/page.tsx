import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import AdminDashboard from "@/components/admin/dashboard-overview";

export default async function AdminPage() {
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

  if (user.role !== "ADMIN" && user.role !== "MASTER") {
    redirect("/klient");
  }

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    image: user.image,
    hasPassword: Boolean(user.password),
  };

  return <AdminDashboard user={safeUser} />;
}
