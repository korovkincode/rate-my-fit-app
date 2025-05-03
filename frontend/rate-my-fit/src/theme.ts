import { createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#000000'
        },
        primary: {
            'main': '#FFFFFF',
            'dark': '#000000',
        }
    },
    components: {
        MuiAvatar: {
            styleOverrides: {
                img: {
                    objectFit: 'contain',
                    height: '100%',
                },
            },
        },
    },
});

export default theme;