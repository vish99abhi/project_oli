import { Box, Button, Stack, Typography } from "@mui/material";
import BookingCalendarView from "../components/BookingCalendarView";
import { useStepper } from "../store/StepperContext";
import { useNavigate } from "react-router-dom";

const AppointmentDate = () => {
  const { goBack, goNext } = useStepper();
  const navigate = useNavigate();

  const handleBackStep = () => {
    goBack();
    navigate("/service");
  };
  const handleNextStep = () => {
    goNext();
    navigate("/details");
  };
  return (
    <Box pt={6} pl={{ xs: 0, md: 4 }}>
      <Box
        display={"flex"}
        alignItems={{ xs: "center", md: "start" }}
        flexDirection={"column"}
      >
        <Typography
          variant="body1"
          sx={{
            fontFamily: "sans-serif",
            fontWeight: 700,
            color: "#B89072",
            textDecoration: "none",
          }}
        >
          STEP 3 OF 4
        </Typography>
        <Typography
          sx={{
            typography: { xs: "h5", md: "h3" },
            mr: 2,
            fontFamily: "serif !important",
            fontWeight: "bold !important",
            color: "black",
            textDecoration: "none",
          }}
        >
          Select date & time
        </Typography>
      </Box>
      <BookingCalendarView />
      <Box>
        <Stack direction="row" spacing={1}>
          <Button
            onClick={handleBackStep}
            sx={{
              textTransform: "none",
              color: "black",
              display: { xs: "none", md: "block" },
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={handleNextStep}
            size="large"
            sx={{
              textTransform: "none",
              backgroundColor: "Black",
              width: { xs: "100%", md: "auto" },
            }}
          >
            Next
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default AppointmentDate;
