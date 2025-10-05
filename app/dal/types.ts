import type { Prisma } from '~/generated/prisma/client';

export type DalError =
	| { type: 'no-user' }
	| { type: 'unknown-error'; e: unknown }
	| { type: 'invalid-id'; id: string }
	| { type: 'prisma-error'; e: Prisma.PrismaClientKnownRequestError }
	| null;

export type DalFailue<E extends DalError = DalError> = {
	success: false;
	data: null;
	error: E;
};

export type DalSuccess<T> = {
	success: true;
	data: T;
	error: null;
};

export type DalReturn<T, E extends DalError = DalError> =
	| DalSuccess<T>
	| DalFailue<E>;
