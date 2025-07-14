import type { Van } from '@prisma/client';
import { href } from 'react-router';
import Image from '~/components/Image.client';
import { Badge, badgeVariants } from '~/components/ui/badge';
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
	return (
		<div className="@container/card-full max-w-lg">
			<Card className="@max-2xl/card-full:grid @max-2xl/card-full:grid-rows-[4fr_repeat(4,_auto)_auto] @max-2xl/card-full:gap-4 ">
				<CardHeader className="h-full max-h-lg w-full max-w-lg">
					<Image
						className="aspect-square"
						src={imageUrl}
						alt={description}
						width="500"
						height="500"
					/>
				</CardHeader>
				<CardContent className="@max-2xl/card-full:row-span-4 @max-2xl/card-full:row-start-2 @max-2xl/card-full:grid-rows-subgrid @max-2xl/card-full:align-between">
					<Badge className="mt-6 mb-5" variant={type}>
						{type}
					</Badge>
					<CardTitle>{name}</CardTitle>
					<p className="my-2">{price}</p>
					<CardDescription>{description}</CardDescription>
				</CardContent>
				<CardFooter>
					<CustomLink
						to={
							vanIsAvailable
								? href('/host/rentals/:vanId', { vanId })
								: href('/vans/:vanId', { vanId })
						}
						className={cn(
							badgeVariants({ variant: vanIsAvailable ? type : 'UNAVAILABLE' }),
							'@max-lg/card-full:w-full',
						)}
					>
						{vanIsAvailable ? 'Rent this van' : 'Not available'}
					</CustomLink>
				</CardFooter>
			</Card>
		</div>
	);
}
