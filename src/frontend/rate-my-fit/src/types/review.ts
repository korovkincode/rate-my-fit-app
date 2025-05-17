import { UserCredentials } from './user';

export type Review = {
    fitID: string,
    grade: number,
    date: string,
    comment: string | null,
    reviewID: string,
    authorToken: string
};

export type Form = {
    fitID: string,
    grade: number,
    date: string,
    comment: string | null,
    userCredentials: UserCredentials
};