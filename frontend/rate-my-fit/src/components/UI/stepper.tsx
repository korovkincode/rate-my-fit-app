import { Dispatch, SetStateAction } from 'react';
import { MobileStepper, Button } from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowLeft } from '@mui/icons-material';

interface StepperProps {
    length: number,
    step: number,
    stickBottom: boolean
    setter: Dispatch<SetStateAction<number>>
};

const Stepper = ({ length, step, stickBottom, setter }: StepperProps) => {
    return (
        <MobileStepper
            variant="dots" steps={length}
            activeStep={step} sx={{
                pl: 0, pr: 0, bgcolor: 'transparent', flexGrow: 1,
                ...(stickBottom && {position: 'absolute', bottom: 0})
            }}
            nextButton={
                <Button 
                    size="small" onClick={() => setter(step + 1)}
                    disabled={step === (length - 1)}
                >
                    <KeyboardArrowRight />
                </Button>
            }
            backButton={
                <Button
                    size="small" onClick={() => setter(step - 1)}
                    disabled={step === 0}
                >
                    <KeyboardArrowLeft />
                </Button>
            }
        />
    );
};

export default Stepper;