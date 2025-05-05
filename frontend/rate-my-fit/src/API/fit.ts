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

export const getFit = () => {

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