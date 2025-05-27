import { prisma } from "~/lib/prisma";

export async function getVans() {
  return await prisma.van.findMany();
}
