import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * @abstract determines if an array has any items
 * @param list an array of items
 * @returns true if array is empty
 */
export function isEmptyList<T extends { length: number }>(list: T): boolean {
	return list.length === 0;
}
