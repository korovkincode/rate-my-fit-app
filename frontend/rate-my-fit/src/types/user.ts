export type UserCredentials = {
    userToken: string,
    secretToken: string
};

export type FormData = {
    username: string,
    password: string,
    previousPassword: string | null,
    bio: string | null
};

export type FormType = "signup" | "login" | "update";

export type FormStatus = {
    status: string,
    description: string
}