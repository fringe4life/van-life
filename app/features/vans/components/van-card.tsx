import { Badge } from '~/components/ui/badge';
import { Card, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import Image from '~/features/image/component/image';
import { VAN_CARD_IMG_SIZES } from '~/features/image/img-constants';
import { createWebPSrcSet } from '~/features/image/utils/create-optimized-src-set';
import CustomLink from '~/features/navigation/components/custom-link';
import { toLowercaseVanType } from '~/features/vans/utils/validators';
import { withVanCardStyles } from '~/features/vans/utils/with-van-card-styles';
import type { VanModel } from '~/generated/prisma/models';
import VanBadge from './van-badge';

const StyledCard = withVanCardStyles(Card);

interface VanCardProps {
	van: VanModel;
	link: string;
	action: React.ReactElement;
	linkCoversCard?: boolean;
	state?: Record<string, unknown>;
}

export default function VanCard({
	van,
	link,
	action,
	linkCoversCard = true,
	state,
}: VanCardProps) {
	const { type, name, description, imageUrl } = van;

	// Create optimized WebP srcSet with 1:1 aspect ratio for both mobile and desktop
	// since the VanCard uses aspect-square
	const srcSet = createWebPSrcSet(imageUrl, {
		sizes: VAN_CARD_IMG_SIZES,
		aspectRatio: '1:1',
		// quality defaults to DEFAULT_IMAGE_QUALITY (50) for better compression
	});

	return (
		<div className="@container/card xs:scroll-sm scroll-md md:scroll-lg contain-content contain-inline-size [contain-intrinsic-size:auto_300px_auto_200px] [content-visibility:auto]">
			<StyledCard
				className="relative grid @min-md/card:grid-cols-[200px_1fr_min-content] @min-md/card:grid-rows-2 @min-md/card:gap-4"
				van={van}
			>
				<CardHeader className="relative @min-md/card:col-start-1 @min-md/card:row-span-2">
					<VanBadge van={van} />
					<Image
						alt={description}
						className="aspect-square w-full rounded-md"
						height="200"
						sizes="(max-width: 300px) 250px, (max-width: 400px) 300px, 350px"
						src={imageUrl}
						srcSet={srcSet}
						width="200"
					/>
				</CardHeader>
				<CardFooter className="@min-md/card:col-span-2 @min-md/card:col-start-2 @min-md/card:row-span-2 grid-cols-subgrid grid-rows-subgrid @min-md/card:content-center">
					<CardTitle className="@min-md/card:col-start-2 @min-md/card:row-end-2 @min-md/card:self-start text-2xl">
						<CustomLink state={state} title={name} to={link}>
							{name}
							<span
								className="link-covers-card:absolute link-covers-card:inset-0 link-covers-card:h-full link-covers-card:w-full link-covers-card:overflow-hidden"
								data-link-covers-card={linkCoversCard}
							/>
						</CustomLink>
					</CardTitle>
					{action}
					<Badge
						className="@min-md/card:-row-end-1"
						variant={toLowercaseVanType(type)}
					>
						{type}
					</Badge>
				</CardFooter>
			</StyledCard>
		</div>
	);
}
