"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import disposableDomains from "disposable-email-domains";
import { Resend } from "resend";

const prisma = new PrismaClient();
// Ініціалізуємо Resend нашим ключем
const resend = new Resend(process.env.RESEND_API_KEY);

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  password: string;
}

export async function registerUser(formData: RegisterFormData) {
  try {
    const { firstName, lastName, email, phone, countryCode, password } =
      formData;

    if (!firstName || !lastName || !email || !phone || !password) {
      return { error: "Всі поля обов'язкові!" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: "Некоректний формат електронної пошти!" };
    }

    const domain = email.split("@")[1].toLowerCase();

    if (disposableDomains.includes(domain)) {
      return { error: "Використання тимчасових пошт заборонено!" };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "Ця пошта вже зайнята!" };

    // Генерація коду
    const vCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створення користувача в базі
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone: `${countryCode}${phone}`,
        countryCode,
        password: hashedPassword,
        role: "CLIENT",
        verificationCode: vCode,
        emailVerified: false,
      },
    });

    // ВІДПРАВКА РЕАЛЬНОГО ЛИСТА
    const { error: resendError } = await resend.emails.send({
      from: "Beauty Nails <onboarding@resend.dev>", // Це спеціальна тестова адреса Resend
      to: email, // Пам'ятай, поки що це має бути твоя пошта з Resend!
      subject: "💅 Код підтвердження Beauty Nails",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
          <h2 style="color: #ec4899;">Вітаємо, ${firstName}!</h2>
          <p style="color: #334155; font-size: 16px;">Ваш код для підтвердження електронної пошти:</p>
          <div style="background-color: #f1f5f9; padding: 16px; border-radius: 12px; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #0f172a; margin: 20px 0;">
            ${vCode}
          </div>
          <p style="color: #94a3b8; font-size: 14px;">Якщо ви не реєструвалися на нашому сайті, просто проігноруйте цей лист.</p>
        </div>
      `,
    });

    if (resendError) {
      console.error("Помилка відправки листа:", resendError);
      return {
        error: "Акаунт створено, але не вдалося відправити лист з кодом.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Помилка бази даних." };
  }
}

// ... функція verifyEmailCode залишається без змін:
export async function verifyEmailCode(email: string, code: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return { error: "Користувача не знайдено." };
    if (user.emailVerified)
      return { success: true, message: "Пошта вже підтверджена." };

    if (user.verificationCode === code) {
      await prisma.user.update({
        where: { email },
        data: {
          emailVerified: true,
          verificationCode: null,
        },
      });
      return { success: true };
    }

    return { error: "Неправильний код підтвердження. Спробуйте ще раз." };
  } catch (error) {
    console.error(error);
    return { error: "Помилка при верифікації коду." };
  }
}
