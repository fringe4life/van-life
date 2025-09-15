import type { VariantProps } from 'class-variance-authority';
import { Badge, type badgeVariants } from '~/components/ui/badge';
import { formatEnumLabel } from '~/features/vans/utils/formatEnum';
import {
	isVanNew,
	lowercaseVanStateWithProcessor,
} from '~/features/vans/utils/vanStateHelpers';
import type { VanModel } from '~/generated/prisma/models';

type Props = { van: VanModel };

function computeBadgeVariant(
	van: VanModel
): VariantProps<typeof badgeVariants>['variant'] {
	return lowercaseVanStateWithProcessor(van, (state) => {
		// Handle special case for van type when state is 'available'
		if (state === 'available') {
			return van.type.toLowerCase() as 'simple' | 'luxury' | 'rugged';
		}

		// Return the state directly for 'new', 'sale', 'repair'
		return state as 'new' | 'sale' | 'repair';
	});
}

export default function VanBadge({ van }: Props) {
	const isNewVan = isVanNew(van.createdAt);
	const shouldShowBadge =
		isNewVan || van.state === 'IN_REPAIR' || van.state === 'ON_SALE';

	if (!shouldShowBadge) {
		return null;
	}

	const variant = computeBadgeVariant(van);
	let labelRaw: string;
	if (variant === 'new') {
		labelRaw = 'NEW';
	} else if (van.state === 'AVAILABLE') {
		labelRaw = van.type;
	} else {
		labelRaw = (van.state as unknown as string) ?? 'AVAILABLE';
	}
	const label = formatEnumLabel(labelRaw);

	return (
		<Badge
			className="absolute top-4 right-4 z-10"
			title={label}
			variant={variant}
		>
			{label}
		</Badge>
	);
}
