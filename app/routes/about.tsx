import clsx from 'clsx';
import { href } from 'react-router';
import CustomLink from '~/components/CustomLink';
import Image from '~/components/Image.client';
import { buttonVariants } from '~/components/ui/button';
import { ABOUT_IMG, ABOUT_IMG_SIZES } from '~/constants/constants';
import useIsNavigating from '~/hooks/useIsNavigating';
import { createSrcSet } from '~/utils/createSrcSet';

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
				'grid grid-cols-[1fr] grid-rows-[auto_auto_auto_auto] gap-4': true,
				'opacity-75': changingPage,
			})}
		>
			<Image
				className="aspect-video md:aspect-4/1"
				src={ABOUT_IMG}
				alt="a couple enjoying their adventure"
				height="400"
				width="1600"
				srcSet={srcSet}
				loading="eager"
				decoding="sync"
				fetchPriority="high"
			/>
			<h2 className="mx-4 text-balance font-bold text-3xl/normal lg:mx-auto lg:max-w-1/2">
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

			<p className="mx-4 lg:mx-auto lg:max-w-1/2">
				Our mission is to enliven your road trip with the perfect travel van
				rental. Our vans are recertified before each trip to ensure your travel
				plans can go off without a hitch. (Hitch costs extra 😉)
			</p>
			<p className="mx-4 lg:mx-auto lg:max-w-1/2">
				Our team is full of vanlife enthusiasts who know firsthand the magic of
				touring the world on 4 wheels.
			</p>
			<article className="mx-4 my-14 rounded-md bg-[#FFCC8D] px-9 py-7.5 lg:mx-auto lg:max-w-1/2">
				<h3 className="mb-6 text-balance font-bold text-2xl">
					Your destination is waiting. Your van is ready.
				</h3>
				<CustomLink
					to={href('/vans')}
					className={buttonVariants({ variant: 'secondary' })}
				>
					Explore our vans
				</CustomLink>
			</article>
		</section>
	);
}

// Photo by <a href="https://unsplash.com/@leon_bublitz?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Leon Bublitz</a> on <a href="https://unsplash.com/photos/white-bus-near-ocean-M-p2YHj3sjk?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
