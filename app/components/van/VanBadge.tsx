import type { VariantProps } from 'class-variance-authority';
import { Badge, type badgeVariants } from '~/components/ui/badge';
import type { VanState } from '~/generated/prisma/enums';
import type { VanModel } from '~/generated/prisma/models';
import { formatEnumLabel } from '~/utils/formatEnum';

type Props = { van: VanModel };

function isNew(createdAt: VanModel['createdAt']): boolean {
	const now = new Date();
	const sixMonthsAgo = new Date(
		now.getFullYear(),
		now.getMonth() - 6,
		now.getDate(),
	);
	return new Date(createdAt) > sixMonthsAgo;
}

function computeBadgeVariant(
	state: VanState,
	vanType: VanModel['type'],
	createdAt: VanModel['createdAt'],
): VariantProps<typeof badgeVariants>['variant'] {
	if (isNew(createdAt)) return 'new';
	switch (state) {
		case 'ON_SALE':
			return 'sale';
		case 'IN_REPAIR':
			return 'repair';
		default:
			return vanType.toLowerCase() as 'simple' | 'luxury' | 'rugged';
	}
}

export default function VanBadge({ van }: Props) {
	const isNewVan = isNew(van.createdAt);
	const shouldShowBadge =
		isNewVan || van.state === 'IN_REPAIR' || van.state === 'ON_SALE';

	if (!shouldShowBadge) {
		return null;
	}

	const variant = computeBadgeVariant(
		van.state as VanState,
		van.type,
		van.createdAt,
	);
	const labelRaw: string =
		variant === 'new'
			? 'NEW'
			: van.state === 'AVAILABLE'
				? van.type
				: ((van.state as unknown as string) ?? 'AVAILABLE');
	const label = formatEnumLabel(labelRaw);

	return (
		<Badge
			className="absolute top-4 right-4 z-10"
			variant={variant}
			title={label}
		>
			{label}
		</Badge>
	);
}
