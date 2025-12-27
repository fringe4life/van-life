import { Card, CardContent } from '~/components/ui/card';
import type { IncomeProps } from '~/features/host/types';
import { displayPrice } from '~/features/vans/utils/display-price';

const Income = ({ amount, createdAt }: IncomeProps) => (
	<Card className="contain-content">
		<CardContent>
			<p className="flex justify-between">
				<span>{displayPrice(amount)} </span>
				<span>{createdAt?.toDateString() ?? 'unknown'}</span>
			</p>
		</CardContent>
	</Card>
);

export default Income;
