import { createContext } from 'react-router';
import type { AuthenticatedUser } from '~/types/auth.server';

export const authContext = createContext<AuthenticatedUser>();
