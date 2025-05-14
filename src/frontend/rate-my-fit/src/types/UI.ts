export type FormStatus = {
    status: string | null,
    description: string | null
};

export type SnackbarStatus = {
    open: boolean,
    message: string,
    color: 'info' | 'success' | 'warning' | 'error'
};

export type Sort = 'Date' | 'Popularity' | 'Grade' | 'Price';