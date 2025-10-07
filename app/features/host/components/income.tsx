import { Card, CardContent } from '~/components/ui/card';
import { displayPrice } from '~/features/vans/utils/display-price';

type IncomeProps = {
	id: string;
	amount: number;
	createdAt: Date;
};

export default function Income({ amount, createdAt }: IncomeProps) {
	return (
		<Card className="contain-content">
			<CardContent>
				<p className="flex justify-between">
					<span>{displayPrice(amount)} </span>
					<span>
						{createdAt && !Number.isNaN(createdAt)
							? createdAt.toDateString()
							: 'unknown'}
					</span>
				</p>
			</CardContent>
		</Card>
	);
}
