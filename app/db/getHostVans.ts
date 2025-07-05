import { prisma } from "~/lib/prisma";

export async function getHostVans(id: string, page: number, limit: number) {
  const skip = page === 1 ? 0 : (page - 1) * limit;
  console.log({ skip });
  return await prisma.van.findMany({
    where: {
      hostId: id,
    },
    take: limit,
    skip,
  });
}
