import React, { useState, useEffect, useMemo } from "react";
import {
  Autocomplete as MUIAutocomplete,
  TextField,
  InputAdornment,
  Paper,
  type AutocompleteChangeReason,
  type AutocompleteChangeDetails,
  Box,
} from "@mui/material";
import { type SyntheticEvent } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface Prediction {
  description: string;
  place_id: string;
  main_text?: string;
  secondary_text?: string;
}

interface PlaceDetails {
  lat: number;
  lng: number;
  pincode: string;
  country: string;
  city: string;
  address: string;
  formattedAddressWithZip?: string;
}

interface PlacesAutocompleteProps {
  input: any;
  setInput: React.Dispatch<any>;
}

const BORDER = "#8B4513";
const BORDER_HOVER = "#6E3610";
const BORDER_FOCUS = "#B89072";

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  input,
  setInput,
}) => {
  // const [input, setInput] = useState("");
  const [options, setOptions] = useState<Prediction[]>([]);
  const [details, setDetails] = useState<PlaceDetails | null>(null);
  const [selectedValue, setSelectedValue] = useState<
    Prediction | string | null
  >(null);
  const [displayValue, setDisplayValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const autocompleteService = useMemo(() => {
    if (typeof window !== "undefined" && window.google) {
      return new window.google.maps.places.AutocompleteService();
    }
    return null;
  }, []);

  useEffect(() => {
    if (!autocompleteService || input === "") {
      setOptions([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      autocompleteService.getPlacePredictions({ input }, (predictions) => {
        if (predictions) {
          setOptions(
            predictions.map((p) => ({
              description: p.description,
              place_id: p.place_id,
              main_text: p.structured_formatting?.main_text,
              secondary_text: p.structured_formatting?.secondary_text,
            }))
          );
        } else {
          setOptions([]);
        }
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [input, autocompleteService]);

  const handlePlaceSelect = (
    event: SyntheticEvent<Element, Event>,
    value: string | Prediction | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<Prediction> | undefined
  ) => {
    console.log("Selected value:", value, "Reason:", reason);
    setSelectedValue(value);

    if (
      !value ||
      typeof value === "string" ||
      !value.place_id ||
      !window.google
    ) {
      setDetails(null);
      setDisplayValue(typeof value === "string" ? value : "");
      setIsOpen(false);
      return;
    }

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails(
      {
        placeId: value.place_id,
        fields: ["address_components", "formatted_address", "geometry"],
      },
      (place: any, status: any) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          place
        ) {
          const lat = place.geometry?.location?.lat();
          const lng = place.geometry?.location?.lng();

          let pincode = "";
          let country = "";
          let countryCode = "";
          let city = "";

          if (place.address_components) {
            for (const comp of place.address_components) {
              if (comp.types.includes("postal_code")) {
                pincode = comp.long_name;
              }
              if (comp.types.includes("country")) {
                country = comp.long_name;
                countryCode = comp.short_name;
              }
              if (comp.types.includes("locality")) {
                city = comp.long_name;
              } else if (
                !city &&
                comp.types.includes("administrative_area_level_2")
              ) {
                city = comp.long_name;
              }
            }
          }

          // Check if zipcode and country are already in the formatted address
          const formattedAddress = place.formatted_address;
          let customFormattedAddress = formattedAddress;

          // Only add zipcode if it's not already present and exists
          if (pincode && !formattedAddress.includes(pincode)) {
            customFormattedAddress += `, ${pincode}`;
          }

          // Only add country if it's not already present and exists
          if (
            country &&
            !formattedAddress.includes(country) &&
            !formattedAddress.includes(countryCode)
          ) {
            customFormattedAddress += `, ${country}`;
          }

          const placeDetails = {
            lat,
            lng,
            pincode,
            country,
            city,
            address: place.formatted_address,
            formattedAddressWithZip: customFormattedAddress,
          };

          setDetails(placeDetails);
          setDisplayValue(customFormattedAddress);
          setInput(customFormattedAddress);
          setIsOpen(false);
        } else {
          console.error("Error fetching place details:", status);
          setDetails(null);
        }
      }
    );
  };

  const handleInputChange = (
    event: SyntheticEvent<Element, Event>,
    value: string,
    reason: string
  ) => {
    setInput(value);
    setDisplayValue(value);

    // Open dropdown when user starts typing
    if (reason === "input" && value.length > 0) {
      setIsOpen(true);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600 }}>
      <MUIAutocomplete
        freeSolo
        open={isOpen && options.length > 0}
        onOpen={handleOpen}
        onClose={handleClose}
        options={options}
        value={selectedValue}
        inputValue={displayValue || input}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.description
        }
        onInputChange={handleInputChange}
        onChange={handlePlaceSelect}
        filterOptions={(options) => options} // Disable built-in filtering
        PaperComponent={({ children }) => (
          <Paper
            elevation={3}
            sx={{
              borderRadius: 2,
              mt: 1,
              border: `1px solid ${BORDER}`,
              "& .MuiAutocomplete-listbox": {
                padding: 0,
              },
            }}
          >
            {children}
          </Paper>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Enter location"
            variant="outlined"
            fullWidth
            onClick={() => {
              // Handle click on empty input
              if (!input || input.trim() === "") {
                setIsOpen(false);
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#ffffff",
                border: `1px solid ${BORDER}`,
                fontSize: "16px",
                fontWeight: 400,
                color: "#374151",
                paddingRight: "12px",
                transition:
                  "border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  borderColor: BORDER_HOVER,
                },
                "&.Mui-focused": {
                  borderColor: BORDER_FOCUS,
                  boxShadow: `0 0 0 3px ${BORDER_FOCUS}33`,
                },
                "&.Mui-focused:hover": {
                  borderColor: BORDER_FOCUS,
                },
                "& fieldset": {
                  border: "none",
                },
              },
              "& .MuiOutlinedInput-input": {
                padding: "16px 16px",
                fontSize: "16px",
                "&::placeholder": {
                  color: "#9ca3af",
                  opacity: 1,
                },
              },
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end" sx={{ marginRight: "8px" }}>
                  <LocationOnIcon
                    sx={{
                      color: BORDER,
                      fontSize: "20px",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            key={typeof option === "string" ? option : option.place_id}
            sx={{
              padding: "12px 16px",
              borderBottom: "1px solid #f3f4f6",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: `${BORDER_FOCUS}20`,
              },
              "&:last-child": {
                borderBottom: "none",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <LocationOnIcon
                sx={{
                  color: BORDER,
                  marginRight: 2,
                  fontSize: "18px",
                }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    fontWeight: 500,
                    fontSize: "16px",
                    color: "#111827",
                    lineHeight: 1.2,
                  }}
                >
                  {typeof option === "string" ? option : option.main_text}
                </Box>
                {typeof option !== "string" && option.secondary_text && (
                  <Box
                    sx={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginTop: "2px",
                      lineHeight: 1.2,
                    }}
                  >
                    {option.secondary_text}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}
        sx={{
          "& .MuiAutocomplete-popupIndicator": {
            display: "none",
          },
          "& .MuiAutocomplete-clearIndicator": {
            display: "none",
          },
        }}
      />

      {/* {details && (
        <Box
          sx={{
            marginTop: 2,
            padding: 2,
            backgroundColor: "#f8fafc",
            borderRadius: 2,
            border: `1px solid ${BORDER_FOCUS}`,
          }}
        >
          <Box
            sx={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 1,
              color: "#1e293b",
            }}
          >
            Selected Location:
          </Box>
          <Box sx={{ fontSize: 14, color: "#475569", marginBottom: 1 }}>
            {details.formattedAddressWithZip}
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              fontSize: 14,
              color: "#64748b",
              flexWrap: "wrap",
            }}
          >
            <Box>
              <strong>Zip:</strong> {details.pincode || "N/A"}
            </Box>
            <Box>
              <strong>City:</strong> {details.city || "N/A"}
            </Box>
            <Box>
              <strong>Country:</strong> {details.country || "N/A"}
            </Box>
          </Box>
        </Box>
      )} */}
    </Box>
  );
};

export default PlacesAutocomplete;
