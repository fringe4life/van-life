import type { DalError } from './types';

export function getErrorMessage(error: DalError): string {
	switch (error.type) {
		case 'no-user':
			return 'User not found';
		case 'unknown-error':
			return 'An unknown error occurred';
		case 'invalid-id':
			return 'Invalid ID';
		case 'prisma-error':
			return 'A Prisma error occurred';
		default:
			// should use typescript never to handle the case
			return 'An unknown error occurred' as never;
	}
}
