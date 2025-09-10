import { useOutletContext } from 'react-router';
import Image from '~/components/common/Image';
import type { VanModel } from '~/generated/prisma/models';

export default function VanDetailPhotos() {
	const van = useOutletContext<VanModel>();
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
