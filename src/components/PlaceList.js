import React, { useState, useEffect } from "react";

const API_KEY = "5ae2e3f221c38a28845f05b6af0c7225e2f2f63935c08b5cf7dfc6de";

const PlacesList = ({ lat, lon }) => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    if (lat && lon) {
      fetchPlaces(lat, lon);
    }
  }, [lat, lon]);

  async function fetchPlaces(lat, lon) {
    const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=5000&lon=${lon}&lat=${lat}&apikey=${API_KEY}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      setPlaces(data.features || []);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  }

  return (
    <div>
      <h2>Nearby Places</h2>
      <ul>
        {places.length > 0 ? (
          places.map((place, index) => (
            <li key={index}>{place.properties.name || "Unnamed Place"}</li>
          ))
        ) : (
          <p>Loading places...</p>
        )}
      </ul>
    </div>
  );
};

export default PlacesList;
