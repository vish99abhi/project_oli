import { Box, Button, Stack, Typography } from "@mui/material";
import ServiceAccordionList from "../components/ServiceList";
import { useEffect, useState } from "react";
import { getCategoriesByCenterId } from "../api/zenoti-api/services/zenotiService";
import { useStepper } from "../store/StepperContext";
import { useNavigate } from "react-router-dom";
import { useUserDetails } from "../store/UserContext";

const TreatmentServices = () => {
  const { goBack, goNext } = useStepper();
  const { selectedServices, setSelectedServices, centerDetails } =
    useUserDetails();
  const [treatmentData, setTreatmentData] = useState<object[] | null>(null);
  const navigate = useNavigate();

  console.log("Selected Services in TreatmentServices:", selectedServices);

  const handleBackStep = () => {
    goBack();
    navigate("/");
  };
  const handleNextStep = () => {
    goNext();
    navigate("/date");
  };

  const fetchAllCategories = async (center_id: string) => {
    try {
      const response = await getCategoriesByCenterId(center_id);
      const categories = response.categories;
      setTreatmentData(categories);
      console.log("Fetched categories:", response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchAllCategories(centerDetails?.provider_id);
    return () => {
      setTreatmentData(null);
    };
  }, [centerDetails?.provider_id, centerDetails]);

  return (
    <>
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
            STEP 2 OF 4
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
            Choose your treatment
          </Typography>
        </Box>
        <Box>
          <ServiceAccordionList
            categories={treatmentData}
            center_id={centerDetails?.provider_id}
            setSelectedServices={setSelectedServices}
          />
        </Box>
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
    </>
  );
};

export default TreatmentServices;
