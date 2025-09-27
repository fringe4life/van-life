import { href } from 'react-router';
import PendingUI from '~/components/pending-ui';
import { buttonVariants } from '~/components/ui/button';
import Image from '~/features/image/component/image';
import {
	HIGH_QUALITY_IMAGE_QUALITY,
	HOME_DESKTOP_IMG_SIZES,
	HOME_IMG_URL,
	HOME_MOBILE_IMG_SIZES,
} from '~/features/image/img-constants';
import { createWebPSrcSet } from '~/features/image/utils/create-optimized-src-set';
import CustomLink from '~/features/navigation/components/custom-link';
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

// Use only mobile images for now to fix the aspect ratio issue
const srcSet = createWebPSrcSet(
	HOME_IMG_URL,
	{
		sizes: HOME_MOBILE_IMG_SIZES,
		aspectRatio: '2:3',
		quality: HIGH_QUALITY_IMAGE_QUALITY, // Higher quality for home page
	}, // mobile aspect ratio (2:3)
	{
		sizes: HOME_DESKTOP_IMG_SIZES,
		aspectRatio: '16:9',
		quality: HIGH_QUALITY_IMAGE_QUALITY, // Higher quality for home page
	} // desktop aspect ratio (16:9)
);
const sizes = '(max-width: 1024px) 100vw';

export default function Home() {
	return (
		<PendingUI
			as="section"
			className="-mx-[var(--padding-inline)] relative grid aspect-[1/1.5] text-white contain-strict sm:pl-6 md:aspect-video md:place-content-center md:self-center"
		>
			{/* Background Image with gradient overlay */}
			<div className="mask-cover mask-no-repeat mask-right md:mask-[url(/app/assets/rvMask.svg)] absolute inset-0">
				<div className="absolute inset-0 z-10 bg-linear-45 from-0% from-indigo-300/40 via-33% via-green-300/40 to-66% to-yellow-200/40 bg-blend-darken" />
				<Image
					alt="Camper van on scenic road"
					classesForContainer="absolute inset-0 w-full h-full"
					className="[view-transition-name:image]"
					decoding="sync"
					fetchPriority="high"
					height={1500}
					loading="eager"
					sizes={sizes}
					src={HOME_IMG_URL}
					srcSet={srcSet}
					width={1000}
				/>
			</div>

			{/* Content overlay */}
			<div className="z-20 grid content-center gap-y-6 px-[var(--padding-inline)] md:justify-center md:px-0">
				<h2 className="max-w-[20ch] p-1 font-extrabold text-2xl text-shadow-lg xs:text-3xl backdrop-blur-sm md:text-4xl">
					You got the travel plans, we got the travel vans.
				</h2>
				<p className="max-w-[34ch] xs:max-w-[42.5ch] p-1 text-shadow-sm backdrop-blur-xs">
					Add adventure to your life by joining the #vanlife movement. Rent the
					perfect van to make your perfect road trip.
				</p>
				<CustomLink
					className={cn(buttonVariants({ size: 'lg' }), 'max-w-[42.5ch]')}
					to={href('/vans')}
				>
					Find your van
				</CustomLink>
			</div>
		</PendingUI>
	);
}
