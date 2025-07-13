import { displayPrice } from '~/utils/displayPrice';
import { Card, CardContent } from './ui/card';

type IncomeProps = {
	id: string;
	amount: number;
	rentedAt: Date;
};

export default function Income({ amount, rentedAt }: IncomeProps) {
	return (
		<Card>
			<CardContent>
				<p className="flex justify-between">
					<span>{displayPrice(amount)} </span>
					<span>
						{rentedAt && !Number.isNaN(rentedAt)
							? rentedAt.toLocaleString()
							: 'unknown'}
					</span>
				</p>
			</CardContent>
		</Card>
	);
}
