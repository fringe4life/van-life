import type { Van } from '@prisma/client';
import { href } from 'react-router';
import Image from '~/components/Image';
import { Badge, badgeVariants } from '~/components/ui/badge';
import { VAN_DETAIL_IMG_SIZES } from '~/constants/constants';
import { createSrcSet } from '~/utils/createSrcSet';
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
	const srcSet = createSrcSet(VAN_DETAIL_IMG_SIZES, imageUrl);
	return (
		<div className="@container/card-full contain-content">
			<Card className="@min-md:grid @min-xl/card-full:grid-cols-2 @max-xl/card-full:grid-rows-[4fr_min-content_min-content_min-content_min-content_min-content] @min-xl/card-full:grid-rows-[min-content_min-content_1fr_1fr_max-content] @max-xl/card-full:gap-4 @min-xl/card-full:gap-x-4 ">
				<CardHeader className="@min-xl/card-full:col-span-1 @min-md/card-full:row-span-1 @min-xl/card-full:row-span-2 ">
					<Image
						className="aspect-square"
						src={imageUrl}
						alt={description}
						width="600"
						height="600"
						srcSet={srcSet}
						sizes=" (width > 500px) 500px, 300px"
					/>
				</CardHeader>
				<CardContent className="@min-xl/card-full:col-start-2 @max-xl/card-full:row-span-4 @min-xl/card-full:row-span-3 @max-xl/card-full:row-start-2 @min-xl/card-full:row-start-1 @min-xl/card-full:grid @min-xl/card-full:grid-cols-[min-content_max-content_1fr] @min-xl/card-full:grid-rows-subgrid @min-md/card-full:gap-2">
					<Badge
						className="@min-xl/card-full:row-start-1 @min-xl/card-full:m-0 @min-xl/card-full:self-end "
						variant={type}
						size="small"
					>
						{type}
					</Badge>
					<CardTitle className="@min-xl/card-full:row-start-1 @min-xl/card-full:self-end">
						{name}
					</CardTitle>
					<p className="@min-xl/card-full:row-start-1 @min-xl/card-full:self-end @min-2xl/card-full:justify-self-end">
						{displayPrice(price)}
					</p>
					<CardDescription className="@min-xl/card-full:col-span-3 @max-xl/card-full:row-span-2 @min-xl/card-full:row-start-2 @min-2xl/card-full:self-start">
						{description}
					</CardDescription>
				</CardContent>
				<CardFooter className="@min-xl/card-full:absolute @min-xl/card-full:inset-[1.5rem_1.5rem_auto_auto] @max-lg/card-full:row-span-1 ">
					<CustomLink
						to={
							vanIsAvailable
								? href('/host/rentals/rent/:vanId', { vanId })
								: href('/vans/:vanId', { vanId })
						}
						className={cn(
							badgeVariants({ variant: vanIsAvailable ? type : 'UNAVAILABLE' }),
							'@max-lg/card-full:w-full ',
						)}
					>
						{vanIsAvailable ? 'Rent this van' : 'Van not available'}
					</CustomLink>
				</CardFooter>
			</Card>
		</div>
	);
}
