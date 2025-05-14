import { Box, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import { motion, AnimatePresence } from 'framer-motion';

const shine = keyframes`
    0% { background-position: 200% center; }
    100% { background-position: -200% center; }
`;

const MotionBox = motion(Box);

const ShinyText = styled(Typography)(() => ({
    fontSize: 'clamp(2.5rem, 8vw, 6rem)',
    fontWeight: 800,
    textAlign: 'center',
    background: 'linear-gradient(to right, #ffffff, #999999, #ffffff)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: `${shine} 2.5s linear infinite`,
}));

const Hero = () => {
    return (
        <AnimatePresence>
            <MotionBox
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.95 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                sx={{
                    width: '100%', minHeight: {xs: '30vh', sm: '45vh'},
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', alignItems: 'center',
                    bgcolor: 'black', px: 2
                }}
            >
                <ShinyText>
                    Let &apos;em Know U Fly
                </ShinyText>
            </MotionBox>
        </AnimatePresence>
    );
};

export default Hero;