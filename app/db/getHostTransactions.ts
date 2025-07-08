import { prisma } from "~/lib/prisma";

export async function getHostTransactions(userId: string) {
  const rents = await prisma.rent.findMany({
    where: {
      hostId: userId,
    },
    select: {
      amount: true,
      rentedAt: true,
    },
  });
  console.log(rents);

  return rents;
}
