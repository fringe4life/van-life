import type { Prisma } from '~/generated/prisma/client';

export type DalError =
	| { type: 'no-user' }
	| { type: 'unknown-error'; e: unknown }
	| { type: 'invalid-id'; id: string }
	| { type: 'prisma-error'; e: Prisma.PrismaClientKnownRequestError };

export type DalReturn<T, E extends DalError> =
	| { data: T; success: true; error: null }
	| { success: false; data: null; error: E };
