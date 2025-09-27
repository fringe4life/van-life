import { createContext } from 'react-router';
import type { Session } from '~/types/types.server';

export const authContext = createContext<Session>();
