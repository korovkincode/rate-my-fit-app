import { Dispatch, SetStateAction } from 'react';
import { MobileStepper, Button } from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowLeft } from '@mui/icons-material';

const Stepper = ({ length, step, setter }: { length: number, step: number, setter: Dispatch<SetStateAction<number>> }) => {
    return (
        <MobileStepper
            variant="dots" steps={length} position="static"
            activeStep={step} sx={{ bgcolor: 'transparent', flexGrow: 1 }}
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
    )
};

export default Stepper;