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
		<div className="block h-auto max-w-full m-0 p-0">
			<img
				className={`h-auto decoration-0 text-none leading-0 object-cover object-center transition-opacity duration-200 ease-in-out, ${className}`}
				loading="lazy"
				decoding="async"
				{...rest}
				alt={alt}
				src={src}
			/>
		</div>
	);
}
