import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const masters = await prisma.user.findMany({
      where: {
        role: "MASTER",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        image: true,
        // ДОДАНО: Витягуємо дані профілю майстра та його відгуки
        masterProfile: {
          select: {
            rating: true,
            reviewsCount: true,
            appointments: {
              where: {
                review: { isVisible: true }, // Беремо тільки ті, що не приховані адміном
              },
              select: {
                client: {
                  select: { firstName: true, image: true },
                },
                review: {
                  select: {
                    id: true,
                    rating: true,
                    comment: true,
                    createdAt: true,
                  },
                },
              },
              orderBy: { dateTime: "desc" }, // Найновіші відгуки зверху
            },
          },
        },
      },
    });

    // Форматуємо дані так, щоб фронтенду було легко їх читати
    const formattedMasters = masters.map((master) => {
      const rawReviews = master.masterProfile?.appointments || [];

      const reviews = rawReviews
        .filter((app) => app.review) // Залишаємо тільки ті візити, де клієнт реально залишив відгук
        .map((app) => ({
          id: app.review!.id,
          rating: app.review!.rating,
          comment: app.review!.comment,
          createdAt: app.review!.createdAt,
          clientName: app.client.firstName,
          clientImage: app.client.image,
        }));

      return {
        id: master.id,
        firstName: master.firstName,
        lastName: master.lastName,
        image: master.image,
        rating: master.masterProfile?.rating || 0,
        reviewsCount: master.masterProfile?.reviewsCount || 0,
        reviews: reviews, // Тепер цей масив полетить на фронтенд для нашої модалки!
      };
    });

    return NextResponse.json(formattedMasters);
  } catch (error) {
    console.error("Помилка завантаження майстрів:", error);
    return NextResponse.json(
      { error: "Помилка завантаження майстрів" },
      { status: 500 },
    );
  }
}
