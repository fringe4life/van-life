import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { VanState, VanType } from '~/generated/prisma/enums';
import type { VanModel } from '~/generated/prisma/models';
import type { Maybe, Prettify, Search } from '~/types';
import type { BasePaginationParams } from '../pagination/types';

interface TypeFilter {
	typeFilter: Prettify<Exclude<Maybe<VanType>, null>>;
}

interface VanFilters {
	excludeInRepair?: boolean;
	onlyOnSale?: boolean;
	types?: string[];
}

export type GetVansProps = Prettify<
	BasePaginationParams & TypeFilter & Search & VanFilters
>;

/** Lowercase enum value; suffix after `_` when present, else whole value. */
type LowercaseEnumValue<T extends string> =
	T extends `${string}_${infer Suffix}` ? Lowercase<Suffix> : Lowercase<T>;

/** Canonical lowercase van type. */
export type LowercaseVanType = Lowercase<VanType>;

/** Canonical lowercase van state, including runtime-only `new`. */
export type LowercaseVanState = LowercaseEnumValue<VanState> | 'new';

export type VanCardDataSlot = `van-card-${LowercaseVanState}`;
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

export type VanCardProps = Prettify<
	VanProps & {
		action: React.ReactElement;
		link: string;
		linkCoversCard?: boolean;
		state?: Record<string, unknown>;
	}
>;

export interface PendingVan {
	clientKey: string;
	description: string;
	discount: number;
	id: string;
	imageUrl: string;
	name: string;
	price: number;
	slug: string;
	status: 'pending';
	type: VanType;
}

export type HostVanListItem = VanModel | PendingVan;

export function isPendingVan(item: HostVanListItem): item is PendingVan {
	return 'status' in item && item.status === 'pending';
}
