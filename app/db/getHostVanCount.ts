import { prisma } from "~/lib/prisma";

export async function getHostVanCount(hostId: string) {
  return await prisma.van.count({
    where: {
      hostId,
    },
  });
}
