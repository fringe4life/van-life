import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { VanType } from '~/generated/prisma/enums';
import type { VanModel } from '~/generated/prisma/models';
import type { Maybe } from '~/types/types';

export type MaybeTypeFilter = Exclude<Maybe<VanType>, null>;

export type LowercaseVanType = Lowercase<VanType>;

// Type for badge variants (includes outline and unavailable)
export type BadgeVariant = LowercaseVanType | 'outline' | 'unavailable';

// Type for nuqs parser that includes empty string
export type VanTypeOrEmpty = LowercaseVanType | '';

interface VanProps {
	van: VanModel;
}

export type WithVanCardStylesProps = ComponentPropsWithoutRef<'div'> &
	VanProps & {
		children?: ReactNode;
	};

export interface VanBadgeProps extends VanProps {}

export interface VanPriceProps extends VanProps {}

export type VanDetailCardProps = VanProps & ComponentPropsWithoutRef<'div'>;
