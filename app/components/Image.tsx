import { cn } from '~/utils/utils';

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
	return (
		<div className={cn('m-0 h-auto max-w-full p-0', classesForContainer)}>
			<img
				className={`h-auto object-cover object-center text-none leading-0 decoration-0 transition-opacity duration-200 ease-in-out, contain-strict ${className}`}
				loading="lazy"
				decoding="async"
				{...rest}
				alt={alt}
				src={src}
			/>
		</div>
	);
}
