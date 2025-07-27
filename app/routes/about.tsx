import { href } from 'react-router';
import Image from '~/components/common/Image';
import PendingUI from '~/components/common/PendingUI';
import CustomLink from '~/components/navigation/CustomLink';
import { buttonVariants } from '~/components/ui/button';
import { ABOUT_IMG, ABOUT_IMG_SIZES } from '~/constants/constants';
import { createResponsiveSrcSet } from '~/utils/createSrcSet';
import { cn } from '~/utils/utils';

export function meta() {
	return [
		{ title: 'Available Vans' },
		{
			name: 'description',
			content: 'Browse the Vans available for hire',
		},
	];
}

export default function About() {
	// Create responsive srcSet with 16:9 aspect ratio for both mobile and desktop
	// since the about page only uses aspect-video
	const srcSet = createResponsiveSrcSet(
		ABOUT_IMG,
		ABOUT_IMG_SIZES, // mobile sizes
		ABOUT_IMG_SIZES, // desktop sizes (same as mobile)
		0.5625, // mobile aspect ratio (16:9 = 9/16 = 0.5625)
		0.5625, // desktop aspect ratio (16:9 = 9/16 = 0.5625)
	);

	return (
		<PendingUI
			as="section"
			className="grid grid-cols-1 gap-4 contain-content sm:gap-6 md:gap-10"
		>
			<Image
				className="xs:mask-[url(/app/assets/cloud-5.svg)] mask-cover mask-no-repeat mask-center aspect-video [view-transition-name:aboutImage]"
				src={ABOUT_IMG}
				alt="a couple enjoying their adventure"
				height="900"
				width="1600"
				srcSet={srcSet}
				// sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
				loading="eager"
				decoding="sync"
				fetchPriority="high"
			/>

			<h2 className="mx-2 font-bold text-2xl starting:opacity-50 duration-1000 sm:mx-4 sm:text-3xl/normal md:text-4xl lg:max-w-3/4">
				Don&apos;t{' '}
				<span className="underline decoration-4 decoration-red-500 underline-offset-2">
					squeeze
				</span>{' '}
				in a sedan when you could{' '}
				<span className="underline decoration-4 decoration-green-500 underline-offset-2">
					relax
				</span>{' '}
				in a van.
			</h2>
			<div className="flex flex-col gap-y-4 starting:opacity-50 duration-1000 md:gap-x-2 lg:flex-row">
				<p className="mx-2 grow-1 basis-1/2 sm:mx-4 sm:text-xl">
					Our mission is to enliven your road trip with the perfect travel van
					rental. Our vans are recertified before each trip to ensure your
					travel plans can go off without a hitch. (Hitch costs extra 😉)
				</p>

				<p className="mx-2 grow-1 basis-1/2 starting:opacity-50 duration-1000 sm:mx-4 sm:text-xl">
					Our team is full of vanlife enthusiasts who know firsthand the magic
					of touring the world on 4 wheels. So dive into our vast catalog today
					and make your own magic in the great outdoors 🌳!
				</p>
			</div>
			<article className="mx-4 grid max-w-max content-between gap-y-5 rounded-md bg-orange-200 px-4 py-3 sm:px-8 md:px-12 md:py-6">
				<h3 className="font-bold text-xl xs:text-2xl">
					Your destination is waiting.{' '}
					<span className="block">Your van is ready.</span>
				</h3>
				<CustomLink
					to={href('/vans')}
					className={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}
				>
					Explore our vans
				</CustomLink>
			</article>
		</PendingUI>
	);
}
