import { prisma } from "~/lib/prisma";

export async function getHostReviews(userId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      userId,
    },
  });

  console.log(reviews);
  return reviews;
}
