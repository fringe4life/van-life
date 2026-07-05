import { VAN_TYPE_LOWERCASE } from '~/features/vans/constants/van-types';
import type { LowercaseVanType } from '~/features/vans/types';
import { FilterCheckboxRow } from './filter-checkbox-row';

interface VanTypeFilterRowProps {
	baseId: string;
	onToggle: (type: LowercaseVanType) => void;
	type: LowercaseVanType;
	types: LowercaseVanType[];
}

const VanTypeFilterRow = ({
	baseId,
	type,
	types,
	onToggle,
}: VanTypeFilterRowProps) => {
	const handleCheckedChange = () => {
		onToggle(type);
	};

	return (
		<FilterCheckboxRow
			checked={types.includes(type)}
			id={`${baseId}-van-filter-type-${type}`}
			label={type}
			labelClassName="capitalize"
			onCheckedChange={handleCheckedChange}
		/>
	);
};

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
			<VanTypeFilterRow
				baseId={baseId}
				key={type}
				onToggle={onToggle}
				type={type}
				types={types}
			/>
		))}
	</div>
);

export { VanTypeFilterSection };
