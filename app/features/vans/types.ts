import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { VanType } from '~/generated/prisma/enums';
import type { VanModel } from '~/generated/prisma/models';
import type { Maybe, Search } from '~/types';
import type { BasePaginationParams } from '../pagination/types';

export interface TypeFilter {
	typeFilter: Exclude<Maybe<VanType>, null>;
}

export interface VanFilters {
	excludeInRepair?: boolean;
	onlyOnSale?: boolean;
	types?: string[];
}

export interface GetVansProps
	extends BasePaginationParams,
		TypeFilter,
		Search,
		VanFilters {}

export type LowercaseVanType = Lowercase<VanType>;

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

export interface VanCardProps extends VanProps {
	action: React.ReactElement;
	link: string;
	linkCoversCard?: boolean;
	state?: Record<string, unknown>;
}

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
