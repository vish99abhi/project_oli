import {
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useUserDetails } from "../store/UserContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStepper } from "../store/StepperContext";
import { useJsApiLoader } from "@react-google-maps/api";
import AddressSearchBox from "../components/AddressSearchBox";
import PlacesAutocomplete from "../components/PlacesAutoComplete";


const libraries: ("places")[] = ["places"];
const Location = () => {
  // const BORDER = "#8B4513";
  // const BORDER_HOVER = "#6E3610";
  // const BORDER_FOCUS = "#B89072";
  const { setUserDetails } = useUserDetails();
  const { goNext } = useStepper();
  const [address, setAddress] = useState("");
  const navigate = useNavigate();


   const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDP6ueoK8vJD2KTAsIxETW07TRHyf0Ar_I',
    libraries,
  });

  const handleNextStep = () => {
    setUserDetails((prevUserDetails) => ({
      ...prevUserDetails,
      address: address.trim(),
    }));
    goNext();
    navigate("/service");
  };

  if (!isLoaded) return <div>Loading...</div>;

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
          STEP 1 OF 4
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
          Enter your address
        </Typography>
      </Box>
      <Box width={{ sx: 250, md: 650 }} py={4}>
        { <PlacesAutocomplete />}
      </Box>
      <Box>
        <Stack direction="row" spacing={1}>
          <Button
            disabled={true}
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

export default Location;
