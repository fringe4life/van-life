import { Card, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';

import { Badge } from '~/components/ui/badge';
import { Link } from 'react-router';
import type { Van } from '@prisma/client';

type VanCardProps = {
	van: Van;
	link: string;
	action: React.ReactElement;
};

export default function VanCard({
	van: { type, name, description, imageUrl, id: vanId },
	link,
	action,
}: VanCardProps) {
	return (
		<div className="@container/card">
			<Card
				className="relative grid @min-md/card:grid-cols-[200px_1fr_min-content] @min-md/card:grid-rows-2 @min-md/card:gap-4"
				style={{ viewTransitionName: `card-${vanId}` }}
			>
				<CardHeader className="@min-md/card:col-start-1 @min-md/card:row-span-2">
					<img
						className="aspect-square rounded-md object-cover "
						src={imageUrl}
						alt={description}
						height={200}
					/>
				</CardHeader>
				<CardFooter className="@min-md/card:content-center  @min-md/card:grid-cols-subgrid @min-md/card:col-span-2   @min-md/card:row-span-2 @min-md/card:grid-rows-subgrid @min-md/card:col-start-2">
					<CardTitle className="text-2xl @min-md/card:col-start-2 @min-md/card:row-end-2 @min-md/card:self-start">
						<Link to={link} title={name}>
							{name}
							<span className="absolute w-full h-full inset-0 overflow-hidden"></span>
						</Link>
					</CardTitle>
					<div className="justify-self-end">{action}</div>
					<Badge className="@min-md/card:-row-end-1 " variant={type}>
						{type}
					</Badge>
				</CardFooter>
			</Card>
		</div>
	);
}
