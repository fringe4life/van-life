import type { Direction } from '~/types/types';

export const DEFAULT_LIMIT = 10;
export const DEFAULT_FILTER = '';
export const DEFAULT_CURSOR = '';
export const DEFAULT_DIRECTION = 'forward';

export const LIMITS = [5, 10, 20, 50] as const;
export const DIRECTIONS = ['forward', 'backward'] satisfies Direction[];
