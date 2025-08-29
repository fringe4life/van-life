import type { Prisma } from '@prisma/client';

const vans: Omit<Prisma.VanCreateInput, 'userInfo'>[] = [
	{
		name: 'Modest Explorer',
		price: 60,
		description:
			'The Modest Explorer is a van designed to get you out of the house and into nature. This beauty is equipped with solar panels, a composting toilet, a water tank and kitchenette. The idea is that you can pack up your home and escape for a weekend or even longer!',
		imageUrl:
			'https://images.unsplash.com/photo-1516394399858-ae258cf724cc?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNhbXBlcnZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'SIMPLE' as const,
		createdAt: new Date(2018, 11, 16),
	},
	{
		name: 'Beach Bum',
		price: 80,
		description:
			"Beach Bum is a van inspired by surfers and travelers. It was created to be a portable home away from home, but with some cool features in it you won't find in an ordinary camper.",
		imageUrl:
			'https://images.unsplash.com/photo-1647629825421-2f7441004492?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTR8fGNhbXBlcnZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'RUGGED' as const,
		createdAt: new Date(2019, 1, 16),
	},
	{
		name: 'Reliable Red',
		price: 100,
		description:
			"Reliable Red is a van that was made for travelling. The inside is comfortable and cozy, with plenty of space to stretch out in. There's a small kitchen, so you can cook if you need to. You'll feel like home as soon as you step out of it.",
		imageUrl:
			'https://images.unsplash.com/photo-1639156814151-334b5327665b?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjEzfHxjYW1wZXJ2YW58ZW58MHx8MHx8fDI%3D',
		type: 'LUXURY' as const,
		createdAt: new Date(2019, 4, 22),
	},
	{
		name: 'Dreamfinder',
		price: 65,
		description:
			'Dreamfinder is the perfect van to travel in and experience. With a ceiling height of 2.1m, you can stand up in this van and there is great head room. The floor is a beautiful glass-reinforced plastic (GRP) which is easy to clean and very hard wearing. A large rear window and large side windows make it really light inside and keep it well ventilated.',
		imageUrl:
			'https://images.unsplash.com/photo-1515876305430-f06edab8282a?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2FtcGVyJTIwdmFufGVufDB8fDB8fHwy',
		type: 'SIMPLE' as const,
		createdAt: new Date(2017, 4, 4),
	},
	{
		name: 'The Cruiser',
		price: 120,
		description:
			'The Cruiser is a van for those who love to travel in comfort and LUXURY. With its many windows, spacious interior and ample storage space, the Cruiser offers a beautiful view wherever you go.',
		imageUrl:
			'https://images.unsplash.com/photo-1626680114529-3f6ffa002b80?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGNhbXBlciUyMHZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'LUXURY' as const,
		createdAt: new Date(2016, 10, 12),
	},
	{
		name: 'Mountain Wonder',
		price: 75,
		description:
			'With this van, you can take your travel life to the Mountain wonder is perfect for longer trips with its size and clean modern exterior. Rent it today and enjoy the outdoors.',
		imageUrl:
			'https://images.unsplash.com/photo-1549194898-60fd030ecc0f?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'SIMPLE' as const,
		createdAt: new Date(2017, 11, 29),
	},
	{
		name: 'Silver Wonder',
		price: 100,
		description:
			"A silver van gleams with a shiny, pale grey sheen, reflecting light with a metallic luster. Its surface resembles polished silver, exuding a sleek and modern appearance. The color evokes a sense of elegance and sophistication, often associated with professionalism and reliability. The van's design is both functional and aesthetically pleasing, making it a common choice for businesses and individuals alike.",
		imageUrl:
			'https://images.unsplash.com/photo-1597685204565-110abf469a1e?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dmFufGVufDB8fDB8fHwy',
		type: 'LUXURY' as const,
		createdAt: new Date(2019, 2, 2),
	},
	{
		name: 'Yellow Beginner',
		price: 30,
		description:
			'This is the van for you if you want a nostalgic trip down memory lane or are looking for a really cheap van.',
		imageUrl:
			'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmFufGVufDB8fDB8fHwy',
		type: 'RUGGED' as const,
		createdAt: new Date(2019, 5, 26),
	},
	{
		name: 'Grey Wonder',
		price: 70,
		description:
			"With this van, you can take your travel life to the next level. The Grey Wonder is a sustainable vehicle that's perfect for people who are looking for a stylish, eco-friendly mode of transport that can go anywhere.",
		imageUrl:
			'https://images.unsplash.com/photo-1569520884908-682f382556e1?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'LUXURY' as const,
		createdAt: new Date(2019, 3, 20),
	},
	{
		name: 'Shapeshifter Explorer',
		price: 60,
		description:
			'With this van, you can travel with a smaller footprint and simply expand it at your destination for a larger experience. This helps to save money on gas while enabling you to enjoy your vacation. Book today! ',
		imageUrl:
			'https://images.unsplash.com/photo-1572830093421-377d162ca866?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fHZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'SIMPLE' as const,
		createdAt: new Date(2018, 1, 16),
	},
	{
		name: 'Shapeshifter lite',
		price: 50,
		description:
			"With this van, you can take your travel life to a new level. The Shapeshifter lite is a smaller vehicle that's perfect for people who are looking for a cheaper gas bill and a sense of adventure.",
		imageUrl:
			'https://images.unsplash.com/photo-1601231091320-5ee5140fcd09?w=300&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		type: 'SIMPLE' as const,
		createdAt: new Date(2017, 11, 12),
	},
	{
		name: 'Red Wonder',
		price: 30,
		description:
			'The Red Wonder is for travellers from simpler times or people looking for a trip down memory lane who also want a cost effective, stylish van to explore the great outdoors with.',
		imageUrl:
			'https://images.unsplash.com/photo-1597131527856-13cdb8dc050e?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fHZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'RUGGED' as const,
		createdAt: new Date(2015, 1, 12),
	},
	{
		name: 'Tank Van',
		price: 70,
		description:
			'This is an exotic looking van for someone who has been on the road with ordinary vans and wants to try something new or simply is a bit eccentric. Explore the outdoors today with the Tank Van.',
		imageUrl:
			'https://images.unsplash.com/photo-1598013362701-c1a614b6bd04?w=300&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		type: 'LUXURY' as const,
		createdAt: new Date(2016, 11, 23),
	},
	{
		name: 'Luxury Van',
		price: 100,
		description:
			'With this van, there is a built in bed for those looking for a more luxurious Van and yet still want an adventure. With a olive green exterior and a nice natural interior it looks good inside and out!',
		imageUrl:
			'https://images.unsplash.com/photo-1627386172764-1d1b7ea90b66?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njd8fHZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'LUXURY' as const,
		createdAt: new Date(2019, 9, 2),
	},
	{
		name: 'Peach Wonder',
		price: 70,
		description:
			"With this van, you can take your travel life to the next level. The Peach Wonder is a sustainable vehicle that's perfect for people who are looking for a stylish, eco-friendly mode of transport that can go anywhere.",
		imageUrl:
			'https://images.unsplash.com/photo-1731603215747-8793302468f3?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI2fHx2YW58ZW58MHx8MHx8fDI%3D',
		type: 'RUGGED' as const,
		createdAt: new Date(2015, 3, 16),
	},
	{
		name: 'Modern Wonder',
		price: 70,
		description:
			'With this van, you can be sure that the adventure will be center stage as this van has all the modcons to enable you to enjoy the sights and sounds and focus on what matters while on your trip.',
		imageUrl:
			'https://images.unsplash.com/photo-1629793456114-96853e011f5e?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTcyfHx2YW58ZW58MHx8MHx8fDI%3D',
		type: 'LUXURY' as const,
		createdAt: new Date(2016, 8, 29),
	},
	{
		name: 'Maui Wonder',
		price: 100,
		description:
			'This may be one of the most luxurious vans on offer today. It is polished and modern and provides an amazing experience for adventurers who want to do it in a Van that offers modern conveniences on the go.',
		imageUrl:
			'https://images.unsplash.com/photo-1513311068348-19c8fbdc0bb6?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FyYXZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'LUXURY' as const,
		createdAt: new Date(2019, 9, 12),
	},
	{
		name: "Nomad's Haven",
		price: 85,
		description:
			"Perfect for digital nomads and remote workers, the Nomad's Haven features a built-in workspace with ergonomic seating, reliable WiFi, and plenty of power outlets. The interior is designed for productivity while maintaining the freedom of the open road.",
		imageUrl:
			'https://images.unsplash.com/photo-1516394399858-ae258cf724cc?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNhbXBlcnZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'LUXURY' as const,
		createdAt: new Date(2020, 3, 15),
	},
	{
		name: 'Forest Guardian',
		price: 55,
		description:
			'Built for nature enthusiasts, the Forest Guardian comes equipped with all-terrain capabilities, a rooftop tent, and specialized storage for camping gear. Its earthy green exterior blends seamlessly with natural surroundings.',
		imageUrl:
			'https://images.unsplash.com/photo-1605410791216-3d9653a95667?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'RUGGED' as const,
		createdAt: new Date(2019, 7, 8),
	},
	{
		name: 'Urban Escape',
		price: 45,
		type: 'LUXURY' as const,
		description:
			'The Urban Escape is designed for city dwellers who want to break free on weekends. Compact yet comfortable, it features smart storage solutions and a pop-top roof for extra headroom when parked.',
		imageUrl:
			'https://images.unsplash.com/photo-1613750590555-5ad35bd95a99?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		createdAt: new Date(2020, 1, 22),
	},
	{
		name: 'Coastal Cruiser',
		price: 90,
		description:
			'Inspired by beach culture, the Coastal Cruiser features a bright blue exterior, surfboard storage, and an outdoor shower. The interior is designed to handle sandy feet and salty air with easy-clean surfaces.',
		imageUrl:
			'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dmFufGVufDB8fDB8fHwy',
		type: 'LUXURY' as const,
		createdAt: new Date(2018, 6, 10),
	},
	{
		name: 'Desert Wanderer',
		price: 75,
		description:
			'Built for extreme conditions, the Desert Wanderer features enhanced cooling systems, solar panels, and extra water storage. Its tan exterior reflects heat while the interior stays cool and comfortable.',
		imageUrl:
			'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dmFufGVufDB8fDB8fHwy',
		type: 'RUGGED' as const,
		createdAt: new Date(2019, 11, 3),
	},
	{
		name: 'Alpine Adventure',
		price: 110,
		description:
			'Designed for mountain enthusiasts, the Alpine Adventure features four-wheel drive, heated floors, and specialized storage for ski and snowboard equipment. The interior is insulated for cold weather camping.',
		imageUrl:
			'https://images.unsplash.com/photo-1647629825421-2f7441004492?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTR8fGNhbXBlcnZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'LUXURY' as const,
		createdAt: new Date(2020, 8, 14),
	},
	{
		name: 'Retro Rambler',
		price: 40,
		description:
			'A lovingly restored classic van with modern amenities hidden behind its vintage exterior. Features include a retro-inspired interior with contemporary comforts, perfect for those who appreciate both style and functionality.',
		imageUrl:
			'https://images.unsplash.com/photo-1639156814151-334b5327665b?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjEzfHxjYW1wZXJ2YW58ZW58MHx8MHx8fDI%3D',
		type: 'SIMPLE' as const,
		createdAt: new Date(2017, 9, 18),
	},
	{
		name: 'Tech Nomad',
		price: 95,
		description:
			'Built for the modern digital lifestyle, the Tech Nomad features integrated smart home technology, voice-controlled lighting, and a built-in projector for movie nights under the stars. Perfect for tech-savvy travelers.',
		imageUrl:
			'https://images.unsplash.com/photo-1515876305430-f06edab8282a?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2FtcGVyJTIwdmFufGVufDB8fDB8fHwy',
		type: 'LUXURY' as const,
		createdAt: new Date(2021, 2, 28),
	},
	{
		name: 'Family Explorer',
		price: 80,
		description:
			"Spacious and family-friendly, the Family Explorer features bunk beds, a full kitchen, and plenty of storage for everyone's gear. The interior is designed with safety and comfort in mind for family adventures.",
		imageUrl:
			'https://images.unsplash.com/photo-1626680114529-3f6ffa002b80?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGNhbXBlciUyMHZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'SIMPLE' as const,
		createdAt: new Date(2020, 5, 12),
	},
];

