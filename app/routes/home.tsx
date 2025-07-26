import clsx from 'clsx';
import { href } from 'react-router';
import CustomLink from '~/components/CustomLink';
import Image from '~/components/Image';
import { buttonVariants } from '~/components/ui/button';
import {
	HOME_DESKTOP_IMG_SIZES,
	HOME_IMG_URL,
	HOME_MOBILE_IMG_SIZES,
} from '~/constants/constants';
import useIsNavigating from '~/hooks/useIsNavigating';
import { createResponsiveSrcSet } from '~/utils/createSrcSet';
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

	// Create responsive srcSet with different aspect ratios:
	// Mobile: 1:1.5 (portrait) - below md breakpoint
	// Desktop: 16:9 (landscape) - md breakpoint and above
	const srcSet = createResponsiveSrcSet(
		HOME_IMG_URL,
		HOME_MOBILE_IMG_SIZES,
		HOME_DESKTOP_IMG_SIZES,
		1.5, // mobile aspect ratio (1:1.5)
		16 / 9, // desktop aspect ratio (16:9)
	);

	// Sizes attribute optimized for the aspect ratio changes:
	// Mobile: aspect-[1/1.5] (portrait), Desktop: aspect-video (16:9 landscape)
	// Container max-width is 5xl (1024px), but image can be full viewport width
	const sizes =
		'(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw';

	return (
		<section
			className={clsx(
				'relative grid aspect-[1/1.5] place-content-center self-center px-2 text-white contain-strict sm:pl-6 md:aspect-video',
				{
					'opacity-75': changingPage,
				},
			)}
		>
			{/* Background Image with gradient overlay */}
			<div className="mask-cover mask-no-repeat mask-right md:mask-[url(/app/assets/rvMask.svg)] absolute inset-0">
				<div className="absolute inset-0 z-10 bg-linear-45 from-0% from-indigo-300/40 via-33% via-green-300/40 to-66% to-yellow-200/40 bg-blend-darken" />
				<Image
					src={HOME_IMG_URL}
					classesForContainer="absolute inset-0 w-full h-full"
					alt="Camper van on scenic road"
					width={1000}
					height={667}
					className=" [view-transition-name:image]"
					srcSet={srcSet}
					sizes={sizes}
					loading="eager"
					decoding="sync"
					fetchPriority="high"
				/>
			</div>

			{/* Content overlay */}
			<div className="relative z-20 grid content-center justify-center gap-6">
				<h2 className="max-w-[20ch] p-0.5 font-extrabold text-2xl text-shadow-lg xs:text-3xl backdrop-blur-sm md:text-4xl">
					You got the travel plans, we got the travel vans.
				</h2>
				<p className="max-w-[34ch] xs:max-w-[42.5ch] p-0.5 text-shadow-sm backdrop-blur-xs">
					Add adventure to your life by joining the #vanlife movement. Rent the
					perfect van to make your perfect road trip.
				</p>
				<CustomLink
					to={href('/vans')}
					className={cn(buttonVariants({ size: 'lg' }), 'max-w-[42.5ch]')}
				>
					Find your van
				</CustomLink>
			</div>
		</section>
	);
}
