import { keyframes } from '@emotion/react';
import Slide, { SlideProps } from '@mui/material/Slide';

export const SlideTransition = (
    props: SlideProps, direction: 'up' | 'left' | 'right' | 'down' | undefined
) => <Slide {...props} direction={direction ? direction : 'up'} />;

export const Pulse = (scale: number) => keyframes`
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(${scale});
    }
    100% {
        transform: scale(1);
    }
`;

export const BounceDown = (bounceY: number) => keyframes`
	0%, 20%, 50%, 80%, 100% {
        transform: scale(1) translateY(0);
    }
	40% {
        transform: translateY(-${bounceY}px);
    }
	60% {
        transform: translateY(-${bounceY / 2}px);
    }
`;

export const Shake = (scale: number, deg: number) => keyframes`
    30% {
        transform: scale(${scale});
    }
    40%, 60% {
        transform: rotate(-${deg}deg) scale(${scale});
    }
    50% {
        transform: rotate(${deg}deg) scale(${scale});
    }
    70% {
        transform: rotate(0deg) scale(${scale});
    }
    100% {
        transform: scale(1);
    }
`;

export const Shine = keyframes`
    0% {
        -webkit-mask-position: 120%;
        mask-position: 120%;
    }
    100% {
        -webkit-mask-position: -20%;
        mask-position: -20%;
    }
`;

export const Scanline = keyframes`
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
`;