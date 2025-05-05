import { UserCredentials } from './user';

export type Fit = {
    userCredentials: UserCredentials | null,
    fitID: string | null,
    title: string,
    description: string | null,
    date: string,
    itemsID: string[],
    authorToken: string | null,
    picnames: string[] | null
};

export type Form = {
    title: string,
    description: string | null,
    pics: File[]
}

export type FormType = 'add' | 'update';