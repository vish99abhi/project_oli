import { Box, Button, Stack, Typography } from "@mui/material";
import BookingCalendarView from "../components/BookingCalendarView";
import { useStepper } from "../store/StepperContext";
import { useNavigate } from "react-router-dom";
import { useUserDetails } from "../store/UserContext";
import { useState } from "react";

const AppointmentDate = () => {
  const { goBack, goNext } = useStepper();
  const { setSlotTime } = useUserDetails();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  console.log("Selected Date:", selectedDate);
  console.log("Selected Slot ID:", selectedSlotId);

  const navigate = useNavigate();

  // Helper function to format date as "Sep 10 2025"
  const formatSlotTime = (selectedDate: any, selectedSlotId: any) => {
    // Format date as "Sep 10, 2025"
    const displayDate = selectedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    // Format display string: "Sep 10, 2025, 9:00 AM - 9:30 AM"
    const displayFormat = `${displayDate}, ${selectedSlotId.start} - ${selectedSlotId.end}`;

    // Convert start time to 24-hour format for ISO (LOCAL TIME, not UTC)
    const convertTo24Hour = (timeStr: any) => {
      const [time, period] = timeStr.split(" ");
      const [hours, minutes] = time.split(":").map(Number);

      let hour24 = hours;
      if (period === "PM" && hours !== 12) {
        hour24 += 12;
      } else if (period === "AM" && hours === 12) {
        hour24 = 0;
      }

      return { hour: hour24, minute: minutes };
    };

    const { hour, minute } = convertTo24Hour(selectedSlotId.start);

    // Create ISO format in LOCAL TIME: "2025-09-10T09:00:00"
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const hourStr = String(hour).padStart(2, "0");
    const minuteStr = String(minute).padStart(2, "0");

    const isoFormat = `${year}-${month}-${day}T${hourStr}:${minuteStr}:00`;

    return {
      displayFormat,
      isoFormat,
    };
  };
  // Usage in your handleNextStep function:
  const handleNextStep = () => {
    if (!selectedDate || !selectedSlotId) {
      alert("Please select a date and time slot");
      return;
    }

    const formattedTime = formatSlotTime(selectedDate, selectedSlotId);
    console.log(formattedTime);
    // Output:
    // {
    //   displayFormat: "Sep 10 2025, 9:00 AM - 9:30 AM",
    //   isoFormat: "2025-09-10T09:00:00"
    // }

    setSlotTime(formattedTime);

    goNext();
    navigate("/details");
  };

  const handleBackStep = () => {
    goBack();
    navigate("/service");
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

      <BookingCalendarView
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedSlotId={selectedSlotId}
        setSelectedSlotId={setSelectedSlotId}
      />

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
