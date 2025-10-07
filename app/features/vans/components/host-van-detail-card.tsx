import { href } from 'react-router';
import GenericComponent from '~/components/generic-component';
import { Badge } from '~/components/ui/badge';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '~/components/ui/card';
import Image from '~/features/image/component/image';
import {
	HIGH_QUALITY_IMAGE_QUALITY,
	HOST_VAN_DETAIL_IMG_SIZES,
} from '~/features/image/img-constants';
import { createWebPSrcSet } from '~/features/image/utils/create-optimized-src-set';
import CustomNavLink from '~/features/navigation/components/custom-nav-link';
import { getVanStateStyles } from '~/features/vans/utils/van-state-styles';
import type { VanModel } from '~/generated/prisma/models';
import { cn } from '~/utils/utils';
import { validateLowercaseVanType } from '~/utils/validators';
import VanBadge from './van-badge';
import VanPrice from './van-price';

type VanDetailCardProps = {
	van: VanModel;
} & React.ComponentProps<'div'>;

export default function VanDetailCard({
	van,
	children,
	className,
}: VanDetailCardProps) {
	const { imageUrl, slug: vanSlug, name, type } = van;

	const navLinks = [
		{
			label: 'Details',
			to: href('/host/vans/:vanSlug', { vanSlug }),
			end: true,
		},
		{
			label: 'Pricing',
			to: href('/host/vans/:vanSlug/pricing', { vanSlug }),
		},
		{
			label: 'Photos',
			to: href('/host/vans/:vanSlug/photos', { vanSlug }),
		},
	];

	const srcSet = createWebPSrcSet(imageUrl, {
		sizes: HOST_VAN_DETAIL_IMG_SIZES,
		aspectRatio: '1:1',
		quality: HIGH_QUALITY_IMAGE_QUALITY, // Higher quality for detail view
	});
	// Create optimized WebP srcSet with 1:1 aspect ratio for both mobile and desktop
	// since the HostVanDetailCard uses aspect-square

	// Get van state styling
	const { dataSlot, className: vanStateClasses } = getVanStateStyles(van);

	return (
		<div
			className={cn(
				'@container/detail w-full max-w-xl contain-content',
				className
			)}
		>
			<Card className={vanStateClasses} data-slot={dataSlot}>
				<CardHeader className="grid @min-md/detail:grid-cols-[200px_1fr] @min-xl/detail:grid-cols-[300px_1fr] grid-cols-1 @min-md/detail:grid-rows-[200px_1fr] @min-xl/detail:grid-rows-[300px_1fr] @min-md/detail:gap-x-4">
					<div className="relative">
						<VanBadge van={van} />
						<Image
							alt={name}
							classesForContainer="aspect-square"
							className="aspect-square @min-md/detail:w-auto w-full rounded-sm"
							decoding="sync"
							height="300"
							loading="eager"
							sizes="(min-width: 1280px) 300px, (min-width: 768px) 200px, 400px"
							src={imageUrl}
							srcSet={srcSet}
							width="300"
						/>
					</div>
					<div className="@min-md/detail:col-span-1 @min-md/detail:col-start-2 content-center">
						<Badge
							className="@max-md/detail:mt-4"
							variant={validateLowercaseVanType(type.toLowerCase())}
						>
							{type}
						</Badge>
						<CardTitle className="my-6 text-balance font-bold text-2xl">
							{name}
						</CardTitle>
						<VanPrice van={van} />
					</div>
				</CardHeader>
				<CardContent>
					<GenericComponent
						Component={CustomNavLink}
						className="my-6 flex gap-6"
						emptyStateMessage=""
						items={navLinks}
						renderKey={(item) => item.label}
						renderProps={(item) => ({
							className: ({
								isActive,
								isPending,
							}: {
								isActive: boolean;
								isPending: boolean;
							}) =>
								// biome-ignore lint/style/noNestedTernary: simply related to react routers nav links
								isPending ? 'text-green-500' : isActive ? 'underline' : '',
							to: item.to,
							end: item.end,
							children: item.label,
						})}
					/>
				</CardContent>
				<CardFooter className="contain-inline-size">{children}</CardFooter>
			</Card>
		</div>
	);
}
