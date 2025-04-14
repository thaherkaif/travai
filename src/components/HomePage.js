import React, { useEffect, useState } from "react";
import "../styles/HomePage.css";
import MapComponent from "./MapComponent";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";

const API_KEY = "5ae2e3f221c38a28845f05b6af0c7225e2f2f63935c08b5cf7dfc6de";
const RADIUS = 5000;
const LAT = 48.8566;
const LON = 2.3522;

const HomePage = () => {
  const [places, setPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: LAT, lng: LON });

  useEffect(() => {
    fetchFamousPlaces();
    addResponseMessage("Hi there! I'm TravAI, your virtual travel guide. How can I help?");
  }, []);

  const fetchFamousPlaces = async (lat = LAT, lon = LON) => {
    try {
      const response = await fetch(
        `https://api.opentripmap.com/0.1/en/places/radius?radius=${RADIUS}&lon=${lon}&lat=${lat}&rate=3&format=json&apikey=${API_KEY}`
      );
      const data = await response.json();
      setPlaces(data.slice(0, 6));
      setMapCenter({ lat, lng: lon });
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) return;
    try {
      const geoRes = await fetch(
        `https://api.opentripmap.com/0.1/en/places/geoname?name=${searchTerm}&apikey=${API_KEY}`
      );
      const geoData = await geoRes.json();
      if (geoData.lat && geoData.lon) {
        fetchFamousPlaces(geoData.lat, geoData.lon);
      } else {
        alert("Location not found!");
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleNewUserMessage = async (newMessage) => {
    console.log("New message incoming:", newMessage);
    try {
      const response = await fetch("http://localhost:5000/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });
      const responseData = await response.json();
      const botReply = responseData.reply;
      addResponseMessage(botReply);  // Display the bot's reply in the chat widget
    } catch (error) {
      console.error("Error handling new message:", error);
      addResponseMessage("Sorry, I couldn't get a response. Please try again.");
    }
  };
  

  return (
    <div>
      {/* Header */}
      <header className="header">
        <h1>TravAI</h1>
        <nav>
          <ul>
            <li><button>Home</button></li>
            <li><button>Destinations</button></li>
            <li><button>About</button></li>
            <li><button>Contact</button></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h2>Explore the World with AI</h2>
        <p>Find the best places and get personalized recommendations.</p>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for a destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="destinations">
        <h3>Popular Destinations</h3>
        <div className="destination-list">
          {places.length > 0 ? (
            places.map((place, index) => (
              <div key={index} className="destination-card">
                <h4>{place.name || "Unknown Place"}</h4>
                <p>Explore this amazing destination.</p>
              </div>
            ))
          ) : (
            <p>Loading famous places...</p>
          )}
        </div>
      </section>

      {/* Google Map Section */}
      <section className="map-section">
        <h3>Map View</h3>
        <MapComponent center={mapCenter} places={places} />
      </section>

      {/* Chat Widget */}
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Virtual Tour Assistant"
        subtitle="Ask me about destinations!"
      />
    </div>
  );
};

export default HomePage;
