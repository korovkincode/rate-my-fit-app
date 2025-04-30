import secureLocalStorage from 'react-secure-storage';
import { UserCredentials } from './types/user';
import Slide, { SlideProps } from '@mui/material/Slide';

export const getCredentials = () => {
    const storedCredentials = secureLocalStorage.getItem('userCredentials');
    if (storedCredentials === null) {
        return {
            userToken: '', secretToken: ''
        };
    }
    return storedCredentials as UserCredentials;
};

export const SlideTransition = (props: SlideProps) => <Slide {...props} direction="up" />;