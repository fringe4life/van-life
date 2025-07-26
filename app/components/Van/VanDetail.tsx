import type { Van } from '@prisma/client';
import { href } from 'react-router';
import Image from '~/components/Image';
import { Badge, badgeVariants } from '~/components/ui/badge';
import { VAN_DETAIL_IMG_SIZES } from '~/constants/constants';
import { createResponsiveSrcSet } from '~/utils/createSrcSet';
import { displayPrice } from '~/utils/displayPrice';
import { cn } from '~/utils/utils';
import CustomLink from '../CustomLink';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../ui/card';

type VanDetailProps = {
	van: Van;
	vanIsAvailable: boolean;
};

export default function VanDetail({
	van: { imageUrl, description, type, name, price, id: vanId },
	vanIsAvailable,
}: VanDetailProps) {
	const srcSet = createResponsiveSrcSet(
		imageUrl,
		VAN_DETAIL_IMG_SIZES, // mobile sizes
		VAN_DETAIL_IMG_SIZES, // desktop sizes (same as mobile)
		1, // mobile aspect ratio (1:1 = square)
		1, // desktop aspect ratio (1:1 = square)
	);
	return (
		<div className="@container/card-full contain-content">
			<Card className="grid @min-xl/card-full:grid-cols-2 @min-xl/card-full:grid-rows-[auto_auto_1fr] @max-xl/card-full:gap-4 @min-xl/card-full:gap-6 gap-2">
				<CardHeader className="@min-xl/card-full:col-span-1 @min-xl/card-full:row-span-3 row-span-1">
					<Image
						className="aspect-square rounded-md"
						src={imageUrl}
						alt={description}
						width="600"
						height="600"
						srcSet={srcSet}
						sizes="(min-width: 1024px) 500px, (min-width: 768px) 400px, 300px"
					/>
				</CardHeader>
				<CardContent className="@min-xl/card-full:col-start-2 @max-xl/card-full:row-span-4 @min-xl/card-full:row-span-3 @max-xl/card-full:row-start-2 @min-xl/card-full:row-start-1 flex @min-xl/card-full:grid @min-xl/card-full:grid-rows-[auto_auto_1fr] flex-col @min-xl/card-full:gap-4 gap-4 @min-xl/card-full:self-center">
					{/* First row: Name and Rent button */}
					<div className="@min-xl/card-full:row-start-1 @min-xl/card-full:flex @min-xl/card-full:items-center @min-xl/card-full:justify-between">
						<CardTitle className="@min-xl/card-full:m-0 @min-xl/card-full:text-xl">
							{name}
						</CardTitle>
						<CustomLink
							to={
								vanIsAvailable
									? href('/host/rentals/rent/:vanId', { vanId })
									: href('/vans/:vanId', { vanId })
							}
							className={cn(
								badgeVariants({
									variant: vanIsAvailable ? type : 'UNAVAILABLE',
								}),
								'@max-xl/card-full:hidden @min-xl/card-full:flex-shrink-0',
							)}
						>
							{vanIsAvailable ? 'Rent this van' : 'Van not available'}
						</CustomLink>
					</div>

					{/* Second row: Badge and Price */}
					<div className="@min-xl/card-full:row-start-2 flex items-center @min-xl/card-full:justify-between gap-4">
						<Badge
							className="@min-xl/card-full:m-0"
							variant={type}
							size="small"
						>
							{type}
						</Badge>
						<p className="@min-xl/card-full:m-0 @min-xl/card-full:text-xl">
							{displayPrice(price)}/per day
						</p>
					</div>

					{/* Third row: Description */}
					<CardDescription className="@min-xl/card-full:row-start-3 @min-xl/card-full:m-0 @min-xl/card-full:text-base">
						{description}
					</CardDescription>
				</CardContent>

				{/* Mobile/Tablet Footer - hidden on desktop */}
				<CardFooter className="@max-lg/card-full:row-span-1 @min-xl/card-full:hidden">
					<CustomLink
						to={
							vanIsAvailable
								? href('/host/rentals/rent/:vanId', { vanId })
								: href('/vans/:vanId', { vanId })
						}
						className={cn(
							badgeVariants({ variant: vanIsAvailable ? type : 'UNAVAILABLE' }),
							'@max-lg/card-full:w-full',
						)}
					>
						{vanIsAvailable ? 'Rent this van' : 'Van not available'}
					</CustomLink>
				</CardFooter>
			</Card>
		</div>
	);
}
