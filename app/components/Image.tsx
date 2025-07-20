// import { createNewImageSize } from '~/utils/createNewImageSize';
// import { cn } from '~/utils/utils';

import { cn } from "~/utils/utils";

type ImgProps = React.ComponentProps<'img'> & {
	src: string;
	width: string | number;
	height: string | number;
	srcSet: string;
	classesForContainer?: string;
};
/**
 * @abstract receives an img from unsplash and lazy loads it
 * @param props the attributes received by an img tag
 * @returns an img with a srcset
 */
export default function Image({
	src,
	alt,
	className,
	classesForContainer = '',
	...rest
}: ImgProps) {
	// const lowRes = createNewImageSize(src, 20);
	return (
		<div className={cn('m-0 p-0', classesForContainer)}>
			<img
				className={` max-w-full bg-cover bg-no-repeat object-cover object-center align-middle text-none italic leading-0 decoration-0 transition-opacity duration-200 ease-in-out, contain-strict ${className}`}
				loading="lazy"
				// style={{ backgroundImage: lowRes }}
				decoding="async"
				{...rest}
				alt={alt}
				src={src}
			/>
		</div>
	);
}
