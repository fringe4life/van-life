import { prisma } from "~/lib/prisma";

export async function getAverageReviewRating(userId: string) {
  const ratingsById = await prisma.review.groupBy({
    where: {
      userId,
    },
    by: ["rating"],
    _count: { _all: true },
  });
  return ratingsById;
}
