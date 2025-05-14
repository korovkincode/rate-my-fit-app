export type UserCredentials = {
    userToken: string,
    secretToken: string,
    reloader: number
};

export type User = {
    username: string,
    bio: string | null,
    totalFits: number,
    totalReviews: number,
    userToken: string | null,
    secretToken: string | null,
    password: string | null
};

export type UserPreview = {
    username: string,
    pfpLink: string
};

export type Form = {
    username: string,
    password: string,
    bio: string | null
};

export type FormType = 'sign up' | 'login' | 'update';