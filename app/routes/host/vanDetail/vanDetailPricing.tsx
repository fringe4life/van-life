import { useOutletContext } from 'react-router';
import type { VanModel } from '~/generated/prisma/models';
import { displayPrice } from '~/utils/displayPrice';

export default function VanDetailPricing() {
	const van = useOutletContext<VanModel>();
	return <p className="my-4 sm:my-6">{displayPrice(van.price)}/day</p>;
}
