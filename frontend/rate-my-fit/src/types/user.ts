export type UserCredentials = {
    userToken: string,
    secretToken: string
};

export type Form = {
    username: string,
    password: string,
    bio: string | null
};

export type FormType = 'signup' | 'login' | 'update';

export type FormStatus = {
    status: string,
    description: string
}