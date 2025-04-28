import { APICall } from './API';
import { Form } from '../types/user';

export const signupUser = async (userData: Form) => {
    const response = await APICall({
        path: '/user/add',
        method: 'POST',
        headers: null,
        body: userData
    });

    return response;
};

export const loginUser = async (userData: Form) => {
    const response = await APICall({
        path: '/user/auth',
        method: 'POST',
        headers: null,
        body: userData
    });

    return response;
};

export const updateUser = async (userData: Form) => {
    const response = await APICall({
        path: '/user/update',
        method: 'PUT',
        headers: null,
        body: userData
    });

    return response;
};