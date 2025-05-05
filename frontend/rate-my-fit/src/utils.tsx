import secureLocalStorage from 'react-secure-storage';
import { UserCredentials } from './types/user';
import { Item } from './types/item';

export const getCredentials = () => {
    const storedCredentials = secureLocalStorage.getItem('userCredentials');
    if (storedCredentials === null) {
        return {
            userToken: '', secretToken: '', reloader: 0
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

export const getTotal = (items: Item[]) => {
    let total = 0;
    items.forEach(item => total += item.price);
    return total;
}

export const capitalize = (s: string) => {
    return s[0].toUpperCase() + s.slice(1);
}

export const lastElement = (a: Array<any>) => {
    return a[a.length - 1];
}

export const formatNumber = (n: number) => {
    return `${Math.floor(n / 10)}${n % 10}`;
}

export const getTodayDate = () => {
    const date = new Date();
    const day = formatNumber(date.getDate())
    const month = formatNumber(date.getMonth());

    return `${day}-${month}-${date.getFullYear()}`;
}