const rents = [
	{
		amount: 8000,
		rentedAt: new Date('2024-12-16T00:00:00Z'),
	},
	{
		amount: 4000,
		rentedAt: new Date('2022-06-16T00:00:00Z'),
	},
	{
		amount: 6000,
		rentedAt: new Date('2021-02-16T00:00:00Z'),
	},
	{
		amount: 800,
		rentedAt: new Date('2024-02-19T00:00:00Z'),
	},
	{
		amount: 12000,
		rentedAt: new Date('2020-08-16T00:00:00Z'),
	},
	{
		amount: 7000,
		rentedAt: new Date('2022-01-12T00:00:00Z'),
	},
	{
		amount: 300,
		rentedAt: new Date('2025-04-16T00:00:00Z'),
	},
	{
		amount: 5000,
		rentedAt: new Date('2022-09-02T00:00:00Z'),
	},
	{
		amount: 800,
		rentedAt: new Date('2025-01-09T00:00:00Z'),
	},
	{
		amount: 600,
		rentedAt: new Date('2024-02-12T00:00:00Z'),
	},
	{
		amount: 2000,
		rentedAt: new Date('2019-07-16T00:00:00Z'),
	},
	{
		amount: 1000,
		rentedAt: new Date('2018-01-12T00:00:00Z'),
	},
	{
		amount: 6000,
		rentedAt: new Date('2024-04-04T00:00:00Z'),
	},
	{
		amount: 800,
		rentedAt: new Date('2021-03-21T00:00:00Z'),
	},
	{
		amount: 200,
		rentedAt: new Date('2025-01-12T00:00:00Z'),
	},
	{
		amount: 3500,
		rentedAt: new Date('2023-05-15T00:00:00Z'),
	},
	{
		amount: 4500,
		rentedAt: new Date('2023-08-22T00:00:00Z'),
	},
	{
		amount: 2800,
		rentedAt: new Date('2022-11-08T00:00:00Z'),
	},
	{
		amount: 9200,
		rentedAt: new Date('2024-07-03T00:00:00Z'),
	},
	{
		amount: 1500,
		rentedAt: new Date('2023-12-10T00:00:00Z'),
	},
	{
		amount: 7500,
		rentedAt: new Date('2024-01-25T00:00:00Z'),
	},
	{
		amount: 3200,
		rentedAt: new Date('2022-03-14T00:00:00Z'),
	},
	{
		amount: 1800,
		rentedAt: new Date('2023-09-30T00:00:00Z'),
	},
	{
		amount: 6500,
		rentedAt: new Date('2024-03-08T00:00:00Z'),
	},
	{
		amount: 4200,
		rentedAt: new Date('2023-06-19T00:00:00Z'),
	},
	{
		amount: 1100,
		rentedAt: new Date('2022-12-05T00:00:00Z'),
	},
	{
		amount: 8900,
		rentedAt: new Date('2024-08-12T00:00:00Z'),
	},
	{
		amount: 2400,
		rentedAt: new Date('2023-02-28T00:00:00Z'),
	},
	{
		amount: 5700,
		rentedAt: new Date('2024-05-20T00:00:00Z'),
	},
	{
		amount: 3300,
		rentedAt: new Date('2023-10-15T00:00:00Z'),
	},
	{
		amount: 7800,
		rentedAt: new Date('2024-09-03T00:00:00Z'),
	},
	{
		amount: 1900,
		rentedAt: new Date('2022-07-25T00:00:00Z'),
	},
	{
		amount: 6800,
		rentedAt: new Date('2024-06-14T00:00:00Z'),
	},
	{
		amount: 4100,
		rentedAt: new Date('2023-04-11T00:00:00Z'),
	},
	{
		amount: 2600,
		rentedAt: new Date('2022-09-18T00:00:00Z'),
	},
	{
		amount: 9400,
		rentedAt: new Date('2024-10-07T00:00:00Z'),
	},
	{
		amount: 1400,
		rentedAt: new Date('2023-11-22T00:00:00Z'),
	},
	{
		amount: 7200,
		rentedAt: new Date('2024-11-30T00:00:00Z'),
	},
];

