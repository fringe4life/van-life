import { useEffect, useState } from 'react';
import canUseDOM from '~/utils/canUseDOM';
import { createNewImageSize } from '~/utils/createNewImageSize';
import { cn } from '~/utils/utils';

type ImgProps = React.ComponentProps<'img'> & {
	src: string;
	width: string | number;
	height: string | number;
	srcSet?: string;
	classesForContainer?: string;
};

export default function Image({
	src,
	alt,
	className,
	classesForContainer = '',
	...rest
}: ImgProps) {
	const lowRes = createNewImageSize(src, 20);
	const [loaded, setLoaded] = useState(false);
	const [fullSrc, setFullSrc] = useState<string | null>(null);

	useEffect(() => {
		if (!canUseDOM) return;
		let isCancelled = false;
		const img = new window.Image();
		img.src = src;
		img.onload = () => {
			if (!isCancelled) {
				setFullSrc(src);
				setLoaded(true);
			}
		};
		return () => {
			isCancelled = true;
		};
	}, [src]);

	// Always render the lowRes image initially, swap to fullSrc after load
	return (
		<div className={cn('m-0 p-0', classesForContainer)}>
			<img
				className={cn(
					'max-w-full bg-cover bg-no-repeat object-cover object-center align-middle text-none italic leading-0 decoration-0 transition-opacity duration-200 ease-in-out contain-strict',
					!loaded && 'animate-pulse blur-sm',
					className,
				)}
				loading="lazy"
				decoding="async"
				{...rest}
				alt={alt}
				src={fullSrc || lowRes}
			/>
		</div>
	);
}
