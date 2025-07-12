import type { Van } from '@prisma/client';
import { useOutletContext } from 'react-router';
import { displayPrice } from '~/utils/displayPrice';

export default function VanDetailPricing() {
	const van = useOutletContext<Van>();
	return <p className="my-6">{displayPrice(van.price)}/day</p>;
}
