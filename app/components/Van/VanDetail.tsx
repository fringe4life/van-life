import type { Van } from '@prisma/client';
import { href, Link } from 'react-router';
import { Badge } from '~/components/ui/badge';
import { cn } from '~/utils/utils';
import { badgeVariants } from '../ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../ui/card';

export default function VanDetail({
	imageUrl,
	description,
	type,
	name,
	price,
}: Van) {
	return (
		<div className="@container/card-full">
			<Card className="@max-2xl/card-full:grid @max-2xl/card-full:grid-rows-[4fr_repeat(4,_auto)_auto] @max-2xl/card-full:gap-4 ">
				<CardHeader>
					<img src={imageUrl} alt={description} width={200} height={200} />
				</CardHeader>
				<CardContent className=" @max-2xl/card-full:row-span-4  @max-2xl/card-full:grid-rows-subgrid @max-2xl/card-full:row-start-2  @max-2xl/card-full:align-between">
					<Badge color={type}>{type}</Badge>
					<CardTitle>{name}</CardTitle>
					<p>{price}</p>
					<CardDescription>{description}</CardDescription>
				</CardContent>
				<CardFooter>
					<Link
						className={cn(
							badgeVariants({ variant: type }),
							'@max-lg/card-full:w-full',
						)}
						to={href('/')}
					>
						Rent this van
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}
