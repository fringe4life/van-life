import { prisma } from "~/lib/prisma";

export async function getHostReviews(userId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      userId,
    },
    include: {
      user: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  console.log(reviews);
  return reviews;
}
