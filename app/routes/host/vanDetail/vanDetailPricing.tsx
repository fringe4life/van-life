import { useOutletContext } from 'react-router';
import VanPrice from '~/features/vans/components/van-price';
import type { VanModel } from '~/generated/prisma/models';

export default function VanDetailPricing() {
	const van = useOutletContext<VanModel>();
	return (
		<div className="my-4 sm:my-6">
			<VanPrice
				van={{ price: van.price, discount: van.discount, state: van.state }}
			/>
		</div>
	);
}
