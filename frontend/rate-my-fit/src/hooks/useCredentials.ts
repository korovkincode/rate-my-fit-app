import { useEffect, useState } from 'react';
import { UserCredentials } from '../types/user';
import secureLocalStorage from 'react-secure-storage';

export const useCredentials = () => {
    const [userCredentials, setUserCredentials] = useState<UserCredentials>(() => {
        const storedCredentials = secureLocalStorage.getItem('userCredentials');
        if (storedCredentials === null) {
            return {
                userToken: '', secretToken: ''
            };
        }
        return storedCredentials as UserCredentials;
    });

    useEffect(() => {
        secureLocalStorage.setItem('userCredentials', userCredentials);
    }, [userCredentials, setUserCredentials]);

    return [userCredentials, setUserCredentials] as const;
}