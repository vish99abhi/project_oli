import {
  Box,
  Button,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import ProviderSummaryCard from "../components/ProviderSummerCard";
import { useNavigate } from "react-router-dom";
import { useStepper } from "../store/StepperContext";
import { useUserDetails } from "../store/UserContext";
import {
  confirmBooking,
  reservedSoltsBooking,
} from "../api/zenoti-api/services/zenotiService";
import { useState } from "react";

const BookingSummary = () => {
  const { goNext } = useStepper();
  const navigate = useNavigate();
  const {
    soltTime,
    userDetails,
    selectedServices,
    centerDetails,
    bookingDetails,
  } = useUserDetails();

  // Loading and error states
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log(centerDetails, "centerDetails");
  console.log(bookingDetails, "booking details");
  console.log(soltTime, "slot time data");

  const reserveBooking = async (bookingId: string) => {
    try {
      console.log("Starting booking confirmation process...");

      // Step 1: Reserve the slot
      const payload = { slot_time: soltTime.isoFormat };
      console.log("Reserving slot with payload:", payload);
      const reserveResponse = await reservedSoltsBooking(bookingId, payload);
      console.log("Slot reserved successfully:", reserveResponse);

      // Step 2: Confirm the booking
      console.log("Confirming booking...");
      const confirmResponse = await confirmBooking(bookingId);
      console.log("Booking confirmed successfully:", confirmResponse);

      return { reserveResponse, confirmResponse };
    } catch (error: any) {
      console.error("Error during booking process:", error);
      throw error;
    }
  };

  const handleBackStep = () => {
    navigate("/details");
  };

  const handleNextStep = async () => {
    // Validation
    if (!bookingDetails?.id) {
      setError("Missing booking ID. Please go back and try again.");
      return;
    }

    if (!soltTime?.isoFormat) {
      setError("Missing slot time. Please go back and select a time slot.");
      return;
    }

    setIsConfirming(true);
    setError(null);

    try {
      await reserveBooking(bookingDetails.id);

      // Only navigate on success
      goNext();
      navigate("/confirmation");
    } catch (error: any) {
      console.error("Booking confirmation failed:", error);

      // Set user-friendly error message
      if (error.response?.status === 409) {
        setError(
          "This time slot is no longer available. Please select a different time."
        );
      } else if (error.response?.status === 400) {
        setError(
          "Invalid booking data. Please check your selection and try again."
        );
      } else if (error.message?.includes("Network")) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(
          "Failed to confirm booking. Please try again or contact support."
        );
      }
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Box pt={6} pl={{ xs: 0, md: 4 }}>
      <Box
        mb={4}
        display={"flex"}
        alignItems={{ xs: "center", md: "start" }}
        flexDirection={"column"}
      >
        <Typography
          sx={{
            typography: { xs: "h4", md: "h3" },
            mr: 2,
            fontFamily: "serif !important",
            fontWeight: "bold !important",
            color: "black",
            textDecoration: "none",
          }}
        >
          Booking Summary
        </Typography>
      </Box>

      {/* Error Display */}
      {error && (
        <Box
          sx={{
            mx: { xs: 2.5, md: 0 },
            mb: 2,
            p: 2,
            bgcolor: "#ffebee",
            borderRadius: 1,
            border: "1px solid #ffcdd2",
          }}
        >
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        </Box>
      )}

      <Box px={{ xs: 2.5, md: 0 }}>
        <ProviderSummaryCard
          providerName={centerDetails?.name}
          location={userDetails?.address}
          treatment={selectedServices?.[0]?.categoryName}
          dateTime={soltTime?.displayFormat}
        />
      </Box>

      <Box px={1.6} mt={{ xs: 3, md: 1 }}>
        <Stack direction="row" spacing={1}>
          <Button
            onClick={handleBackStep}
            disabled={isConfirming} // Disable during confirmation
            sx={{
              textTransform: "none",
              color: isConfirming ? "gray" : "black",
              display: { xs: "none", md: "block" },
            }}
          >
            Back
          </Button>

          <Button
            variant="contained"
            disableElevation
            onClick={handleNextStep}
            disabled={isConfirming}
            size="large"
            sx={{
              textTransform: "none",
              backgroundColor: isConfirming ? "gray" : "black",
              width: { xs: "100%", md: "auto" },
              height: { xs: 48 },
              position: "relative",
              "&:hover": {
                backgroundColor: isConfirming ? "gray" : "#333",
              },
            }}
          >
            {isConfirming ? (
              <>
                <CircularProgress
                  size={20}
                  sx={{
                    color: "white",
                    mr: 1,
                  }}
                />
                Confirming...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </Stack>
      </Box>

      {/* Optional: Loading overlay for the entire form */}
      {isConfirming && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(255,255,255,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress sx={{ color: "#B89072", mb: 2 }} />
            <Typography
              variant="body1"
              sx={{ color: "#B89072", fontWeight: 600 }}
            >
              Processing your booking...
            </Typography>
            <Typography variant="body2" sx={{ color: "gray", mt: 1 }}>
              Please don't close this window
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default BookingSummary;
