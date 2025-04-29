import { useEffect, useState } from 'react';
import { UserCredentials } from '../types/user';
import secureLocalStorage from 'react-secure-storage';
import { getCredentials } from '../utils';

export const useCredentials = () => {
    const [userCredentials, setUserCredentials] = useState<UserCredentials>(getCredentials());

    useEffect(() => {
        secureLocalStorage.setItem('userCredentials', userCredentials);
    }, [userCredentials, setUserCredentials]);

    return [userCredentials, setUserCredentials] as const;
}