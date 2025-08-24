import React, { useState, useEffect, useMemo } from "react";
import {
  Autocomplete as MUIAutocomplete,
  TextField,
  InputAdornment,
  Paper,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface Prediction {
  description: string;
  place_id: string;
}


const PlacesAutocomplete: React.FC = () => {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<Prediction[]>([]);
  const [details, setDetails] = useState<any>(null);

  console.log("Rendering PlacesAutocomplete with details:", details);

  const autocompleteService = useMemo(() => {
    if (window.google) {
      return new window.google.maps.places.AutocompleteService();
    }
    return null;
  }, []);

  useEffect(() => {
    if (!autocompleteService || input === "") {
      setOptions([]);
      return;
    }

    autocompleteService.getPlacePredictions(
      { input },
      (predictions) => {
        if (predictions) {
          setOptions(
            predictions.map((p) => ({
              description: p.description,
              place_id: p.place_id,
            }))
          );
        } else {
          setOptions([]);
        }
      }
    );
  }, [input, autocompleteService]);

  // Fetch place details when a place is selected
  const handlePlaceSelect = (event: any, value: any) => {
    if (!value || !value.place_id || !window.google) return;
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails({ placeId: value.place_id }, (place: any, status: any) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
        // Extract lat/lng
        const lat = place.geometry?.location?.lat();
        const lng = place.geometry?.location?.lng();
        // Extract pincode (postal_code), country, city
        let pincode = "";
        let country = "";
        let city = "";
        if (place.address_components) {
          for (const comp of place.address_components) {
            if (comp.types.includes("postal_code")) {
              pincode = comp.long_name;
            }
            if (comp.types.includes("country")) {
              country = comp.long_name;
            }
            // City can be 'locality' or 'administrative_area_level_2' (fallback)
            if (comp.types.includes("locality")) {
              city = comp.long_name;
            } else if (!city && comp.types.includes("administrative_area_level_2")) {
              city = comp.long_name;
            }
          }
        }
        setDetails({ lat, lng, pincode, country, city, address: place.formatted_address });
      } else {
        setDetails(null);
      }
    });
  };

  return (
    <>
      <MUIAutocomplete
        freeSolo
        options={options}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.description
        }
        onInputChange={(_, value) => setInput(value)}
        onChange={handlePlaceSelect}
        PaperComponent={({ children }) => (
          <Paper
            style={{ borderRadius: 8, boxShadow: "0px 2px 8px rgba(0,0,0,0.15)" }}
          >
            {children}
          </Paper>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Search address"
            sx={{
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                paddingRight: 1,
                backgroundColor: "#fff",
                boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
              },
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  <LocationOnIcon sx={{ color: "#555" }} />
                </InputAdornment>
              ),
            }}
          />
        )}
        renderOption={(props, option) => {
          const label = typeof option === "string" ? option : option.description;
          return (
            <li {...props} key={typeof option === "string" ? option : option.place_id}>
              {label}
            </li>
          );
        }}
      />

      {/* {details && (
        <div style={{ marginTop: 12, fontSize: 14 }}>
          <div><b>Address:</b> {details.address}</div>
          <div><b>Pincode:</b> {details.pincode}</div>
          <div><b>City:</b> {details.city}</div>
          <div><b>Country:</b> {details.country}</div>
          <div><b>Latitude:</b> {details.lat}</div>
          <div><b>Longitude:</b> {details.lng}</div>
        </div>
      )} */}

      <div style={{ fontSize: "12px", color: "gray", marginTop: "4px" }}>
        Powered by Google 
      </div>
    </>
  );
};

export default PlacesAutocomplete;
