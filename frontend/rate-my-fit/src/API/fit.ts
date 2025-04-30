import { APICall } from './API';

export const addFit = () => {

};

export const getFit = () => {

};

export const updateFit = () => {

};

export const getUserFits = async (userID: string) => {
    const response = await APICall({
        'method': 'GET',
        'path': `/fit/by/${userID}`,
        'headers': null,
        'body': null
    });

    return response;
};