import { Box, Button, Stack, Typography } from "@mui/material";
import ProviderSummaryCard from "../components/ProviderSummerCard";
import { useNavigate } from "react-router-dom";
import { useStepper } from "../store/StepperContext";

const BookingSummary = () => {
  const { goNext } = useStepper();
  const navigate = useNavigate();

  const handleBackStep = () => {
    // goBack();
    navigate("/details");
  };
  const handleNextStep = () => {
    goNext();
    navigate("/confirmation");
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
      <Box px={{ xs: 2.5, md: 0 }}>
        <ProviderSummaryCard />
      </Box>
      <Box px={1.6} mt={{ xs: 3, md: 1 }}>
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
              height: { xs: 48 },
            }}
          >
            Confirm
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default BookingSummary;
