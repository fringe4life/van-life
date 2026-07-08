import { Badge } from '~/components/ui/badge';
import type { BadgeVariantProps } from '~/components/ui/badge-variants';
import { formatEnumLabel } from '~/features/vans/utils/format-enum';
import { lowercaseVanStateWithProcessor } from '~/features/vans/utils/van-state-helpers';
import { VanState } from '~/generated/prisma/enums';
import type { VanProps } from '../types';
import { toLowercaseVanType } from '../utils/validators';

interface VanBadgeProps extends VanProps {}
/**
 * Badge component that displays van state (NEW, ON_SALE, IN_REPAIR).
 * Visibility controlled by CSS based on parent Card's data-slot attribute.
 * Hidden by default, shown only for new/sale/repair states via Tailwind has-* variants.
 */
const VanBadge = ({ van }: VanBadgeProps) => {
	const variant = lowercaseVanStateWithProcessor(
		van,
		(state): NonNullable<BadgeVariantProps['variant']> => {
			if (state === 'available') {
				return toLowercaseVanType(van.type);
			}

			return state;
		}
	);

	// Determine label based on variant
	let labelRaw: string;
	if (variant === 'new') {
		labelRaw = 'NEW';
	} else if (van.state === VanState.AVAILABLE) {
		labelRaw = van.type;
	} else {
		labelRaw = van.state ?? 'AVAILABLE';
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
};

export { VanBadge };
