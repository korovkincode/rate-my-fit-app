import { Box, Typography, CircularProgress, Stack } from '@mui/material';
import { keyframes } from '@emotion/react';
import CheckroomIcon from '@mui/icons-material/Checkroom';

const bounce = keyframes`
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-20px);
    }
`;

interface LoaderProps {
	loaded: boolean
};

const Loader = ({ loaded }: LoaderProps) => {
    if (loaded) return;

    return (
        <Box sx={{
			position: 'fixed', top: 0, left: 0,
			width: '100vw', height: '100vh', zIndex: 9999,
			bgcolor: 'rgba(0, 0, 0, 0.5)',
			display: 'flex', alignItems: 'center', justifyContent: 'center',
			overflow: 'hidden', backdropFilter: 'blur(10px)',
			fontFamily: '"Bebas Neue", sans-serif', color: '#fff',
        }}>
            <Stack sx={{
				position: 'relative', zIndex: 4,
				display: 'flex', alignItems: 'center', justifyContent: 'center',
				textAlign: 'center', width: '100%', maxWidth: '500px',
				padding: { xs: '20px', sm: '40px' }
			}}>
                <Box sx={{
					position: 'absolute', width: '100%', top: '-20px',
					animation: `${bounce} 1.5s ease-in-out infinite`, zIndex: 5,
                }}>
                    <CheckroomIcon sx={{
						fontSize: { xs: 50, sm: 60 }, color: '#fff'
					}} />
                </Box>
                <Typography variant="h2" sx={{
					fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '8px',
					textTransform: 'uppercase', fontSize: { xs: '32px', sm: '48px' },
					color: '#fff', opacity: 0.85, fontWeight: 700,
					mt: 2
				}}>
                    Loading The Swag
                </Typography>
                <Typography variant="subtitle2" sx={{
					fontSize: { xs: '0.65rem', sm: '0.75rem' },
					textTransform: 'uppercase', color: '#d1d1d1',
					letterSpacing: '2px',
					fontFamily: '"Share Tech Mono", monospace',
					opacity: 0.85
                }}>
                    Puttin da balenci on
                </Typography>
                <Box sx={{ mt: 4 }}>
                    <CircularProgress size={56} thickness={4} sx={{
						color: '#fff', animation: 'spin 1.5s linear infinite',
                    }} />
                </Box>
            </Stack>
        </Box>
    );
};

export default Loader;