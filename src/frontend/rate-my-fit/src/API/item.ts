import { APICall } from './API';
import { Form } from '../types/item';

export const addItem = async (itemData: Form) => {
    const response = await APICall({
        method: 'POST',
        path: '/item/add',
        headers: null,
        body: itemData,
        multipart: false
    });

    return response;
};

export const getItem = async (itemID: string) => {
    const response = await APICall({
        method: 'GET',
        path: `/item/${itemID}`,
        headers: null,
        body: null,
        multipart: false
    });

    return response;
};

export const updateItem = () => {

};

export const getBrandItems = () => {

};

export const getAllBrands = async () => {
    const response = await APICall({
        method: 'GET',
        path: '/item/all/brands',
        headers: null,
        body: null,
        multipart: false
    });

    return response;
};

export const searchItemName = async (itemName: string, limit: number) => {
    const response = await APICall({
        method: 'GET',
        path: `/item/search/name?itemName=${itemName}&limit=${limit}`,
        headers: null,
        body: null,
        multipart: false
    });

    return response;
};