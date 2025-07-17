import type { Van } from '@prisma/client';
import clsx from 'clsx';
import CustomLink from '~/components/CustomLink';
import Image from '~/components/Image';
import { Badge } from '~/components/ui/badge';
import { Card, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { VAN_CARD_IMG_SIZES } from '~/constants/constants';
import { createSrcSet } from '~/utils/createSrcSet';

type VanCardProps = {
	van: Van;
	link: string;
	action: React.ReactElement;
	linkCoversCard?: boolean;
};

export default function VanCard({
	van,
	link,
	action,
	linkCoversCard = true,
}: VanCardProps) {
	const { type, name, description, imageUrl, id: vanId } = van;
	const srcSet = createSrcSet(VAN_CARD_IMG_SIZES, imageUrl);
	return (
		<div className="@container/card xs:scroll-sm scroll-md md:scroll-lg">
			<Card
				className=" relative grid @min-md/card:grid-cols-[200px_1fr_min-content] @min-md/card:grid-rows-2 @min-md/card:gap-4"
				style={{ viewTransitionName: `card-${vanId}` }}
			>
				<CardHeader className="@min-md/card:col-start-1 @min-md/card:row-span-2">
					<Image
						className="aspect-square w-full rounded-md "
						src={imageUrl}
						alt={description}
						height="200"
						width="200"
						srcSet={srcSet}
						sizes="(width > 300px) 350px, 200px"
					/>
				</CardHeader>
				<CardFooter className="@min-md/card:col-span-2 @min-md/card:col-start-2 @min-md/card:row-span-2 @min-md/card:grid-cols-subgrid @min-md/card:grid-rows-subgrid @min-md/card:content-center">
					<CardTitle className="@min-md/card:col-start-2 @min-md/card:row-end-2 @min-md/card:self-start text-2xl">
						<CustomLink to={link} title={name}>
							{name}
							<span
								className={clsx(
									linkCoversCard &&
										'absolute inset-0 h-full w-full overflow-hidden',
								)}
							></span>
						</CustomLink>
					</CardTitle>
					{action}
					<Badge className="@min-md/card:-row-end-1 " variant={type}>
						{type}
					</Badge>
				</CardFooter>
			</Card>
		</div>
	);
}
