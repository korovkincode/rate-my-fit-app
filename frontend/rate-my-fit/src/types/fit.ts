export type Fit = {
    fitID: string,
    title: string,
    description: string | null,
    date: string,
    itemsID: string[],
    authorToken: string,
    picnames: string[]
};

export type Form = {
    title: string,
    description: string | null,
    pics: File[],
    itemsID: string[]
};

export type FormType = 'add' | 'update';