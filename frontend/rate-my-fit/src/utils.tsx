import secureLocalStorage from 'react-secure-storage';
import { UserCredentials } from './types/user';

export const getCredentials = () => {
    const storedCredentials = secureLocalStorage.getItem('userCredentials');
    if (storedCredentials === null) {
        return {
            userToken: '', secretToken: ''
        };
    }
    return storedCredentials as UserCredentials;
};

export const sleep = async (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};