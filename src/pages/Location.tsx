import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useUserDetails } from "../store/UserContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStepper } from "../store/StepperContext";
import { useJsApiLoader } from "@react-google-maps/api";
import PlacesAutocomplete from "../components/PlacesAutoComplete";
import { Centers, type Center } from "../data/Centers";

const libraries: "places"[] = ["places"];

function extractZipCode(address: string): string | null {
  const match = address.match(/\b\d{5}\b/);
  return match ? match[0] : null;
}

function getCentersByZip(zip: string): Center[] {
  if (!zip) return [];
  return Centers.filter((center) => center.zipCodes.includes(zip));
}

const Location = () => {
  // const BORDER = "#8B4513";
  // const BORDER_HOVER = "#6E3610";
  // const BORDER_FOCUS = "#B89072";
  const GREEN_BORDER = "#4CAF50";
  const RED_TEXT = "#D32F2F";
  const { setUserDetails } = useUserDetails();
  const { goNext } = useStepper();
  const [address, setAddress] = useState<any>("");
  const navigate = useNavigate();
  const [input, setInput] = useState<any>("");

  console.log(extractZipCode(input), "zip code");
  console.log(getCentersByZip(extractZipCode(input) || ""), "centers");
  const zip = extractZipCode(input);
  const matchingCenters = getCentersByZip(zip || "");
  console.log(matchingCenters, "matching centers");

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDP6ueoK8vJD2KTAsIxETW07TRHyf0Ar_I",
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

  useEffect(() => {
    // fetchAllCategories();
  }, []);

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
        <PlacesAutocomplete input={input} setInput={setInput} />
      </Box>
      <Box px={{ xs: 2.5, md: 0 }} mb={4} width={{ sx: 250, md: 600 }}>
        {/* Center List UI */}
        {zip && (
          <Paper
            elevation={1}
            sx={{
              p: 2,
              mb: 2,
              border: `2px solid ${
                matchingCenters.length > 0 ? GREEN_BORDER : RED_TEXT
              }`,
              background: matchingCenters.length > 0 ? "#F7FFF7" : "#FFF7F7",
            }}
          >
            <Typography variant="subtitle1" fontWeight={700} mb={1}>
              Centers serving zip code {zip}:
            </Typography>
            {matchingCenters.length > 0 ? (
              <List dense>
                {matchingCenters.map((center, idx) => (
                  <ListItem key={center.provider_id}>
                    <ListItemText
                      primary={
                        <span>
                          <b>{idx + 1}.</b> {center.name}
                        </span>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography
                variant="body2"
                sx={{ color: RED_TEXT, fontWeight: 600 }}
              >
                No centers found for this zip code.
              </Typography>
            )}
          </Paper>
        )}
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
