import { useOutletContext } from 'react-router';
import Image from '~/features/image/component/Image';
import type { VanModel } from '~/generated/prisma/models';

export default function VanDetailPhotos() {
	const van = useOutletContext<VanModel>();
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
