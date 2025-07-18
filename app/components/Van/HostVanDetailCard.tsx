import type { Van } from '@prisma/client';
import { href } from 'react-router';
import { Badge } from '~/components/ui/badge';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '~/components/ui/card';
import CustomNavLink from '../CustomNavLink';
import Image from '../Image';

type VanDetailCardProps = {
	van: Van;
	children: React.ReactElement;
};

export default function VanDetailCard({
	van: { imageUrl, id: vanId, price, name, type },
	children,
}: VanDetailCardProps) {
	return (
		<div className="@container/detail max-w-xl contain-content">
			<Card>
				<CardHeader className="grid @min-md/detail:grid-cols-[200px_1fr] @min-xl/detail:grid-cols-[300px_1fr] @min-md/detail:gap-4">
					<Image
						className="block aspect-square"
						src={imageUrl}
						alt={name}
						width="300"
						height="300"
						classesForContainer="@min-md/detail:col-span-1 rounded-sm"
						srcSet=""
						decoding="sync"
						loading="eager"
					/>
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
						<CustomNavLink
							className={({ isActive, isPending }) =>
								isPending ? 'text-green-500' : isActive ? 'underline' : ''
							}
							to={href('/host/vans/:vanId', { vanId })}
							end
						>
							Details
						</CustomNavLink>
						<CustomNavLink
							className={({ isActive, isPending }) =>
								isPending ? 'text-green-500' : isActive ? 'underline' : ''
							}
							to={href('/host/vans/:vanId/pricing', { vanId })}
						>
							Pricing
						</CustomNavLink>
						<CustomNavLink
							className={({ isActive, isPending }) =>
								isPending ? 'text-green-500' : isActive ? 'underline' : ''
							}
							to={href('/host/vans/:vanId/photos', { vanId })}
						>
							Photos
						</CustomNavLink>
					</div>
				</CardContent>
				<CardFooter>{children}</CardFooter>
			</Card>
		</div>
	);
}
