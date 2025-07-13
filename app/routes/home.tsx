import clsx from 'clsx';
import { href } from 'react-router';
import CustomLink from '~/components/CustomLink';
import { buttonVariants } from '~/components/ui/button';
import useIsNavigating from '~/hooks/useIsNavigating';

export function meta() {
	return [
		{ title: 'Home | Van life' },
		{
			name: 'description',
			content:
				'Welcome to Van life, a site to help you find your next Camper Van!',
		},
	];
}

export default function Home() {
	const { changingPage } = useIsNavigating();

	return (
		<section
			className={clsx({
				'mask-[url(/app/assets/rvMask.svg)] mask-center md:mask-right mask-add mask-no-repeat mask-cover grid place-content-center gap-6 bg-[url(/app/assets/home.png)] bg-cover text-white [view-transition-name:image]': true,
				'opacity-75': changingPage,
			})}
		>
			<h2 className="max-w-[26ch] text-balance font-extrabold text-2xl text-shadow-md md:text-4xl">
				You got the travel plans, we've got the travel vans.
			</h2>
			<p className="max-w-[26ch] text-pretty text-shadow-2xs md:max-w-[45ch]">
				Add adventure to your life by joining the #vanlife movement. Rent the
				perfect van to make your perfect road trip.
			</p>
			<CustomLink to={href('/vans')} className={buttonVariants()}>
				Find your van
			</CustomLink>
		</section>
	);
}
// "self-end max-w-[80ch] sm:justify-self-center"
