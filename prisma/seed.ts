import { prisma } from "~/lib/prisma";

const vans = [
  {
    name: "Modest Explorer",
    price: 60,
    description:
      "The Modest Explorer is a van designed to get you out of the house and into nature. This beauty is equipped with solar panels, a composting toilet, a water tank and kitchenette. The idea is that you can pack up your home and escape for a weekend or even longer!",
    imageUrl:
      "https://assets.scrimba.com/advanced-react/react-router/modest-explorer.png",
    type: "SIMPLE" as const,
  },
  {
    name: "Beach Bum",
    price: 80,
    description:
      "Beach Bum is a van inspired by surfers and travelers. It was created to be a portable home away from home, but with some cool features in it you won't find in an ordinary camper.",
    imageUrl:
      "https://assets.scrimba.com/advanced-react/react-router/beach-bum.png",
    type: "RUGGED" as const,
  },
  {
    name: "Reliable Red",
    price: 100,
    description:
      "Reliable Red is a van that was made for travelling. The inside is comfortable and cozy, with plenty of space to stretch out in. There's a small kitchen, so you can cook if you need to. You'll feel like home as soon as you step out of it.",
    imageUrl:
      "https://assets.scrimba.com/advanced-react/react-router/reliable-red.png",
    type: "LUXURY" as const,
  },
  {
    name: "Dreamfinder",
    price: 65,
    description:
      "Dreamfinder is the perfect van to travel in and experience. With a ceiling height of 2.1m, you can stand up in this van and there is great head room. The floor is a beautiful glass-reinforced plastic (GRP) which is easy to clean and very hard wearing. A large rear window and large side windows make it really light inside and keep it well ventilated.",
    imageUrl:
      "https://assets.scrimba.com/advanced-react/react-router/dreamfinder.png",
    type: "SIMPLE" as const,
  },
  {
    name: "The Cruiser",
    price: 120,
    description:
      "The Cruiser is a van for those who love to travel in comfort and LUXURY. With its many windows, spacious interior and ample storage space, the Cruiser offers a beautiful view wherever you go.",
    imageUrl:
      "https://assets.scrimba.com/advanced-react/react-router/the-cruiser.png",
    type: "LUXURY" as const,
  },
  {
    name: "Mountain Wonder",
    price: 75,
    description:
      "With this van, you can take your travel life to the Mountain wonder is perfect for longer trips with its size and clean modern exterior. Rent it today and enjoy the outdoors.",
    imageUrl:
      "https://images.unsplash.com/photo-1549194898-60fd030ecc0f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHZhbnxlbnwwfHwwfHx8Mg%3D%3D",
    type: "SIMPLE" as const,
  },
  {
    name: "Silver Wonder",
    price: 100,
    description:
      "A silver van gleams with a shiny, pale grey sheen, reflecting light with a metallic luster. Its surface resembles polished silver, exuding a sleek and modern appearance. The color evokes a sense of elegance and sophistication, often associated with professionalism and reliability. The van's design is both functional and aesthetically pleasing, making it a common choice for businesses and individuals alike.",
    imageUrl:
      "https://images.unsplash.com/photo-1597685204565-110abf469a1e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dmFufGVufDB8fDB8fHwy",
    type: "LUXURY" as const,
  },
  {
    name: "Yellow Beginner",
    price: 30,
    description:
      "This is the van for you if you want a nostalgic trip down memory lane or are looking for a really cheap van.",
    imageUrl:
      "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmFufGVufDB8fDB8fHwy",
    type: "RUGGED" as const,
  },
  {
    name: "Grey Wonder",
    price: 70,
    description:
      "With this van, you can take your travel life to the next level. The Grey Wonder is a sustainable vehicle that's perfect for people who are looking for a stylish, eco-friendly mode of transport that can go anywhere.",
    imageUrl:
      "https://images.unsplash.com/photo-1569520884908-682f382556e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHZhbnxlbnwwfHwwfHx8Mg%3D%3D",
    type: "LUXURY" as const,
  },
  {
    name: "Shapeshifter Explorer",
    price: 60,
    description:
      "With this van, you can travel with a smaller footprint and simply expand it at your destination for a larger experience. This helps to save money on gas while enabling you to enjoy your vacation. Book today! ",
    imageUrl:
      "https://images.unsplash.com/photo-1572830093421-377d162ca866?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fHZhbnxlbnwwfHwwfHx8Mg%3D%3D",
    type: "SIMPLE" as const,
  },
  {
    name: "Shapeshifter lite",
    price: 50,
    description:
      "With this van, you can take your travel life to a new level. The Shapeshifter lite is a smaller vehicle that's perfect for people who are looking for a cheaper gas bill and a sense of adventure.",
    imageUrl:
      "https://images.unsplash.com/photo-1601231091320-5ee5140fcd09?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "SIMPLE" as const,
  },
  {
    name: "Red Wonder",
    price: 30,
    description:
      "The Red Wonder is for travellers from simpler times or people looking for a trip down memory lane who also want a cost effective, stylish van to explore the great outdoors with.",
    imageUrl:
      "https://images.unsplash.com/photo-1597131527856-13cdb8dc050e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fHZhbnxlbnwwfHwwfHx8Mg%3D%3D",
    type: "RUGGED" as const,
  },
  {
    name: "Tank Van",
    price: 70,
    description:
      "This is an exotic looking van for someone who has been on the road with ordinary vans and wants to try something new or simply is a bit eccentric. Explore the outdoors today with the Tank Van.",
    imageUrl:
      "https://images.unsplash.com/photo-1598013362701-c1a614b6bd04?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "LUXURY" as const,
  },
  {
    name: "Luxury Van",
    price: 100,
    description:
      "With this van, there is a built in bed for those looking for a more luxurious Van and yet still want an adventure. With a olive green exterior and a nice natural interior it looks good inside and out!",
    imageUrl:
      "https://images.unsplash.com/photo-1627386172764-1d1b7ea90b66?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njd8fHZhbnxlbnwwfHwwfHx8Mg%3D%3D",
    type: "LUXURY" as const,
  },
  {
    name: "Peach Wonder",
    price: 70,
    description:
      "With this van, you can take your travel life to the next level. The Peach Wonder is a sustainable vehicle that's perfect for people who are looking for a stylish, eco-friendly mode of transport that can go anywhere.",
    imageUrl:
      "https://images.unsplash.com/photo-1731603215747-8793302468f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI2fHx2YW58ZW58MHx8MHx8fDI%3D",
    type: "RUGGED" as const,
  },
  {
    name: "Modern Wonder",
    price: 70,
    description:
      "With this van, you can be sure that the adventure will be center stage as this van has all the modcons to enable you to enjoy the sights and sounds and focus on what matters while on your trip.",
    imageUrl:
      "https://images.unsplash.com/photo-1629793456114-96853e011f5e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTcyfHx2YW58ZW58MHx8MHx8fDI%3D",
    type: "LUXURY" as const,
  },
  {
    name: "Maui Wonder",
    price: 100,
    description:
      "This may be one of the most luxurious vans on offer today. It is polished and modern and provides an amazing experience for adventurers who want to do it in a Van that offers modern conveniences on the go.",
    imageUrl:
      "https://images.unsplash.com/photo-1513311068348-19c8fbdc0bb6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FyYXZhbnxlbnwwfHwwfHx8Mg%3D%3D",
    type: "LUXURY" as const,
  },
];

