import { prisma } from "~/lib/prisma";

export async function getHostVans(id: string) {
  return await prisma.van.findMany({
    where: {
      hostId: id,
    },
  });
}
