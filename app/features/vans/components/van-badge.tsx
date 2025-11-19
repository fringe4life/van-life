import { Badge } from '~/components/ui/badge';
import { formatEnumLabel } from '~/features/vans/utils/format-enum';
import { lowercaseVanStateWithProcessor } from '~/features/vans/utils/van-state-helpers';
import type { VanModel } from '~/generated/prisma/models';

type Props = { van: VanModel };

/**
 * Badge component that displays van state (NEW, ON_SALE, IN_REPAIR).
 * Visibility controlled by CSS based on parent Card's data-slot attribute.
 * Hidden by default, shown only for new/sale/repair states via Tailwind has-* variants.
 */
export default function VanBadge({ van }: Props) {
	const variant = lowercaseVanStateWithProcessor(van, (state) => {
		// Handle special case for van type when state is 'available'
		if (state === 'available') {
			return van.type.toLowerCase() as 'simple' | 'luxury' | 'rugged';
		}

		// Return the state directly for 'new', 'sale', 'repair'
		return state as 'new' | 'sale' | 'repair';
	});

	// Determine label based on variant
	let labelRaw: string;
	if (variant === 'new') {
		labelRaw = 'NEW';
	} else if (van.state === 'available') {
		labelRaw = van.type;
	} else {
		labelRaw = (van.state as unknown as string) ?? 'AVAILABLE';
	}
	const label = formatEnumLabel(labelRaw);

	return (
		<Badge
			className="van-badge absolute top-4 right-4 z-10 hidden group-data-[slot=van-card-new]:block group-data-[slot=van-card-repair]:block group-data-[slot=van-card-sale]:block"
			title={label}
			variant={variant}
		>
			{label}
		</Badge>
	);
}
