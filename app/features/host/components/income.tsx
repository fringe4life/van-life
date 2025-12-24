import { Card, CardContent } from '~/components/ui/card';
import { displayPrice } from '~/features/vans/utils/display-price';

interface IncomeProps {
	id: string;
	amount: number;
	createdAt: Date;
}

const Income = ({ amount, createdAt }: IncomeProps) => (
	<Card className="contain-content">
		<CardContent>
			<p className="flex justify-between">
				<span>{displayPrice(amount)} </span>
				<span>
					{!!createdAt && !Number.isNaN(createdAt)
						? createdAt.toDateString()
						: 'unknown'}
				</span>
			</p>
		</CardContent>
	</Card>
);

export default Income;
