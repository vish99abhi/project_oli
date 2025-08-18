import { Box, Typography } from "@mui/material";
import { StepperControls } from "../common/StepperControls";
import ServiceAccordionList from "../components/ServiceList";

const TreatmentServices = () => {
  return (
    <>
      <Box pt={6} pl={{xs: 0, md: 4}}>
        <Box display={'flex'} alignItems={{xs:'center', md: 'start'}} flexDirection={'column'}>
            <Typography
          variant="body1"
          sx={{
            fontFamily: "sans-serif",
            fontWeight: 700,
            color: "#B89072",
            textDecoration: "none",
          }}
        >
          STEP 2 OF 4
        </Typography>
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
          Choose your treatment
        </Typography>
        </Box>
        <Box>
         <ServiceAccordionList />
        </Box>
        <Box px={1.6}>
            <StepperControls previousURL="/" nextURL="/date" />
        </Box>
      </Box>
    </>
  );
};

export default TreatmentServices;
