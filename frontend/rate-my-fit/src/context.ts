import { createContext, Dispatch, SetStateAction } from 'react';
import { UserCredentials } from './types/user';

export type AuthContextType = [
    UserCredentials,
    Dispatch<SetStateAction<UserCredentials>>
];

export const AuthContext = createContext<AuthContextType | null>(null);