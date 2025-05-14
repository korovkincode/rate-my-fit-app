export type Item = {
    itemID: string,
    brand: string,
    name: string,
    img: string,
    price: number,
    category: string | null
};

export type Form = {
    brand: string,
    name: string,
    img: string,
    price: number,
    category: string | null
};

export type FormType = 'add' | 'update';