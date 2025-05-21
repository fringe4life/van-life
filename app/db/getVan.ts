import { prisma } from "../lib/prisma";

export function getVan(id: string) {
  return prisma.van.findUniqueOrThrow({
    where: {
      id,
    },
  });
}
