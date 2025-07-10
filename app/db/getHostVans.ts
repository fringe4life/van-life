import getSkipAmount from "~/utils/getSkipAmount";
import { prisma } from "~/lib/prisma";

export async function getHostVans(id: string, page: number, limit: number) {
  const skip = getSkipAmount(page, limit);
  return await prisma.van.findMany({
    where: {
      hostId: id,
    },
    take: limit,
    skip,
  });
}
