import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useJsApiLoader } from "@react-google-maps/api";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Stack,
} from "@mui/material";
import PlacesAutocomplete from "../components/PlacesAutoComplete";
import { Centers, type Center } from "../data/Centers";
import { guestUserCreation } from "../api/zenoti-api/services/zenotiService";
import { useUserDetails } from "../store/UserContext";
import { useStepper } from "../store/StepperContext";
import ResponsiveTestimonialBox from "../common/TestimonialBox";
import TestimonialBox from "../common/TestimonialBox";

// Constants moved outside component to prevent recreation
const BORDER = "#8B4513";
const RED_TEXT = "#D32F2F";
const GOOGLE_MAPS_API_KEY = import.meta.env.OLI_APP_Google_API_Key || "";
const libraries: "places"[] = ["places"];

// Utility functions moved outside component
function extractZipCode(address: string): string | null {
  const match = address.match(/\b\d{5}\b/);
  return match ? match[0] : null;
}

function getCentersByZip(zip: string): Center[] {
  if (!zip) return [];
  return Centers.filter((center) => center.zipCodes.includes(zip));
}

const generateTenDigitRandomNumber = (): number =>
  Math.floor(Math.random() * 9000000000) + 1000000000;

const Location: React.FC = () => {
  const {
    setUserDetails,
    setGuestDetails,
    setCenterDetails,
    userDetails,
    centerDetails,
  } = useUserDetails();
  const { goNext } = useStepper();
  const navigate = useNavigate();

  // Consolidated and properly typed state
  const [input, setInput] = useState<string>("");
  const [selectedCenterId, setSelectedCenterId] = useState<string>("");
  const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);

  // Memoized computations to avoid expensive recalculations
  const zip = useMemo(() => extractZipCode(input), [input]);
  const matchingCenters = useMemo(() => getCentersByZip(zip || ""), [zip]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Optimized event handlers with useCallback
  const handleCenterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCenterId(event.target.value);
    const centerinfo = matchingCenters.filter((c) =>
      c.provider_id.includes(selectedCenterId)
    );
    setCenterDetails(centerinfo[0]);
  };

  console.log("Selected Center ID:", userDetails);

  const createTempGuestUser = useCallback(
    async (center_id: string): Promise<void> => {
      const payload = {
        center_id: center_id,
        personal_info: {
          first_name: "first name",
          last_name: "last name",
          email: `user${generateTenDigitRandomNumber()}@example.com`,
          mobile_phone: {
            phone: `${generateTenDigitRandomNumber()}`,
            country_code: "+1",
          },
        },
      };

      try {
        setIsCreatingUser(true);
        const response = await guestUserCreation(payload);
        console.log("Temporary guest user created:", response);
        setGuestDetails({ user_id: response.id, ...payload });
        console.log("Temporary guest user created:", response);
      } catch (error) {
        console.error("Error creating temporary guest user:", error);
        throw error;
      } finally {
        setIsCreatingUser(false);
      }
    },
    [setGuestDetails]
  );

  const handleNextStep = useCallback(async () => {
    if (!selectedCenterId || !input.trim()) return;

    try {
      await createTempGuestUser(selectedCenterId);

      setUserDetails((prevUserDetails) => ({
        ...prevUserDetails,
        address: input.trim(),
      }));
      console.log(centerDetails);

      goNext();
      navigate("/service", {
        state: { centerId: selectedCenterId, fromPage: "location" },
      });
    } catch (error) {
      console.error("Failed to proceed to next step:", error);
    }
  }, [
    selectedCenterId,
    input,
    createTempGuestUser,
    setUserDetails,
    goNext,
    navigate,
  ]);

  if (!isLoaded) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box pt={6} pl={{ xs: 0, md: 4 }}>
      {/* Header Section */}
      <Box
        display="flex"
        alignItems={{ xs: "center", md: "start" }}
        flexDirection="column"
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

      {/* Address Input */}
      <Box width={{ xs: 520, md: 650 }} ml={{ xs: 2, md: 0 }} mt={4} mb={2}>
        <PlacesAutocomplete input={input} setInput={setInput} />
      </Box>

      {/* Center Selection */}
      <Box px={{ xs: 2.5, md: 0 }} mb={4} width={{ xs: 550, md: 600 }}>
        {zip && (
          <Paper
            elevation={1}
            sx={{
              p: 2,
              mb: 2,
              border: `2px solid ${
                matchingCenters.length > 0 ? BORDER : RED_TEXT
              }`,
              background: "#FFF7F7",
            }}
          >
            <Typography variant="subtitle1" fontWeight={700} mb={1}>
              Centers serving zip code {zip}:
            </Typography>
            <FormControl component="fieldset">
              {matchingCenters.length > 0 ? (
                <RadioGroup
                  aria-labelledby="center-selection-group"
                  name="center-selection"
                  value={selectedCenterId}
                  onChange={handleCenterChange}
                >
                  {matchingCenters.map((center: Center) => (
                    <FormControlLabel
                      key={center.provider_id}
                      value={center.provider_id}
                      control={<Radio />}
                      label={center.name}
                    />
                  ))}
                </RadioGroup>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ color: RED_TEXT, fontWeight: 600 }}
                >
                  No centers found for this zip code.
                </Typography>
              )}
            </FormControl>
          </Paper>
        )}
      </Box>

      {/* Navigation Buttons */}
      <Box>
        <Stack direction="row" spacing={1}>
          <Button
            disabled
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
            disabled={!selectedCenterId || isCreatingUser}
            size="large"
            sx={{
              textTransform: "none",
              backgroundColor: "black",
              width: { xs: "100%", md: "auto" },
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
          >
            {isCreatingUser ? "loading..." : "Next"}
          </Button>
        </Stack>
      </Box>
      <TestimonialBox currentStep={1} />
    </Box>
  );
};

export default Location;
