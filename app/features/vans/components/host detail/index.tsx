import { href } from 'react-router';
import { GenericComponent } from '~/components/generic-component';
import { Badge } from '~/components/ui/badge';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '~/components/ui/card';
import { Image } from '~/features/image/component/image';
import {
	HIGH_QUALITY_IMAGE_QUALITY,
	HOST_VAN_DETAIL_IMG_SIZES,
} from '~/features/image/img-constants';
import { createWebPSrcSet } from '~/features/image/utils/create-optimized-src-set';
import { CustomNavLink } from '~/features/navigation/components/custom-nav-link';
import type { VanDetailCardProps } from '~/features/vans/types';
import { toLowercaseVanType } from '~/features/vans/utils/validators';
import { withVanCardStyles } from '~/features/vans/utils/with-van-card-styles';
import type { Id } from '~/types';
import { cn } from '~/utils/utils';
import { VanBadge } from '../van-badge';
import { VanPrice } from '../van-price';
import { VanDetailCardContext } from './context';
import { Details } from './details';
import { Photos } from './photos';
import { Pricing } from './pricing';

const StyledCard = withVanCardStyles(Card);

const hostVanDetailNavClassName = ({
	isActive,
	isPending,
}: {
	isActive: boolean;
	isPending: boolean;
}) =>
	// biome-ignore lint/style/noNestedTernary: simply related to react routers nav links
	isPending ? 'text-green-500' : isActive ? 'underline' : '';

const renderHostVanDetailNavProps = <T extends Id>(item: T) => ({
	className: hostVanDetailNavClassName,
	...item,
});

const VanDetailCardRoot = ({
	van,
	children,
	className,
}: VanDetailCardProps) => {
	const { imageUrl, slug: vanSlug, name, type } = van;

	const navLinks = [
		{
			children: 'Details',
			end: true,
			id: 'details',
			to: href('/host/vans/:vanSlug/:action?', { action: undefined, vanSlug }),
		},
		{
			children: 'Pricing',
			id: 'pricing',
			to: href('/host/vans/:vanSlug/:action?', { action: 'pricing', vanSlug }),
		},
		{
			children: 'Photos',
			id: 'photos',
			to: href('/host/vans/:vanSlug/:action?', { action: 'photos', vanSlug }),
		},
	];

	const srcSet = createWebPSrcSet(imageUrl, {
		aspectRatio: '1:1',
		quality: HIGH_QUALITY_IMAGE_QUALITY, // Higher quality for detail view
		sizes: HOST_VAN_DETAIL_IMG_SIZES,
	});
	// Create optimized WebP srcSet with 1:1 aspect ratio for both mobile and desktop
	// since the HostVanDetailCard uses aspect-square

	return (
		<VanDetailCardContext value={van}>
			<div
				className={cn(
					'@container/detail w-full max-w-xl contain-content',
					className
				)}
			>
				<StyledCard van={van}>
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
								variant={toLowercaseVanType(type)}
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
							errorStateMessage="Something went wrong"
							items={navLinks}
							renderProps={renderHostVanDetailNavProps}
						/>
					</CardContent>
					<CardFooter className="contain-inline-size">{children}</CardFooter>
				</StyledCard>
			</div>
		</VanDetailCardContext>
	);
};

/**
 * Compound component for host van details with sub-components
 * @example
 * ```tsx
 * <VanDetailCard van={van}>
 *   <VanDetailCard.Details />
 *   <VanDetailCard.Photos />
 *   <VanDetailCard.Pricing />
 * </VanDetailCard>
 * ```
 */
const VanDetailCard = Object.assign(VanDetailCardRoot, {
	Details,
	Photos,
	Pricing,
});

export { VanDetailCard };
