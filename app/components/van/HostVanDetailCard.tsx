import { href } from 'react-router';
import { Badge } from '~/components/ui/badge';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '~/components/ui/card';
import { HOST_VAN_DETAIL_IMG_SIZES } from '~/constants/imgConstants';
import type { VanModel } from '~/generated/prisma/models';
import type { LowercaseVanType } from '~/types/types';
import { createResponsiveSrcSet } from '~/utils/createSrcSet';
import Image from '../common/Image';
import CustomNavLink from '../navigation/CustomNavLink';

type VanDetailCardProps = {
	van: VanModel;
	children: React.ReactElement;
};

export default function VanDetailCard({
	van: { imageUrl, id: vanId, price, name, type },
	children,
}: VanDetailCardProps) {
	// Create responsive srcSet with 1:1 aspect ratio for both mobile and desktop
	// since the HostVanDetailCard uses aspect-square
	const srcSet = createResponsiveSrcSet(
		imageUrl,
		HOST_VAN_DETAIL_IMG_SIZES, // mobile sizes
		HOST_VAN_DETAIL_IMG_SIZES, // desktop sizes (same as mobile)
		1, // mobile aspect ratio (1:1 = square)
		1, // desktop aspect ratio (1:1 = square)
	);

	return (
		<div className="@container/detail max-w-xl contain-content">
			<Card>
				<CardHeader className="grid @min-md/detail:grid-cols-[200px_1fr] @min-xl/detail:grid-cols-[300px_1fr] grid-cols-1 @min-md/detail:grid-rows-[200px_1fr] @min-xl/detail:grid-rows-[300px_1fr] @min-md/detail:gap-x-4">
					<Image
						className="aspect-square @min-md/detail:w-auto w-full rounded-sm"
						src={imageUrl}
						alt={name}
						width="300"
						height="300"
						// classesForContainer="@min-md/detail:col-span-1"
						srcSet={srcSet}
						sizes="(min-width: 1280px) 300px, (min-width: 768px) 200px, 400px"
						decoding="sync"
						loading="eager"
					/>
					<div className="@min-md/detail:col-span-1 @min-md/detail:col-start-2 content-center">
						<Badge
							variant={type.toLowerCase() as LowercaseVanType}
							className="@max-md/detail:mt-4"
						>
							{type}
						</Badge>
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
				<CardFooter className="contain-inline-size">{children}</CardFooter>
			</Card>
		</div>
	);
}
