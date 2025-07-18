import clsx from 'clsx';
import { href } from 'react-router';
import CustomLink from '~/components/CustomLink';
import Image from '~/components/Image';
import { buttonVariants } from '~/components/ui/button';
import { ABOUT_IMG, ABOUT_IMG_SIZES } from '~/constants/constants';
import useIsNavigating from '~/hooks/useIsNavigating';
import { createSrcSet } from '~/utils/createSrcSet';
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

const srcSet = createSrcSet(ABOUT_IMG_SIZES, ABOUT_IMG);
export default function About() {
	const { changingPage } = useIsNavigating();

	return (
		<section
			className={clsx({
				'grid grid-cols-[1fr] grid-rows-[min-content_min-content_min-content_min-content] gap-4 sm:gap-6 md:gap-10': true,
				'opacity-75': changingPage,
			})}
		>
			<Image
				className="xs:mask-[url(/app/assets/cloud-4.svg)] mask-cover mask-center aspect-video [view-transition-name:image]"
				src={ABOUT_IMG}
				alt="a couple enjoying their adventure"
				height="900"
				width="1600"
				srcSet={srcSet}
				loading="eager"
				decoding="sync"
				fetchPriority="high"
			/>

			<h2 className="mx-2 font-bold text-2xl starting:opacity-50 duration-1000 sm:mx-4 sm:text-3xl/normal md:text-4xl">
				Don&apos;t{' '}
				<span className="after:-bottom-1 relative after:absolute after:left-0 after:w-full after:rounded-lg after:border-2 after:border-b-red-500 after:border-solid ">
					squeeze
				</span>{' '}
				in a sedan when you could{' '}
				<span className="after:-bottom-1 relative after:absolute after:left-0 after:w-full after:rounded-lg after:border-2 after:border-b-green-500 after:border-double ">
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
					of touring the world on 4 wheels. So dive into our vast collection
					today and make your own magic in the great outdoors 🌳!
				</p>
			</div>
			<article className="mx-4 grid max-w-max shrink grow-0 content-between gap-y-5 rounded-md bg-orange-400 px-4 py-3 sm:px-8 md:justify-self-center md:px-12 md:py-6">
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
		</section>
	);
}
