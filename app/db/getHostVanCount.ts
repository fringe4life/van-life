import { prisma } from "~/lib/prisma";

export async function getHostVanCount(hostId: string) {
  const vanCount = await prisma.van.count({
    where: {
      hostId,
    },
  });
  return vanCount;
}
