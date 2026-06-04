import type { UUIDv7 } from '~/types/ids.server';
import type { User } from '~/types/index.server';

export type AuthenticatedUser = Omit<User, 'id'> & { id: UUIDv7 };
