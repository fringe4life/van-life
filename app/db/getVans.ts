import type { VanType } from "~/generated/prisma/enums";
import getSkipAmount from "~/lib/getSkipAmount";
import { prisma } from "~/lib/prisma";

export async function getVans(
  page: number = 1,
  limit: number = 10,
  typeFilter: VanType | undefined
) {
  const skip = getSkipAmount(page, limit);

  if (!typeFilter) {
    return await prisma.van.findMany({
      take: limit,
      skip,
    });
  }
  return await prisma.van.findMany({
    take: limit,
    skip,
    where: {
      type: typeFilter,
    },
  });
}
