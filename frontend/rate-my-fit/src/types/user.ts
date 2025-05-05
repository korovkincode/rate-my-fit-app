export type UserCredentials = {
    userToken: string,
    secretToken: string,
    reloader: number
};

export type Form = {
    username: string,
    password: string,
    bio: string | null
};

export type FormType = 'sign up' | 'login' | 'update';