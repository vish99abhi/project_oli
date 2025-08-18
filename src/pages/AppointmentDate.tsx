import { Box, Typography } from "@mui/material";
import { StepperControls } from "../common/StepperControls";
import BookingCalendarView from "../components/BookingCalendarView";

const AppointmentDate = () => {
  return (
    <Box  pt={6} pl={{xs: 0, md: 4}}>
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
        <StepperControls previousURL="/service" nextURL="/details" />
      </Box>
    </Box>
  );
};

export default AppointmentDate;
