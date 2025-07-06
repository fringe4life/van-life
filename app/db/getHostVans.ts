import getSkipAmount from "~/lib/getSkipAmount";
import { prisma } from "~/lib/prisma";

export async function getHostVans(id: string, page: number, limit: number) {
  const skip = getSkipAmount(page, limit);
  console.log({ skip });
  return await prisma.van.findMany({
    where: {
      hostId: id,
    },
    take: limit,
    skip,
  });
}
