import { Box, Typography } from "@mui/material";
import { StepperControls } from "../common/StepperControls";
import ServiceAccordionList from "../components/ServiceList";
import { useEffect, useState } from "react";
import { getSerivcesByCenterId } from "../api/zenoti-api/services/zenotiService";

const TreatmentServices = () => {
  const [treatment, setTreatment] = useState<object[] | null>(null);

  const getTreatmentData = async () => {
    try 
    {
      const data = await getSerivcesByCenterId("568fdbef-f527-40f9-a428-34a57383dab4");
      console.log(data);
    } catch (error) {
      console.error("Error fetching treatment data:", error);
    }
  }

  useEffect(() => {
    getTreatmentData();

    return () => { setTreatment(null); };
  },[])
  
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
