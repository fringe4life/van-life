import { prisma } from "~/lib/prisma";
import { reviews, rents, vans } from "./seedInfo";

const main = async () => {
  // clear tables
  try {
    await prisma.review.deleteMany();
    await prisma.rent.deleteMany();
    await prisma.van.deleteMany();
  } catch (error) {
    console.error(error);
  }

  const data = await prisma.user.findMany();
  const userIds = data.map((user) => user.id);
  const lengthOfUserIds = userIds.length;

  const vansWithHosts = vans.map((van) => ({
    ...van,
    hostId: userIds[Math.floor(Math.random() * lengthOfUserIds)],
  }));

  await prisma.van.createMany({
    data: vansWithHosts,
  });

  const vanIds = await prisma.van.findMany();

  const rentsWithIds = rents.map((rent) => {
    const { id1, id2 } = generateUniqueIds(data);
    const vanId = getRandomId(vanIds);
    const van = vanIds.find((van) => van.id === van.id)!;
    const rentedTo = randomTrueOrFalse() ? getEndDate(rent.rentedAt) : null;
    const amount = rentedTo ? getCost(rent.rentedAt, rentedTo, van.price) : 0;
    return {
      ...rent,
      hostId: id1,
      renterId: id2,
      vanId,
      rentedTo,
      amount,
    };
  });
  await prisma.rent.createMany({
    data: rentsWithIds,
  });

  const rentIds = await prisma.rent.findMany({
    where: {
      NOT: {
        rentedTo: null,
      },
    },
  });

  const reviewsWithIds = reviews.map((review) => ({
    ...review,
    userId: getRandomId(data),
    rentId: getRandomId(rentIds),
  }));

  await prisma.review.createMany({
    data: reviewsWithIds,
  });

  await prisma.$disconnect();
};

function getRandomId<T extends { id: string }>(ids: T[]) {
  if (ids.length === 0) throw new Error("No ids to get");
  return ids[Math.floor(Math.random() * ids.length)].id;
}

function generateUniqueIds<T extends { id: string }>(
  ids: T[]
): { id1: string; id2: string } {
  if (ids.length < 2) {
    throw new Error("length of ids is too short for this function");
  }
  const id1 = getRandomId(ids);
  let id2 = getRandomId(ids);

  while (id1 === id2) {
    id2 = getRandomId(ids);
  }
  return { id1, id2 };
}

function getEndDate(rentedAt: Date) {
  return new Date(
    rentedAt.getFullYear(),
    rentedAt.getMonth(),
    rentedAt.getDate() + getRandomNumber(),
    rentedAt.getHours()
  );
}

function randomTrueOrFalse() {
  return getRandomNumber(0, 1) > 0.5;
}

function getRandomNumber(min = 3, max = 21) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCost(rentedAt: Date, rentedTo: Date, price: number) {
  const daysDifferent = Math.ceil((rentedTo - rentedAt) / (1000 * 3600 * 24));
  return price * daysDifferent;
}

main();
