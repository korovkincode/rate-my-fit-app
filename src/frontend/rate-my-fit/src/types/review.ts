import { UserCredentials, UserPreview } from './user';

export type Review = {
  fitID: string,
  grade: number,
  date: string,
  comment: string | null,
  reviewID: string,
  authorToken: string,
  author: UserPreview
};

export type Form = {
  fitID: string,
  grade: number,
  date: string,
  comment: string | null,
  userCredentials: UserCredentials
};