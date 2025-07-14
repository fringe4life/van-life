import { prisma } from "~/lib/prisma";

export async function getHostTransactions(userId: string) {
  return await prisma.rent.findMany({
    where: {
      hostId: userId,
    },
    select: {
      amount: true,
      rentedAt: true,
      id: true,
    },
  });
}
