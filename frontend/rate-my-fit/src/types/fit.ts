import { UserCredentials } from './user';

export type Fit = {
    userCredentials: UserCredentials | null,
    fitID: string | null,
    title: string,
    date: string,
    description: string | null,
    itemsID: string[],
    authorToken: string | null,
    picnames: string[] | null
};