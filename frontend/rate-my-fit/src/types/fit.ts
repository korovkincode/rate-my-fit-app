import { UserCredentials } from './user';

export type Fit = {
    userCredentials: UserCredentials,
    fitID: string | null,
    title: string,
    date: string,
    description: string | null,
    itemsID: string[]
};