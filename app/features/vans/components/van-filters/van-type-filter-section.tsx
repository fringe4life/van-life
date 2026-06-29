import { VAN_TYPE_LOWERCASE } from '~/features/vans/constants/van-types';
import type { LowercaseVanType } from '~/features/vans/types';
import { FilterCheckboxRow } from './filter-checkbox-row';

interface VanTypeFilterSectionProps {
	baseId: string;
	onToggle: (type: LowercaseVanType) => void;
	types: LowercaseVanType[];
}

const VanTypeFilterSection = ({
	baseId,
	types,
	onToggle,
}: VanTypeFilterSectionProps) => (
	<div className="p-1">
		<p className="px-2 py-1.5 font-medium text-sm">Van Types</p>
		{VAN_TYPE_LOWERCASE.map((type) => (
			<FilterCheckboxRow
				checked={types.includes(type)}
				id={`${baseId}-van-filter-type-${type}`}
				key={type}
				label={type}
				labelClassName="capitalize"
				onCheckedChange={onToggle.bind(null, type)}
			/>
		))}
	</div>
);

export { VanTypeFilterSection };
