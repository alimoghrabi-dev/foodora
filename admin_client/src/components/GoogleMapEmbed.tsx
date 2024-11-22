import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const GoogleMapEmbed: React.FC<{
  latitude: number;
  longitude: number;
}> = ({ latitude, longitude }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "400px" }}
      center={{ lat: latitude, lng: longitude }}
      zoom={15}
    >
      <Marker position={{ lat: latitude, lng: longitude }} />
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
};

export default GoogleMapEmbed;
