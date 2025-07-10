import { prisma } from "~/lib/prisma";

export async function getAccountSummary(userId: string) {
  try {
    const sum = await prisma.rent.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        hostId: userId,
      },
    });
    return sum._sum.amount ?? 0;
  } catch (error) {
    console.error("Failed to get account summary:", error);
    throw new Error("Unable to retrieve account summary");
  }
}
