import { displayPrice } from '~/features/vans/utils/display-price';
import { getDiscountedPrice } from '~/utils/pricing';
import type { VanPriceProps } from '../types';

const VanPrice = ({ van: { price, discount } }: VanPriceProps) => {
	const discountedPrice = getDiscountedPrice(price, discount);
	const hasDiscount = discountedPrice < price;
	const priceToDisplay = displayPrice(price);

	if (hasDiscount) {
		return (
			<div className="flex items-baseline gap-2">
				<span className="text-neutral-500 line-through">{priceToDisplay}</span>
				<span className="font-bold text-xl">
					{displayPrice(discountedPrice)}
				</span>
				<span>/day</span>
			</div>
		);
	}

	return (
		<span className="@min-xl/card-full:text-xl">
			{priceToDisplay} <span>/day</span>
		</span>
	);
};

export { VanPrice };
