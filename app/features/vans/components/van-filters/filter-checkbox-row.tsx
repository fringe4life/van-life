import { Checkbox } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';
import { cn } from '~/utils/utils';

interface FilterCheckboxRowProps {
	checked: boolean;
	className?: string;
	id: string;
	label: string;
	labelClassName?: string;
	onCheckedChange: (checked: boolean) => void;
}

const FilterCheckboxRow = ({
	id,
	label,
	checked,
	onCheckedChange,
	className,
	labelClassName,
}: FilterCheckboxRowProps) => (
	<div
		className={cn('flex items-center gap-2 rounded-sm px-2 py-1.5', className)}
	>
		<Checkbox
			checked={checked}
			id={id}
			onCheckedChange={(value) => onCheckedChange(value === true)}
		/>
		<Label
			className={cn('cursor-pointer font-normal', labelClassName)}
			htmlFor={id}
		>
			{label}
		</Label>
	</div>
);

export { FilterCheckboxRow };
