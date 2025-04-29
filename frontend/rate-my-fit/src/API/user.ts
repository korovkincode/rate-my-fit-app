import { APICall } from './API';
import { Form } from '../types/user';

export const signupUser = async (userData: Form) => {
    const response = await APICall({
        method: 'POST',
        path: '/user/add',
        headers: null,
        body: userData
    });

    return response;
};

export const loginUser = async (userData: Form) => {
    const response = await APICall({
        method: 'POST',
        path: '/user/auth',
        headers: null,
        body: userData
    });

    return response;
};

export const getUser = async (userID: string, secretToken: string | null) => {
    const response = await APICall({
        method: 'GET',
        path: `/user/get/${userID}`,
        headers: {
            secretToken: secretToken
        },
        body: null
    });

    return response;
};

export const updateUser = async (userData: Form) => {
    const response = await APICall({
        method: 'PUT',
        path: '/user/update',
        headers: null,
        body: userData
    });

    return response;
};