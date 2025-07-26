import type { Van } from '@prisma/client';
import { useOutletContext } from 'react-router';
import Image from '~/components/Image';

export default function VanDetailPhotos() {
	const van = useOutletContext<Van>();
	return (
		<Image
			src={van.imageUrl}
			alt={van.name}
			width="100"
			height="100"
			srcSet=""
			className="aspect-square rounded-md"
		/>
	);
}
