import { Box, Button, Stack, Typography } from "@mui/material";
import ServiceAccordionList from "../components/ServiceList";
import { useEffect, useState } from "react";
import {
  getCategoriesByCenterId,
  getSerivcesByCenterId,
} from "../api/zenoti-api/services/zenotiService";
import { useStepper } from "../store/StepperContext";
import { useNavigate } from "react-router-dom";

const TreatmentServices = () => {
  const { goBack, goNext } = useStepper();
  const [treatmentData, setTreatmentData] = useState<object[] | null>(null);
  const navigate = useNavigate();

  const handleBackStep = () => {
    goBack();
    navigate("/");
  };
  const handleNextStep = () => {
    goNext();
    navigate("/date");
  };

  const fetchAllCategories = async () => {
    try {
      const response = await getCategoriesByCenterId(
        "bea93d09-9abf-4ab4-b428-8f5246720654"
      );
      const categories = response.categories;
      setTreatmentData(categories);
      console.log("Fetched categories:", response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchAllCategories();

    return () => {
      setTreatmentData(null);
    };
  }, []);

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
          <ServiceAccordionList categories={treatmentData} />
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
