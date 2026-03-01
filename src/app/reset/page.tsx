import ResetPassword from "@/components/auth/reset";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Відновлення пароля | Beauty Nails",
  description: "Створення нового пароля для вашого акаунту",
};

export default function ResetPage() {
  return <ResetPassword />;
}
