import Image from '~/features/image/component/image';
import type { VanModel } from '~/generated/prisma/models';

type HostVanDetailPhotosProps = {
	van: VanModel;
};

export default function HostVanDetailPhotos({ van }: HostVanDetailPhotosProps) {
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
