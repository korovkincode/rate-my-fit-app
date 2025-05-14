import { APICall } from './API';

export const addFit = async (fitData: FormData) => {
    const response = await APICall({
        method: 'POST',
        path: '/fit/add',
        headers: null,
        body: fitData,
        multipart: true
    });

    return response;
};

export const getFit = async (fitID: string) => {
    const response = await APICall({
        method: 'GET',
        path: `/fit/${fitID}`,
        headers: null,
        body: null,
        multipart: false
    });

    return response;
};

export const updateFit = () => {

};

export const getUserFits = async (userID: string) => {
    const response = await APICall({
        method: 'GET',
        path: `/fit/by/${userID}`,
        headers: null,
        body: null,
        multipart: false
    });

    return response;
};

export const getAllFits = async (start: number, limit: number, sorting: string, direction: string) => {
    const response = await APICall({
        method: 'GET',
        path: `/fit/all/?start=${start}&limit=${limit}&sorting=${sorting}&direction=${direction}`,
        headers: null,
        body: null,
        multipart: false
    });

    return response;
};

export const getTotalFits = async () => {
    const response = await APICall({
        method: 'GET',
        path: '/fit/total/',
        headers: null,
        body: null,
        multipart: false
    });

    return response;
};