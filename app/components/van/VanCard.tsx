import clsx from 'clsx';
import Image from '~/components/common/Image';
import CustomLink from '~/components/navigation/CustomLink';
import { Badge } from '~/components/ui/badge';
import { Card, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { VAN_CARD_IMG_SIZES } from '~/constants/imgConstants';
import type { VanModel } from '~/generated/prisma/models';
import type { LowercaseVanType } from '~/types/types';
import { createResponsiveSrcSet } from '~/utils/createSrcSet';
import VanBadge from './VanBadge';

type VanCardProps = {
	van: VanModel;
	link: string;
	action: React.ReactElement;
	linkCoversCard?: boolean;
	state?: Record<string, unknown>;
};

export default function VanCard({
	van,
	link,
	action,
	linkCoversCard = true,
	state,
}: VanCardProps) {
	const { type, name, description, imageUrl, id: vanId } = van;

	// Create responsive srcSet with 1:1 aspect ratio for both mobile and desktop
	// since the VanCard uses aspect-square
	const srcSet = createResponsiveSrcSet(
		imageUrl,
		VAN_CARD_IMG_SIZES, // mobile sizes
		VAN_CARD_IMG_SIZES, // desktop sizes (same as mobile)
		1, // mobile aspect ratio (1:1 = square)
		1, // desktop aspect ratio (1:1 = square)
	);

	return (
		<div className="@container/card xs:scroll-sm scroll-md md:scroll-lg contain-content contain-inline-size [contain-intrinsic-size:auto_300px_auto_200px] [content-visibility:auto]">
			<Card
				className="relative grid @min-md/card:grid-cols-[200px_1fr_min-content] @min-md/card:grid-rows-2 @min-md/card:gap-4"
				style={{ viewTransitionName: `card-${vanId}` }}
			>
				<CardHeader className="relative @min-md/card:col-start-1 @min-md/card:row-span-2">
					<VanBadge van={van} />
					<Image
						className="aspect-square w-full rounded-md"
						src={imageUrl}
						alt={description}
						height="200"
						width="200"
						srcSet={srcSet}
						sizes="(width < 350px) 250w, (width > 300px) 350w, 200w"
					/>
				</CardHeader>
				<CardFooter className="@min-md/card:col-span-2 @min-md/card:col-start-2 @min-md/card:row-span-2 grid-cols-subgrid grid-rows-subgrid @min-md/card:content-center">
					<CardTitle className="@min-md/card:col-start-2 @min-md/card:row-end-2 @min-md/card:self-start text-2xl">
						<CustomLink to={link} state={state} title={name}>
							{name}
							<span
								className={clsx(
									linkCoversCard &&
										'absolute inset-0 h-full w-full overflow-hidden',
								)}
							></span>
						</CustomLink>
					</CardTitle>
					{action}
					<Badge
						className="@min-md/card:-row-end-1"
						variant={type.toLowerCase() as LowercaseVanType}
					>
						{type}
					</Badge>
				</CardFooter>
			</Card>
		</div>
	);
}
