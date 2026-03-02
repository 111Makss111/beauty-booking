"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import disposableDomains from "disposable-email-domains";
import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

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

    const vCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

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

    try {
      await transporter.sendMail({
        from: `"Beauty Nails" <${process.env.GMAIL_USER}>`,
        to: email,
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

      return { success: true };
    } catch (mailError) {
      // 🚨 ЗАХИСТ ВІД ЗАСТРЯГАННЯ: Якщо лист не відправився, видаляємо користувача з бази!
      console.error("Помилка відправки листа:", mailError);
      await prisma.user.delete({ where: { email } });

      return {
        error: "Не вдалося відправити лист. Перевірте правильність пошти.",
      };
    }
  } catch (error) {
    console.error(error);
    return { error: "Помилка бази даних." };
  }
}

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

export async function sendPasswordResetEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { error: "Користувача з такою електронною поштою не знайдено." };
    }

    if (!user.password) {
      return {
        error:
          "Цей акаунт зареєстровано через Google. Увійдіть за допомогою Google.",
      };
    }

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 3600 * 1000);

    await prisma.passwordResetToken.deleteMany({ where: { email } });

    await prisma.passwordResetToken.create({
      data: { email, token, expires },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset?token=${token}`;

    await transporter.sendMail({
      from: `"Beauty Nails" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "🔒 Відновлення пароля Beauty Nails",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
          <h2 style="color: #ec4899;">Відновлення доступу</h2>
          <p style="color: #334155; font-size: 16px;">Ви отримали цей лист, оскільки надійшов запит на зміну пароля для вашого акаунту.</p>
          <a href="${resetLink}" style="display: inline-block; background-color: #f43f5e; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0;">Скинути пароль</a>
          <p style="color: #94a3b8; font-size: 14px;">Посилання дійсне протягом 1 години. Якщо ви не робили цей запит, проігноруйте лист.</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Помилка при відправці листа для скидання пароля." };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return { error: "Недійсний або використаний токен відновлення." };
    }

    if (new Date() > existingToken.expires) {
      await prisma.passwordResetToken.delete({
        where: { id: existingToken.id },
      });
      return { error: "Термін дії посилання минув. Зробіть новий запит." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: existingToken.email },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({ where: { id: existingToken.id } });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Помилка при оновленні пароля." };
  }
}
