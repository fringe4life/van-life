import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * @abstract capitalizes the first letter and makes rest of string passed in lowercase
 * @param str the string to capitalize
 * @returns the string which is now capitalized
 */
export function capitalize(str: string) {
	return `${str[0].toUpperCase()}${str.substring(1).toLowerCase()}`;
}

/**
 * @abstract determines if an array has any items
 * @param list an array of items
 * @returns true if array is empty
 */
export function isEmptyList<T extends { length: number }>(list: T): boolean {
	return list.length === 0;
}
