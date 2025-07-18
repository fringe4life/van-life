type ImgProps = React.ComponentProps<'img'> & {
	src: string;
};
/**
 * @abstract receives an img from unsplash and lazy loads it
 * @param props the attributes received by an img tag
 * @returns an img with a srcset
 */
export default function Image({ src, alt, className, ...rest }: ImgProps) {
	return (
		<div className="m-0 block h-auto max-w-full p-0">
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
