import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
    interface PaletteOptions {
        custom?: {
            black: string;
            white: string;
            gray: string;
            pink: string;
        };
    }
};

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#000000'
        },
        primary: {
            'main': '#FFFFFF',
        },
        custom: {
            black: '#000000',
            white: '#FFFFFF',
            gray: '#7A7A7A',
            pink: '#D65076'
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
        }
    },
});

export default theme;