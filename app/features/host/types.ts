import type { Amount, Maybe, Prettify } from '~/types';

export type DataArray = Prettify<{ name: string } & Amount>[];

export interface Data<T> {
	data: T;
}

export interface Params {
	action?: Maybe<string>;
	vanSlug: string;
}
