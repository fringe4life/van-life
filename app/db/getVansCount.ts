import type { VanType } from "@prisma/client";
import { prisma } from "~/lib/prisma";

export async function getVansCount(typeFilter: VanType | null) {
  if (!typeFilter) {
    return await prisma.van.count();
  }
  return await prisma.van.count({
    where: {
      type: typeFilter,
    },
  });
}
