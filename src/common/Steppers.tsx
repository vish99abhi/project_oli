import * as React from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import type { StepIconProps } from "@mui/material/StepIcon";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PersonIcon from "@mui/icons-material/Person";
import { useStepper } from "../store/StepperContext";

const BROWN = "#B89072";
const BORDER_BROWN = "#C8AE98";
const LIGHT_LINE = "#E9E3DE";
const ICON_SIZE = 30;
const LINE_THICKNESS = 2;

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 14,
    left: `calc(-50% + ${ICON_SIZE / 2}px)`,
    right: `calc(50% + ${ICON_SIZE / 2}px)`,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: BROWN,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: BROWN,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: LIGHT_LINE,
    borderRadius: LINE_THICKNESS / 2,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme }) => ({
  zIndex: 1,
  color: BROWN,
  width: 40,
  height: 40,
  display: "flex",
  borderRadius: "50%",
  backgroundColor: "white",
  justifyContent: "center",
  border: `0.6px solid ${BORDER_BROWN}`,
  alignItems: "center",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
    borderColor: BROWN,
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundColor: BROWN,
        borderColor: BROWN,
        color: "white",
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundColor: BROWN,
        borderColor: BROWN,
        color: "white",
        boxShadow: "none",
      },
    },
  ],
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;
  const iconSx = { fontSize: 23 };
  const icons: { [index: string]: React.ReactElement<unknown> } = {
    1: <LocationOnIcon sx={iconSx} />,
    2: <VaccinesIcon sx={iconSx} />,
    3: <DateRangeIcon sx={iconSx} />,
    4: <PersonIcon sx={iconSx} />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = ['Location', 'Service', 'Date', 'Details'];

export default function Steppers() {
  const { currentStep } = useStepper();
  return (
    <Stack sx={{ width: "100%" }}>
      <Stepper
        activeStep={currentStep}
        connector={<ColorlibConnector />}
        sx={{
          "& .MuiStep-root": { padding: 0 },
          "& .MuiStepLabel-root": { margin: 0 },
          "& .MuiStepLabel-iconContainer": { padding: 0 },
          "& .MuiStepConnector-root": { top: (ICON_SIZE - 2) / 2 },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{ "& .MuiStepLabel-label": { display: "none" } }}
              StepIconComponent={ColorlibStepIcon}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
}
