import { href } from 'react-router';
import { CustomLink } from '~/features/navigation/components/custom-link';
import { displayPrice } from '~/features/vans/utils/display-price';
import { cn } from '~/utils/utils';

interface HostIncomeSectionProps {
	elapsedDays: number;
	isBalancePending: boolean;
	name: string | null | undefined;
	optimisticBalance: number;
	sumIncome: number;
}

const HostIncomeSection = ({
	name,
	sumIncome,
	elapsedDays,
	optimisticBalance,
	isBalancePending,
}: HostIncomeSectionProps) => (
	<div className="full-layout grid grid-cols-min items-center justify-between gap-x-2 bg-orange-100 py-6 sm:py-9">
		<h2 className="col-start-1 font-bold text-2xl text-neutral-900 sm:text-3xl md:text-4xl">
			Welcome, {name ? name : 'User'}!
		</h2>
		<div className="col-start-1 my-4 grid grid-cols-[1fr_min-content] grid-rows-2 items-center justify-between gap-4 font-light text-base text-neutral-600">
			<p className="font-light text-sm sm:font-normal sm:text-base">
				Income last{' '}
				<span className="underline sm:font-medium">{elapsedDays} days</span>
			</p>
			<p className="justify-self-end font-semibold text-neutral-900 text-xl xs:text-3xl sm:font-bold sm:text-4xl md:font-extrabold md:text-5xl">
				{displayPrice(sumIncome)}
			</p>

			<p className="text-sm sm:text-base">Balance</p>
			<p
				className={cn(
					'justify-self-end font-semibold text-neutral-90 text-xl0 xs:text-3xl sm:font-bold sm:text-4xl md:font-extrabold md:text-5xl',
					!!isBalancePending && 'opacity-75'
				)}
			>
				{displayPrice(optimisticBalance)}
			</p>
		</div>
		<CustomLink className="col-start-2 row-start-2" to={href('/host/income')}>
			Details
		</CustomLink>
	</div>
);

export { HostIncomeSection };
