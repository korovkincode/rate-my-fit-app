import { keyframes } from '@emotion/react';

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