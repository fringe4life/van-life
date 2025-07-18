import clsx from 'clsx';
import { href } from 'react-router';
import CustomLink from '~/components/CustomLink';
import { buttonVariants } from '~/components/ui/button';
import useIsNavigating from '~/hooks/useIsNavigating';
import { cn } from '~/utils/utils';

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
				'md:mask-[url(/app/assets/rvMask.svg)] mask-add mask-contain mask-no-repeat mask-right mask-type-luminance md:mask-right md:mask-add md:mask-no-repeat md:mask-cover grid aspect-[1/2] place-content-center gap-6 self-center bg-[url(https://images.unsplash.com/photo-1671783181591-55f8e18fbb21?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2FtcGVydmFuJTIwc2l0ZXxlbnwwfDB8MHx8fDI%3D)] bg-black/40 bg-cover text-white bg-blend-darken [view-transition-name:image] md:aspect-video': true,
				'opacity-75': changingPage,
			})}
		>
			<h2 className="max-w-[26ch] font-extrabold text-lg text-shadow-md sm:text-2xl md:text-4xl">
				You got the travel plans, we've got the travel vans.
			</h2>
			<p className="max-w-[26ch] text-shadow-2xs md:max-w-[45ch]">
				Add adventure to your life by joining the #vanlife movement. Rent the
				perfect van to make your perfect road trip.
			</p>
			<CustomLink
				to={href('/vans')}
				className={cn(buttonVariants(), 'max-w-[46ch] self-end ')}
			>
				Find your van
			</CustomLink>
		</section>
	);
}
