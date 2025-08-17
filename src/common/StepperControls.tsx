import { Button, Stack } from '@mui/material';
import { useStepper } from '../store/StepperContext';
import { useNavigate } from 'react-router-dom';


interface StepperControlsProps {
    previousURL?: string | undefined;
    nextURL: string | undefined;
}
export function StepperControls({previousURL, nextURL}: StepperControlsProps) {
  const { currentStep, goBack, goNext, setStep, totalSteps } = useStepper();
  const isFirst = currentStep === 0;
  const isLast = typeof totalSteps === 'number' ? currentStep === totalSteps - 1 : false;
  const navigate = useNavigate();

  const handlePreviousStep = () => {
    goBack();
    navigate(previousURL? previousURL : '')
  }

  const handleNextStep = () => {
    if(isLast) {
        setStep(0);
    }
    goNext();
    navigate(nextURL ? nextURL : '')
  }

  return (
    <Stack direction="row" spacing={1}>
      <Button onClick={handlePreviousStep} disabled={isFirst} sx={{ textTransform: 'none',color: 'black' }}>
        Back
      </Button>
      <Button
        variant="contained"
        disableElevation
        onClick={handleNextStep}
        sx={{ textTransform: 'none', backgroundColor: '#B89072' }}
      >
        {isLast ? 'Finish' : 'Next'}
      </Button>
    </Stack>
  );
}
