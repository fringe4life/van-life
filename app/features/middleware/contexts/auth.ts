import { createContext } from 'react-router';
import type { User } from '~/types/index.server';

export const authContext = createContext<User>();
