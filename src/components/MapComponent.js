import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const MapComponent = ({ center, places }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // use your key
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
      {/* Show markers for each place */}
      {places &&
        places.map((place, index) => (
          <Marker
            key={index}
            position={{
              lat: place.point.lat,
              lng: place.point.lon,
            }}
          />
        ))}
    </GoogleMap>
  );
};

export default MapComponent;
