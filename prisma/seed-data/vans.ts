import type { VanType } from '~/generated/prisma/enums';
import type { VanCreateInput } from '~/generated/prisma/models/Van';
import { getRecentDate } from '../seed-fns';

export const vans: Omit<VanCreateInput, 'userInfo' | 'slug'>[] = [
	{
		name: 'Modest Explorer',
		price: 60,
		description:
			'The Modest Explorer is a van designed to get you out of the house and into nature. This beauty is equipped with solar panels, a composting toilet, a water tank and kitchenette. The idea is that you can pack up your home and escape for a weekend or even longer!',
		imageUrl:
			'https://images.unsplash.com/photo-1516394399858-ae258cf724cc?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNhbXBlcnZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'SIMPLE' as VanType,
		createdAt: getRecentDate(2),
	},
	{
		name: 'Beach Bum',
		price: 80,
		description:
			"Beach Bum is a van inspired by surfers and travelers. It was created to be a portable home away from home, but with some cool features in it you won't find in an ordinary camper.",
		imageUrl:
			'https://images.unsplash.com/photo-1647629825421-2f7441004492?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTR8fGNhbXBlcnZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'RUGGED' as VanType,
		createdAt: getRecentDate(2),
	},
	{
		name: 'Reliable Red',
		price: 100,
		description:
			"Reliable Red is a van that was made for travelling. The inside is comfortable and cozy, with plenty of space to stretch out in. There's a small kitchen, so you can cook if you need to. You'll feel like home as soon as you step out of it.",
		imageUrl:
			'https://images.unsplash.com/photo-1639156814151-334b5327665b?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjEzfHxjYW1wZXJ2YW58ZW58MHx8MHx8fDI%3D',
		type: 'LUXURY' as VanType,
		createdAt: getRecentDate(2),
	},
	{
		name: 'Dreamfinder',
		price: 65,
		description:
			'Dreamfinder is the perfect van to travel in and experience. With a ceiling height of 2.1m, you can stand up in this van and there is great head room. The floor is a beautiful glass-reinforced plastic (GRP) which is easy to clean and very hard wearing. A large rear window and large side windows make it really light inside and keep it well ventilated.',
		imageUrl:
			'https://images.unsplash.com/photo-1515876305430-f06edab8282a?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2FtcGVyJTIwdmFufGVufDB8fDB8fHwy',
		type: 'SIMPLE' as VanType,
		createdAt: new Date(2017, 4, 4),
	},
	{
		name: 'The Cruiser',
		price: 120,
		description:
			'The Cruiser is a van for those who love to travel in comfort and LUXURY. With its many windows, spacious interior and ample storage space, the Cruiser offers a beautiful view wherever you go.',
		imageUrl:
			'https://images.unsplash.com/photo-1626680114529-3f6ffa002b80?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGNhbXBlciUyMHZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'LUXURY' as VanType,
		createdAt: new Date(2016, 10, 12),
	},
	{
		name: 'Mountain Wonder',
		price: 75,
		description:
			'With this van, you can take your travel life to the Mountain wonder is perfect for longer trips with its size and clean modern exterior. Rent it today and enjoy the outdoors.',
		imageUrl:
			'https://images.unsplash.com/photo-1549194898-60fd030ecc0f?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'SIMPLE' as VanType,
		createdAt: new Date(2017, 11, 29),
	},
	{
		name: 'Silver Wonder',
		price: 100,
		description:
			"A silver van gleams with a shiny, pale grey sheen, reflecting light with a metallic luster. Its surface resembles polished silver, exuding a sleek and modern appearance. The color evokes a sense of elegance and sophistication, often associated with professionalism and reliability. The van's design is both functional and aesthetically pleasing, making it a common choice for businesses and individuals alike.",
		imageUrl:
			'https://images.unsplash.com/photo-1597685204565-110abf469a1e?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dmFufGVufDB8fDB8fHwy',
		type: 'LUXURY' as VanType,
		createdAt: new Date(2019, 2, 2),
	},
	{
		name: 'Yellow Beginner',
		price: 30,
		description:
			'This is the van for you if you want a nostalgic trip down memory lane or are looking for a really cheap van.',
		imageUrl:
			'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmFufGVufDB8fDB8fHwy',
		type: 'RUGGED' as VanType,
		createdAt: new Date(2019, 5, 26),
	},
	{
		name: 'Grey Wonder',
		price: 70,
		description:
			"With this van, you can take your travel life to the next level. The Grey Wonder is a sustainable vehicle that's perfect for people who are looking for a stylish, eco-friendly mode of transport that can go anywhere.",
		imageUrl:
			'https://images.unsplash.com/photo-1569520884908-682f382556e1?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'LUXURY' as VanType,
		createdAt: new Date(2019, 3, 20),
	},
	{
		name: 'Shapeshifter Explorer',
		price: 60,
		description:
			'With this van, you can travel with a smaller footprint and simply expand it at your destination for a larger experience. This helps to save money on gas while enabling you to enjoy your vacation. Book today! ',
		imageUrl:
			'https://images.unsplash.com/photo-1572830093421-377d162ca866?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fHZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'SIMPLE' as VanType,
		createdAt: new Date(2018, 1, 16),
	},
	{
		name: 'Shapeshifter lite',
		price: 50,
		description:
			"With this van, you can take your travel life to a new level. The Shapeshifter lite is a smaller vehicle that's perfect for people who are looking for a cheaper gas bill and a sense of adventure.",
		imageUrl:
			'https://images.unsplash.com/photo-1601231091320-5ee5140fcd09?w=300&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		type: 'SIMPLE' as VanType,
		createdAt: new Date(2017, 11, 12),
	},
	{
		name: 'Red Wonder',
		price: 30,
		description:
			'The Red Wonder is for travellers from simpler times or people looking for a trip down memory lane who also want a cost effective, stylish van to explore the great outdoors with.',
		imageUrl:
			'https://images.unsplash.com/photo-1597131527856-13cdb8dc050e?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fHZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'RUGGED' as VanType,
		createdAt: new Date(2015, 1, 12),
	},
	{
		name: 'Tank Van',
		price: 70,
		description:
			'This is an exotic looking van for someone who has been on the road with ordinary vans and wants to try something new or simply is a bit eccentric. Explore the outdoors today with the Tank Van.',
		imageUrl:
			'https://images.unsplash.com/photo-1598013362701-c1a614b6bd04?w=300&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		type: 'LUXURY' as VanType,
		createdAt: new Date(2016, 11, 23),
	},
	{
		name: 'Luxury Van',
		price: 100,
		description:
			'With this van, there is a built in bed for those looking for a more luxurious Van and yet still want an adventure. With a olive green exterior and a nice natural interior it looks good inside and out!',
		imageUrl:
			'https://images.unsplash.com/photo-1627386172764-1d1b7ea90b66?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njd8fHZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'LUXURY' as VanType,
		createdAt: new Date(2019, 9, 2),
	},
	{
		name: 'Peach Wonder',
		price: 70,
		description:
			"With this van, you can take your travel life to the next level. The Peach Wonder is a sustainable vehicle that's perfect for people who are looking for a stylish, eco-friendly mode of transport that can go anywhere.",
		imageUrl:
			'https://images.unsplash.com/photo-1731603215747-8793302468f3?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI2fHx2YW58ZW58MHx8MHx8fDI%3D',
		type: 'RUGGED' as VanType,
		createdAt: new Date(2015, 3, 16),
	},
	{
		name: 'Modern Wonder',
		price: 70,
		description:
			'With this van, you can be sure that the adventure will be center stage as this van has all the modcons to enable you to enjoy the sights and sounds and focus on what matters while on your trip.',
		imageUrl:
			'https://images.unsplash.com/photo-1629793456114-96853e011f5e?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTcyfHx2YW58ZW58MHx8MHx8fDI%3D',
		type: 'LUXURY' as VanType,
		createdAt: new Date(2016, 8, 29),
	},
	{
		name: 'Maui Wonder',
		price: 100,
		description:
			'This may be one of the most luxurious vans on offer today. It is polished and modern and provides an amazing experience for adventurers who want to do it in a Van that offers modern conveniences on the go.',
		imageUrl:
			'https://images.unsplash.com/photo-1513311068348-19c8fbdc0bb6?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FyYXZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'LUXURY' as VanType,
		createdAt: new Date(2019, 9, 12),
	},
	{
		name: "Nomad's Haven",
		price: 85,
		description:
			"Perfect for digital nomads and remote workers, the Nomad's Haven features a built-in workspace with ergonomic seating, reliable WiFi, and plenty of power outlets. The interior is designed for productivity while maintaining the freedom of the open road.",
		imageUrl:
			'https://images.unsplash.com/photo-1516394399858-ae258cf724cc?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNhbXBlcnZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'LUXURY' as VanType,
		createdAt: new Date(2020, 3, 15),
	},
	{
		name: 'Forest Guardian',
		price: 55,
		description:
			'Built for nature enthusiasts, the Forest Guardian comes equipped with all-terrain capabilities, a rooftop tent, and specialized storage for camping gear. Its earthy green exterior blends seamlessly with natural surroundings.',
		imageUrl:
			'https://images.unsplash.com/photo-1605410791216-3d9653a95667?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'RUGGED' as VanType,
		createdAt: new Date(2019, 7, 8),
	},
	{
		name: 'Urban Escape',
		price: 45,
		type: 'LUXURY' as VanType,
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
		type: 'LUXURY' as VanType,
		createdAt: new Date(2018, 6, 10),
	},
	{
		name: 'Desert Wanderer',
		price: 75,
		description:
			'Built for extreme conditions, the Desert Wanderer features enhanced cooling systems, solar panels, and extra water storage. Its tan exterior reflects heat while the interior stays cool and comfortable.',
		imageUrl:
			'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dmFufGVufDB8fDB8fHwy',
		type: 'RUGGED' as VanType,
		createdAt: new Date(2019, 11, 3),
	},
	{
		name: 'Alpine Adventure',
		price: 110,
		description:
			'Designed for mountain enthusiasts, the Alpine Adventure features four-wheel drive, heated floors, and specialized storage for ski and snowboard equipment. The interior is insulated for cold weather camping.',
		imageUrl:
			'https://images.unsplash.com/photo-1647629825421-2f7441004492?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTR8fGNhbXBlcnZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'LUXURY' as VanType,
		createdAt: new Date(2020, 8, 14),
	},
	{
		name: 'Retro Rambler',
		price: 40,
		description:
			'A lovingly restored classic van with modern amenities hidden behind its vintage exterior. Features include a retro-inspired interior with contemporary comforts, perfect for those who appreciate both style and functionality.',
		imageUrl:
			'https://images.unsplash.com/photo-1639156814151-334b5327665b?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjEzfHxjYW1wZXJ2YW58ZW58MHx8MHx8fDI%3D',
		type: 'SIMPLE' as VanType,
		createdAt: new Date(2017, 9, 18),
	},
	{
		name: 'Tech Nomad',
		price: 95,
		description:
			'Built for the modern digital lifestyle, the Tech Nomad features integrated smart home technology, voice-controlled lighting, and a built-in projector for movie nights under the stars. Perfect for tech-savvy travelers.',
		imageUrl:
			'https://images.unsplash.com/photo-1515876305430-f06edab8282a?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2FtcGVyJTIwdmFufGVufDB8fDB8fHwy',
		type: 'LUXURY' as VanType,
		createdAt: new Date(2021, 2, 28),
	},
	{
		name: 'Family Explorer',
		price: 80,
		description:
			"Spacious and family-friendly, the Family Explorer features bunk beds, a full kitchen, and plenty of storage for everyone's gear. The interior is designed with safety and comfort in mind for family adventures.",
		imageUrl:
			'https://images.unsplash.com/photo-1626680114529-3f6ffa002b80?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGNhbXBlciUyMHZhbnxlbnwwfHwwfHx8Mg%3D%3D',
		type: 'SIMPLE' as VanType,
		createdAt: new Date(2020, 5, 12),
	},
];
