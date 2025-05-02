import { APICall } from './API';

export const addItem = () => {

};

export const getItem = async (itemID: string) => {
    const response = await APICall({
        'method': 'GET',
        'path': `/item/${itemID}`,
        'headers': null,
        'body': null
    });

    return response;
};

export const updateItem = () => {

};

export const getBrandItems = () => {

};