"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth-options";
import { revalidatePath } from "next/cache";

// 1. Отримати всі відгуки для адмінки
export async function getAdminReviews() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "ADMIN") {
    return { success: false, error: "Немає прав" };
  }

  try {
    const reviews = await prisma.review.findMany({
      include: {
        appointment: {
          include: {
            client: {
              select: { firstName: true, lastName: true, image: true },
            },
            master: {
              include: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
            service: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: reviews };
  } catch (error) {
    console.error("Помилка завантаження відгуків:", error);
    return { success: false, error: "Помилка завантаження" };
  }
}

// 2. Приховати / Показати відгук на сайті
export async function toggleReviewVisibility(
  reviewId: string,
  isVisible: boolean,
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "ADMIN")
    return { success: false, error: "Немає прав" };

  try {
    await prisma.review.update({
      where: { id: reviewId },
      data: { isVisible },
    });
    revalidatePath("/"); // Оновлюємо кеш сайту
    return { success: true };
  } catch (error) {
    return { success: false, error: "Помилка оновлення" };
  }
}

// 3. Видалити відгук назавжди (із перерахунком рейтингу майстра)
export async function deleteReview(reviewId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "ADMIN")
    return { success: false, error: "Немає прав" };

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { appointment: true },
    });

    if (!review) return { success: false, error: "Відгук не знайдено" };

    // Видаляємо відгук
    await prisma.review.delete({ where: { id: reviewId } });

    // Оновлюємо рейтинг майстра
    const allReviews = await prisma.review.findMany({
      where: { appointment: { masterId: review.appointment.masterId } },
    });

    const avgRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, rev) => sum + rev.rating, 0) /
          allReviews.length
        : 0;

    await prisma.masterProfile.update({
      where: { id: review.appointment.masterId },
      data: {
        rating: Number(avgRating.toFixed(1)),
        reviewsCount: allReviews.length,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Помилка видалення" };
  }
}
