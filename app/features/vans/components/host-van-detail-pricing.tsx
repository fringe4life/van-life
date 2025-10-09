import type { VanModel } from '~/generated/prisma/models';
import VanPrice from './van-price';

type HostVanDetailPricingProps = {
	van: VanModel;
};

export default function HostVanDetailPricing({
	van,
}: HostVanDetailPricingProps) {
	return (
		<div className="my-4 sm:my-6">
			<VanPrice
				van={{ price: van.price, discount: van.discount, state: van.state }}
			/>
		</div>
	);
}
