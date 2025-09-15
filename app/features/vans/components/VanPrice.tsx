import { displayPrice } from '~/features/vans/utils/displayPrice';
import type { VanModel } from '~/generated/prisma/models';
import { getDiscountedPrice } from '~/utils/pricing';

type Props = { van: Pick<VanModel, 'price' | 'discount' | 'state'> };

export default function VanPrice({ van }: Props) {
	const discounted = getDiscountedPrice(van.price, van.discount ?? 0);
	const hasDiscount = (van.discount ?? 0) > 0 && discounted < van.price;

	return hasDiscount ? (
		<div className="flex items-baseline gap-2">
			<span className="text-neutral-500 line-through">
				{displayPrice(van.price)}
			</span>
			<span className="font-bold text-xl">{displayPrice(discounted)}</span>
			<span>/day</span>
		</div>
	) : (
		<span className="@min-xl/card-full:text-xl">
			{displayPrice(van.price)} <span>/day</span>
		</span>
	);
}
