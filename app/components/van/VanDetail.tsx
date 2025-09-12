import { href } from 'react-router';
import Image from '~/components/common/Image';
import { Badge, badgeVariants } from '~/components/ui/badge';
import { VAN_DETAIL_IMG_SIZES } from '~/constants/imgConstants';
import type { VanModel } from '~/generated/prisma/models';
import type { LowercaseVanType } from '~/types/types';
import { createResponsiveSrcSet } from '~/utils/createSrcSet';
import { cn } from '~/utils/utils';
import CustomLink from '../navigation/CustomLink';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../ui/card';
import VanBadge from './VanBadge';
import VanPrice from './VanPrice';

type VanDetailProps = {
	van: VanModel;
	vanIsAvailable: boolean;
};

export default function VanDetail({
	van: { imageUrl, description, type, name, id: vanId },
	vanIsAvailable,
	van,
}: VanDetailProps) {
	const srcSet = createResponsiveSrcSet(
		imageUrl,
		{ sizes: VAN_DETAIL_IMG_SIZES, aspectRatio: 1 }, // mobile sizes and aspect ratio (1:1 = square)
		{ sizes: VAN_DETAIL_IMG_SIZES, aspectRatio: 1 } // desktop sizes and aspect ratio (1:1 = square)
	);
	return (
		<div className="@container/card-full contain-content">
			<Card className="grid @min-xl/card-full:grid-cols-2 @min-xl/card-full:grid-rows-[auto_auto_1fr] @max-xl/card-full:gap-x-4 @min-xl/card-full:gap-x-4 gap-y-2">
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
										? (type.toLowerCase() as LowercaseVanType)
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
							variant={type.toLowerCase() as LowercaseVanType}
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
