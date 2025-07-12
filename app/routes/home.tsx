import { href, Link } from 'react-router';
import { buttonVariants } from '~/components/ui/button';

export function meta() {
	return [
		{ title: 'Van life' },
		{
			name: 'description',
			content:
				'Welcome to Van life, a site to help you find your next Camper Van!',
		},
	];
}

export default function Home() {
	return (
		<section className=" mask-[url(/app/assets/rvMask.svg)] mask-center md:mask-right mask-add mask-no-repeat mask-cover grid place-content-center gap-6 bg-[url(/app/assets/home.png)] bg-cover text-white [view-transition-name:image]">
			<h2 className="max-w-[26ch] text-balance font-extrabold text-2xl text-shadow-md md:text-4xl">
				You got the travel plans, we've got the travel vans.
			</h2>
			<p className="max-w-[26ch] text-pretty text-shadow-2xs md:max-w-[45ch]">
				Add adventure to your life by joining the #vanlife movement. Rent the
				perfect van to make your perfect road trip.
			</p>
			<Link
				to={href('/vans')}
				className={buttonVariants({ variant: 'default' })}
			>
				Find your van
			</Link>
		</section>
	);
}
// "self-end max-w-[80ch] sm:justify-self-center"
