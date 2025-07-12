import type { Van } from '@prisma/client';
import { href, NavLink } from 'react-router';
import { Badge } from '~/components/ui/badge';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '~/components/ui/card';

type VanDetailCardProps = {
	van: Van;
	children: React.ReactElement;
};

export default function VanDetailCard({
	van: { imageUrl, id: vanId, price, name, type },
	children,
}: VanDetailCardProps) {
	return (
		<div className="@container/detail max-w-xl">
			<Card className="">
				<CardHeader className="grid @min-md/detail:grid-cols-[200px_1fr] @min-xl/detail:grid-cols-[300px_1fr] @min-md/detail:gap-4">
					<div className="@min-md/detail:col-span-1 rounded-sm">
						<img
							className="block aspect-square"
							src={imageUrl}
							alt={name}
							width={300}
							height={300}
						/>
					</div>
					<div className="@min-md/detail:col-span-1 @min-md/detail:col-start-2 content-center">
						<Badge variant={type}>{type}</Badge>
						<CardTitle className="my-6 text-balance font-bold text-2xl">
							{name}
						</CardTitle>
						<p>${price}/day</p>
					</div>
				</CardHeader>
				<CardContent>
					<div className="my-6 flex gap-6">
						<NavLink
							className={({ isActive, isPending }) =>
								isPending ? 'text-green-500' : isActive ? 'underline' : ''
							}
							to={href('/host/vans/:vanId', { vanId })}
							end
						>
							Details
						</NavLink>
						<NavLink
							className={({ isActive, isPending }) =>
								isPending ? 'text-green-500' : isActive ? 'underline' : ''
							}
							to={href('/host/vans/:vanId/pricing', { vanId })}
						>
							Pricing
						</NavLink>
						<NavLink
							className={({ isActive, isPending }) =>
								isPending ? 'text-green-500' : isActive ? 'underline' : ''
							}
							to={href('/host/vans/:vanId/photos', { vanId })}
						>
							Photos
						</NavLink>
					</div>
				</CardContent>
				<CardFooter>{children}</CardFooter>
			</Card>
		</div>
	);
}
