import { SyntheticEvent, Dispatch, SetStateAction } from 'react';
import { SnackbarCloseReason } from '@mui/material';
import { Snackbar as SnackbarMUI, Alert }from '@mui/material';
import { SlideTransition } from './animations';
import { SnackbarStatus } from '../../types/UI';

interface SnackbarProps {
    status: SnackbarStatus,
    setStatus: Dispatch<SetStateAction<SnackbarStatus>>
};

const Snackbar = ({ status, setStatus }: SnackbarProps) => {
    const snackbarClose = (_?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setStatus({
            open: false, message: '', color: 'info'
        });
    };

    return (
        <SnackbarMUI
            open={status.open} autoHideDuration={3000}
            slots={{ transition: (props) => SlideTransition(props, 'up') }} onClose={snackbarClose}
        >
            <Alert
                onClose={snackbarClose}
                severity={status.color}
                variant="filled"
                sx={{ width: '100%', borderRadius: '20px', fontSize: '16px', color: 'custom.white' }}
            >
                {status.message}
            </Alert>
        </SnackbarMUI>
    );
};

export default Snackbar;