const reviews = [
	{
		rating: 1,
		text: 'The van was not a good experience. It was not roadworthy',
		createdAt: new Date('2024-12-16T00:00:00Z'),
		updatedAt: new Date('2024-12-16T00:00:00Z'),
	},
	{
		rating: 2,
		text: 'The van was not a good experience. It had a terrible smell',
		createdAt: new Date('2019-03-12T00:00:00Z'),
		updatedAt: new Date('2019-03-12T00:00:00Z'),
	},
	{
		rating: 3,
		text: 'The van was an average experience. It had a few minor issues that made driving it less pleasent then it needed to be.',
		createdAt: new Date('2020-03-15T00:00:00Z'),
		updatedAt: new Date('2020-03-15T00:00:00Z'),
	},
	{
		rating: 4,
		text: 'The van was not a good experience. It was almost without flaws!',
		createdAt: new Date('2021-12-05T00:00:00Z'),
		updatedAt: new Date('2021-12-05T00:00:00Z'),
	},
	{
		rating: 5,
		text: 'The van was a great experience. It was genuine luxury and a pleasure to drive',
	},
	{
		rating: 1,
		text: "The van was a terrible experience it went through gas like nobody's business",
		createdAt: new Date('2022-12-04T00:00:00Z'),
		updatedAt: new Date('2022-12-04T00:00:00Z'),
	},
	{
		rating: 2,
		text: 'The van was not a good experience. It had a terrible mattress, sleeping was almost impossible.',
		createdAt: new Date('2025-02-28:00:00Z'),
		updatedAt: new Date('2025-02-28:00:00Z'),
	},
	{
		rating: 3,
		text: 'The van was not really good or bad, just average. ',
		createdAt: new Date('2025-03-21T00:00:00Z'),
		updatedAt: new Date('2025-03-21T00:00:00Z'),
	},
	{
		rating: 4,
		text: 'The van was a pleasure most of the time, but not quite 5 stars due to the occasional squeaky mattress',
		createdAt: new Date('2024-09-17T00:00:00Z'),
		updatedAt: new Date('2024-09-17T00:00:00Z'),
	},
	{
		rating: 5,
		text: 'The van was a flawless experience a real trip down memory lane!',
		createdAt: new Date('2023-03-13T00:00:00Z'),
		updatedAt: new Date('2023-03-13T00:00:00Z'),
	},
	{
		rating: 1,
		text: 'This van barely worked and required a mechanic to fix on multiple occasions. A terrible trip!',
		createdAt: new Date('2023-01-24T00:00:00Z'),
		updatedAt: new Date('2023-01-24T00:00:00Z'),
	},
	{
		rating: 2,
		text: 'This van was not in good condition. I do not recommend.',
		createdAt: new Date('2023-05-29T00:00:00Z'),
		updatedAt: new Date('2023-05-29T00:00:00Z'),
	},
	{
		rating: 3,
		text: 'This van was not in as great a condition as the photos suggested and could clearly use a car wash!',
		createdAt: new Date('2023-06-07T00:00:00Z'),
		updatedAt: new Date('2023-06-07T00:00:00Z'),
	},
	{
		rating: 4,
		text: 'This van was mostly great to use and allowed us to enjoy our trip!',
		createdAt: new Date('2021-07-07T00:00:00Z'),
		updatedAt: new Date('2021-07-07T00:00:00Z'),
	},
	{
		rating: 5,
		text: 'A flawless adventure to the great outdoors, I would highly recommend this van!',
		createdAt: new Date('2022-06-06T00:00:00Z'),
		updatedAt: new Date('2022-06-06T00:00:00Z'),
	},
	{
		rating: 1,
		text: 'This van and the owner were a nightmare to deal with. Please choose a different van!',
		createdAt: new Date('2025-10-10T00:00:00Z'),
		updatedAt: new Date('2025-10-10T00:00:00Z'),
	},
	{
		rating: 2,
		text: 'Our trip did not go as expected due to the need for multiple mechanics to keep this van roadworthy!',
		createdAt: new Date('2024-01-09T00:00:00Z'),
		updatedAt: new Date('2024-01-09T00:00:00Z'),
	},
	{
		rating: 3,
		text: 'You might choose this Van if you have to travel within a fixed/small budget',
		createdAt: new Date('2023-06-01T00:00:00Z'),
		updatedAt: new Date('2023-06-01T00:00:00Z'),
	},
	{
		rating: 4,
		text: 'A van that is easy to recommend but could be better!',
		createdAt: new Date('2025-01-11T00:00:00Z'),
		updatedAt: new Date('2025-01-11T00:00:00Z'),
	},
	{
		rating: 5,
		text: 'The trip we took in this van was an amazing experience and makes recommending this van very easy!',
		createdAt: new Date('2024-11-01T00:00:00Z'),
		updatedAt: new Date('2024-11-01T00:00:00Z'),
	},
	{
		rating: 1,
		text: 'Absolutely terrible experience. The van broke down three times during our trip and the owner was completely unhelpful.',
		createdAt: new Date('2023-08-15T00:00:00Z'),
		updatedAt: new Date('2023-08-15T00:00:00Z'),
	},
	{
		rating: 2,
		text: "The van was dirty and smelled like mold. The air conditioning didn't work properly, making our summer trip miserable.",
		createdAt: new Date('2024-06-22T00:00:00Z'),
		updatedAt: new Date('2024-06-22T00:00:00Z'),
	},
	{
		rating: 3,
		text: 'Decent van for the price, but the interior was smaller than advertised. Good for short trips but not ideal for longer journeys.',
		createdAt: new Date('2023-11-08T00:00:00Z'),
		updatedAt: new Date('2023-11-08T00:00:00Z'),
	},
	{
		rating: 4,
		text: 'Great van with excellent fuel efficiency! The only minor issue was a squeaky door that was easily fixed with some WD-40.',
		createdAt: new Date('2024-03-14T00:00:00Z'),
		updatedAt: new Date('2024-03-14T00:00:00Z'),
	},
	{
		rating: 5,
		text: 'Exceptional van experience! Everything was perfect from the comfortable sleeping arrangements to the well-equipped kitchen.',
		createdAt: new Date('2023-12-20T00:00:00Z'),
		updatedAt: new Date('2023-12-20T00:00:00Z'),
	},
	{
		rating: 1,
		text: 'Worst rental experience ever. The van had electrical issues, the brakes felt unsafe, and the owner refused to provide a refund.',
		createdAt: new Date('2024-07-30T00:00:00Z'),
		updatedAt: new Date('2024-07-30T00:00:00Z'),
	},
	{
		rating: 2,
		text: 'The van was functional but very basic. The mattress was uncomfortable and the heating system was inadequate for cold weather.',
		createdAt: new Date('2023-02-12T00:00:00Z'),
		updatedAt: new Date('2023-02-12T00:00:00Z'),
	},
	{
		rating: 3,
		text: "Average van with some wear and tear. It got us where we needed to go, but don't expect luxury amenities.",
		createdAt: new Date('2024-01-05T00:00:00Z'),
		updatedAt: new Date('2024-01-05T00:00:00Z'),
	},
	{
		rating: 4,
		text: 'Very good van with modern features. The solar panels worked great and the interior was well-designed for comfort.',
		createdAt: new Date('2023-09-18T00:00:00Z'),
		updatedAt: new Date('2023-09-18T00:00:00Z'),
	},
	{
		rating: 5,
		text: 'Outstanding van that exceeded all expectations! The panoramic windows provided incredible views and the amenities were top-notch.',
		createdAt: new Date('2024-04-25T00:00:00Z'),
		updatedAt: new Date('2024-04-25T00:00:00Z'),
	},
	{
		rating: 1,
		text: "Complete disaster. The van wouldn't start on the second day, and we had to cut our trip short. No compensation offered.",
		createdAt: new Date('2023-07-03T00:00:00Z'),
		updatedAt: new Date('2023-07-03T00:00:00Z'),
	},
	{
		rating: 2,
		text: 'The van was outdated and cramped. The bathroom facilities were barely functional and the kitchen setup was impractical.',
		createdAt: new Date('2024-08-11T00:00:00Z'),
		updatedAt: new Date('2024-08-11T00:00:00Z'),
	},
	{
		rating: 3,
		text: 'It was okay for what we paid. The van was clean but showing its age. Good for budget-conscious travelers.',
		createdAt: new Date('2023-10-29T00:00:00Z'),
		updatedAt: new Date('2023-10-29T00:00:00Z'),
	},
	{
		rating: 4,
		text: 'Excellent van with great fuel economy and comfortable sleeping arrangements. Would definitely rent again!',
		createdAt: new Date('2024-02-08T00:00:00Z'),
		updatedAt: new Date('2024-02-08T00:00:00Z'),
	},
	{
		rating: 5,
		text: 'Perfect van for our family vacation! Spacious, well-maintained, and equipped with everything we needed for a comfortable trip.',
		createdAt: new Date('2023-12-03T00:00:00Z'),
		updatedAt: new Date('2023-12-03T00:00:00Z'),
	},
	{
		rating: 1,
		text: 'Terrible experience. The van had multiple mechanical issues and the owner was completely unresponsive to our concerns.',
		createdAt: new Date('2024-05-17T00:00:00Z'),
		updatedAt: new Date('2024-05-17T00:00:00Z'),
	},
	{
		rating: 2,
		text: 'The van was functional but very basic. The interior was smaller than expected and the amenities were minimal.',
		createdAt: new Date('2023-04-06T00:00:00Z'),
		updatedAt: new Date('2023-04-06T00:00:00Z'),
	},
	{
		rating: 3,
		text: 'Decent van for short trips. The bed was comfortable but the kitchen area was cramped and difficult to use.',
		createdAt: new Date('2024-09-28T00:00:00Z'),
		updatedAt: new Date('2024-09-28T00:00:00Z'),
	},
	{
		rating: 4,
		text: 'Great van with excellent features! The solar setup was impressive and the interior design was thoughtful and practical.',
		createdAt: new Date('2023-11-15T00:00:00Z'),
		updatedAt: new Date('2023-11-15T00:00:00Z'),
	},
	{
		rating: 5,
		text: 'Amazing van experience! The luxury amenities made our trip unforgettable. Highly recommend for anyone looking for comfort and style.',
		createdAt: new Date('2024-06-08T00:00:00Z'),
		updatedAt: new Date('2024-06-08T00:00:00Z'),
	},
];

export { reviews, rents, vans };
