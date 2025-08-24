import React, { useRef, useState } from "react";
import { StandaloneSearchBox } from "@react-google-maps/api";

const AddressSearchBox: React.FC = () => {
  const [address, setAddress] = useState<string>("");
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  const handlePlacesChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        setAddress(place.formatted_address || "");
        console.log("Place object:", place);

        console.log("Address:", place.formatted_address);
        console.log("Lat:", place.geometry?.location?.lat());
        console.log("Lng:", place.geometry?.location?.lng());
      }
    }
  };

  return (
    <div>
      <StandaloneSearchBox
        onLoad={(ref) => (searchBoxRef.current = ref)}
        onPlacesChanged={handlePlacesChanged}
      >
        <input
          type="text"
          placeholder="Search address..."
          style={{
            boxSizing: "border-box",
            border: "1px solid transparent",
            width: "300px",
            height: "40px",
            padding: "0 12px",
            borderRadius: "5px",
            fontSize: "16px",
            outline: "none",
            textOverflow: "ellipses",
          }}
        />
      </StandaloneSearchBox>

      {address && (
        <div style={{ marginTop: "10px" }}>
          <strong>Selected Address:</strong> {address}
        </div>
      )}
    </div>
  );
};

export default AddressSearchBox;