const rents = [
  {
    amount: 8000,
  },
  {
    amount: 4000,
  },
  {
    amount: 6000,
  },
  {
    amount: 800,
  },
  {
    amount: 12000,
  },
];

const reviews = [
  {
    rating: 1,
    text: "The van was not a good experience. It was not roadworthy",
  },
  {
    rating: 2,
    text: "The van was not a good experience. It had a terrible smell",
  },
  {
    rating: 3,
    text: "The van was an average experience. It had a few minor issues that made driving it less pleasent then it needed to be.",
  },
  {
    rating: 4,
    text: "The van was not a good experience. It was almost without flaws!",
  },
  {
    rating: 5,
    text: "The van was a great experience. It was without flaws!",
  },
];

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
  const rentsWithIds = rents.map((rent) => {
    const { id1, id2 } = generateUniqueIds(userIds);
    return { ...rent, hostId: id1, renterId: id2 };
  });
  await prisma.rent.createMany({
    data: rentsWithIds,
  });

  const rentIds = (await prisma.rent.findMany()).map((rent) => rent.id);

  const reviewsWithIds = reviews.map((review) => ({
    ...review,
    userId: getRandomId(userIds),
    rentId: getRandomId(rentIds),
  }));

  await prisma.review.createMany({
    data: reviewsWithIds,
  });
};

function getRandomId(ids: string[]) {
  if (ids.length === 0) throw new Error("No ids to get");
  return ids[Math.floor(Math.random() * ids.length)];
}

function generateUniqueIds(ids: string[]): { id1: string; id2: string } {
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

main();
