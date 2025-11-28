import { createContext, use } from 'react';
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
import { withVanCardStyles } from '~/features/vans/utils/with-van-card-styles';
import type { VanModel } from '~/generated/prisma/models';
import { cn } from '~/utils/utils';
import { toLowercaseVanType } from '~/utils/validators';
import VanBadge from './van-badge';
import VanPrice from './van-price';

const StyledCard = withVanCardStyles(Card);

/**
 * Context for sharing van data within VanDetailCard compound component
 */
const VanDetailCardContext = createContext<VanModel | null>(null);

function useVanDetailCard() {
	const van = use(VanDetailCardContext);
	if (!van) {
		throw new Error(
			'VanDetailCard compound components must be used within VanDetailCard'
		);
	}
	return van;
}

type VanDetailCardProps = {
	van: VanModel;
} & React.ComponentProps<'div'>;

function VanDetailCardRoot({ van, children, className }: VanDetailCardProps) {
	const { imageUrl, slug: vanSlug, name, type } = van;

	const navLinks = [
		{
			children: 'Details',
			to: href('/host/vans/:vanSlug?/:action?', { vanSlug }),
			end: true,
		},
		{
			children: 'Pricing',
			to: href('/host/vans/:vanSlug?/:action?', { vanSlug, action: 'pricing' }),
		},
		{
			children: 'Photos',
			to: href('/host/vans/:vanSlug?/:action?', { vanSlug, action: 'photos' }),
		},
	];

	const srcSet = createWebPSrcSet(imageUrl, {
		sizes: HOST_VAN_DETAIL_IMG_SIZES,
		aspectRatio: '1:1',
		quality: HIGH_QUALITY_IMAGE_QUALITY, // Higher quality for detail view
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
							items={navLinks}
							renderKey={(item) => item.children}
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
								...item,
							})}
						/>
					</CardContent>
					<CardFooter className="contain-inline-size">{children}</CardFooter>
				</StyledCard>
			</div>
		</VanDetailCardContext>
	);
}

/**
 * Details sub-component - displays van name, category, and description
 */
function Details() {
	const van = useVanDetailCard();
	const { name, type, description } = van;

	return (
		<article>
			<p className="font-bold">
				Name: <span className="font-normal">{name}</span>
			</p>
			<p className="my-4 font-bold">
				Category: <span className="font-normal capitalize">{type}</span>
			</p>
			<p className="min-w-full max-w-3xs font-bold">
				Description: <span className="font-normal">{description}</span>
			</p>
		</article>
	);
}

/**
 * Photos sub-component - displays van image
 */
function Photos() {
	const van = useVanDetailCard();

	return (
		<Image
			alt={van.name}
			className="aspect-square rounded-md"
			height="100"
			src={van.imageUrl}
			srcSet=""
			width="100"
		/>
	);
}

/**
 * Pricing sub-component - displays van price with discount
 */
function Pricing() {
	const van = useVanDetailCard();

	return (
		<div className="my-4 sm:my-6">
			<VanPrice
				van={{ price: van.price, discount: van.discount, state: van.state }}
			/>
		</div>
	);
}

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

export default VanDetailCard;
