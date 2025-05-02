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

export const getPfpToken = (pfpLink: string) => {
    const pfpToken = pfpLink?.split('/').pop();
    return pfpToken?.slice(0, pfpToken.indexOf('.'));
};

export const formatDate = (date: string) => {
    const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [day, month, year] = date.split('-');
    return `${monthName[Number(month) - 1]} ${Number(day)}, ${year}`;
}