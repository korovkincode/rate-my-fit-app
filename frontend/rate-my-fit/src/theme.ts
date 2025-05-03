import { createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#DC343B'
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