import type { VanType } from "~/generated/prisma/enums";
import { prisma } from "~/lib/prisma";

export async function getVansCount(typeFilter: VanType) {
  if (!typeFilter) {
    return await prisma.van.count();
  }
  return await prisma.van.count({
    where: {
      type: typeFilter,
    },
  });
}
