import { href } from 'react-router';
import { Badge, badgeVariants } from '~/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '~/components/ui/card';
import Image from '~/features/image/component/image';
import {
	HIGH_QUALITY_IMAGE_QUALITY,
	VAN_DETAIL_IMG_SIZES,
} from '~/features/image/img-constants';
import { createWebPSrcSet } from '~/features/image/utils/create-optimized-src-set';
import CustomLink from '~/features/navigation/components/custom-link';
import { isVanAvailable } from '~/features/vans/utils/van-state-helpers';
import { getVanStateStyles } from '~/features/vans/utils/van-state-styles';
import type { VanModel } from '~/generated/prisma/models';
import { cn } from '~/utils/utils';
import { validateLowercaseVanType } from '~/utils/validators';
import VanBadge from './van-badge';
import VanPrice from './van-price';

type VanDetailProps = {
	van: VanModel;
};

export default function VanDetail({
	van: { imageUrl, description, type, name, id: vanId },
	van,
}: VanDetailProps) {
	const vanIsAvailable = isVanAvailable(van);
	const srcSet = createWebPSrcSet(
		imageUrl,
		{
			sizes: VAN_DETAIL_IMG_SIZES,
			aspectRatio: 1,
			quality: HIGH_QUALITY_IMAGE_QUALITY, // Higher quality for detail view
		}, // mobile sizes and aspect ratio (1:1 = square)
		{
			sizes: VAN_DETAIL_IMG_SIZES,
			aspectRatio: 1,
			quality: HIGH_QUALITY_IMAGE_QUALITY, // Higher quality for detail view
		} // desktop sizes and aspect ratio (1:1 = square)
	);

	// Get van state styling
	const { dataSlot, className: vanStateClasses } = getVanStateStyles(van);

	return (
		<div className="@container/card-full contain-content">
			<Card
				className={`grid @min-xl/card-full:grid-cols-2 @min-xl/card-full:grid-rows-[auto_auto_1fr] @max-xl/card-full:gap-x-4 @min-xl/card-full:gap-x-4 gap-y-2 ${vanStateClasses}`}
				data-slot={dataSlot}
			>
				<CardHeader className="relative @min-xl/card-full:col-span-1 @min-xl/card-full:row-span-3 row-span-1">
					<VanBadge van={van} />
					<Image
						alt={description}
						className="aspect-square rounded-md"
						height="600"
						sizes="(min-width: 1024px) 500px, (min-width: 768px) 400px, 300px"
						src={imageUrl}
						srcSet={srcSet}
						width="600"
					/>
				</CardHeader>
				<CardContent className="@min-xl/card-full:col-start-2 @max-xl/card-full:row-span-4 @min-xl/card-full:row-span-3 @max-xl/card-full:row-start-2 @min-xl/card-full:row-start-1 flex @min-xl/card-full:grid @min-xl/card-full:grid-rows-[auto_auto_1fr] flex-col gap-x-4 gap-y-2 @min-xl/card-full:self-center">
					{/* First row: Name and Rent button */}
					<div className="@min-xl/card-full:row-start-1 @min-xl/card-full:flex @min-xl/card-full:items-center @min-xl/card-full:justify-between">
						<CardTitle className="@min-xl/card-full:m-0 @min-xl/card-full:text-xl">
							{name}
						</CardTitle>
						<CustomLink
							className={cn(
								badgeVariants({
									variant: vanIsAvailable
										? validateLowercaseVanType(type.toLowerCase())
										: 'unavailable',
								}),
								'@max-xl/card-full:hidden @min-xl/card-full:flex-shrink-0'
							)}
							to={
								vanIsAvailable
									? href('/host/rentals/rent/:vanId', { vanId })
									: href('/vans/:vanId', { vanId })
							}
						>
							{vanIsAvailable ? 'Rent this van' : 'Van not available'}
						</CustomLink>
					</div>

					{/* Second row: Badge and Price */}
					<div className="@min-xl/card-full:row-start-2 flex items-center justify-between gap-4">
						<Badge
							className="@min-xl/card-full:m-0"
							size="small"
							variant={validateLowercaseVanType(type.toLowerCase())}
						>
							{type}
						</Badge>
						<div className="@min-xl/card-full:m-0 @min-xl/card-full:text-xl">
							<VanPrice van={van} />
						</div>
					</div>

					{/* Third row: Description */}
					<CardDescription className="@min-xl/card-full:row-start-3 @min-xl/card-full:m-0 @min-xl/card-full:text-base">
						{description}
					</CardDescription>
				</CardContent>

				{/* Mobile/Tablet Footer - hidden on desktop */}
				<CardFooter className="@max-lg/card-full:row-span-1 @min-xl/card-full:hidden">
					<CustomLink
						className={cn(
							badgeVariants({
								variant: vanIsAvailable
									? (type.toLowerCase() as 'simple' | 'luxury' | 'rugged')
									: 'unavailable',
							}),
							'@max-lg/card-full:w-full'
						)}
						to={
							vanIsAvailable
								? href('/host/rentals/rent/:vanId', { vanId })
								: href('/vans/:vanId', { vanId })
						}
					>
						{vanIsAvailable ? 'Rent this van' : 'Van not available'}
					</CustomLink>
				</CardFooter>
			</Card>
		</div>
	);
}
