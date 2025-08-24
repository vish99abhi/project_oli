import { Box, Typography } from "@mui/material";
import { StepperControls } from "../common/StepperControls";
import ProviderSummaryCard from "../components/ProviderSummerCard";

const BookingSummary = () => {

    return (
        <>
        <Box pt={6} pl={{xs: 0, md: 4}}>
        <Box display={'flex'} alignItems={{xs:'center', md: 'start'}} flexDirection={'column'}>
        <Typography
          sx={{
            typography: { xs: 'h5', md: 'h3'},
            mr: 2,
            fontFamily: "serif !important",
            fontWeight: 'bold !important',
            color: "black",
            textDecoration: "none",
          }}
        >
          Booking Summary
        </Typography>
        </Box>
        <Box>
            <ProviderSummaryCard />
        </Box>
        <Box px={1.6}>
            <StepperControls previousURL="/date"  nextURL="/confirmation" />
        </Box>
        </Box>
        </>
    )

}

export default BookingSummary;