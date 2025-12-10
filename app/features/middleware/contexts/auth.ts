import { createContext } from 'react-router';
import type { User } from '~/types/types.server';

export const authContext = createContext<User>();
