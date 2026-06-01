import { Image } from '~/features/image/component/image';
import { useVanDetailCard } from './context';

/**
 * Photos sub-component - displays van image
 */
function Photos() {
	const van = useVanDetailCard();

	return (
		<Image
			alt={van.name}
			className="aspect-square rounded-md"
			height="100"
			src={van.imageUrl}
			srcSet=""
			width="100"
		/>
	);
}

export { Photos };
