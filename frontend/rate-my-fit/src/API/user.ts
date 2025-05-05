import { APICall, API_URL } from './API';
import { Form } from '../types/user';

export const addUser = async (userData: Form) => {
    const response = await APICall({
        method: 'POST',
        path: '/user/add',
        headers: null,
        body: userData,
        multipart: false
    });

    return response;
};

export const authUser = async (userData: Form) => {
    const response = await APICall({
        method: 'POST',
        path: '/user/auth',
        headers: null,
        body: userData,
        multipart: false
    });

    return response;
};

export const getUser = async (userID: string, secretToken: string | null) => {
    const response = await APICall({
        method: 'GET',
        path: `/user/${userID}`,
        headers: secretToken ? {
            secretToken: secretToken
        } : null,
        body: null,
        multipart: false
    });

    return response;
};

export const updateUser = async (userData: Form) => {
    const response = await APICall({
        method: 'PUT',
        path: '/user/update',
        headers: null,
        body: userData,
        multipart: false
    });

    return response;
};

export const getUserPfp = async (userID: string) => {
    const response = await APICall({
        method: 'GET',
        path: `/user/${userID}/pfp`,
        headers: null,
        body: null,
        multipart: false
    });

    return response;
};

export const getUserPfpDirect = async (userID: string) => {
    const pfpRequest = await getUserPfp(userID);

    if (pfpRequest.status !== 200) return 'https://i.pinimg.com/originals/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg';
    return `${API_URL}/pfp/${pfpRequest.data}`;
};