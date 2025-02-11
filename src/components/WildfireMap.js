import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import { useTranslation } from "react-i18next";

import "leaflet/dist/leaflet.css";

const WildfireMap = () => {
  const { t } = useTranslation();
  const [fireData, setFireData] = useState([]);
  const [loading, setLoading] = useState(true); 
  // const [zip, setZip] = useState("");
  const [zoom, setZoom] = useState(5);
  const [center, setCenter] = useState([37.0902, -95.7129]); 
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    const fetchFireData = async () => {
      const NASA_API_KEY = process.env.REACT_APP_NASA_API_KEY;
      const NASA_API_URL = `https://eonet.gsfc.nasa.gov/api/v3/events?api_key=${NASA_API_KEY}`;
  
      try {
        const response = await fetch(NASA_API_URL);
        const data = await response.json();
  
        console.log("API Response Data: ", data);
        if (!data.events || data.events.length === 0) {
          console.warn(" No events found in API response");
          setFireData([]);
          return;
        }  
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
        const wildfires = data.events.filter(event =>
          event.categories.some(cat => cat.title.toLowerCase().includes("wildfire")) &&
          event.geometry.some(geo => new Date(geo.date) >= threeMonthsAgo) // 🔥 Keep only recent wildfires
        );
  
        console.log("Filtered Wildfires (Last 3 Months): ", wildfires);
        setFireData(wildfires);
      } catch (error) {
        console.error("Error fetching wildfire data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFireData();
  }, []);
  

  const fireIcon = divIcon({
    html: `<div style="font-size:24px; color:red;">🔥</div>`,
    className: "fire-icon",
    iconSize: [24, 24],
    popupAnchor: [0, -12],
  });

  const handleReset = () => {
    const confirmReset = window.confirm(t("reset_map_confirm"));
    if(confirmReset){
      setCenter([37.0902, -95.7129]);
      setZoom(4);
      setMapKey(prevKey => prevKey + 1);  // Force map to reset by changing key
    }
  };
  // const handleZipSearch = async () => {
  //   if (!zip) {
  //     console.warn("No ZIP code entered");
  //     return;
  //   }

  //   try {
  //     console.log(`🔍 Searching for ZIP code: ${zip}`);

  //     const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&postalcode=${zip}&countrycodes=US`);
  //     const data = await response.json();

  //     console.log(" OpenStreetMap Response: ", data);

  //     if (!data[0]) {
  //       console.error(" Invalid ZIP code entered.");
  //       alert("Invalid ZIP code. Please enter a valid US ZIP code.");
  //       return;
  //     }

  //     const zipLat = parseFloat(data[0].lat);
  //     const zipLon = parseFloat(data[0].lon);

  //     console.log(`ZIP Code Coordinates: ${zipLat}, ${zipLon}`);

  //     setCenter([zipLat, zipLon]); 
  //     setMapKey(prevKey => prevKey + 1); 

  //   } catch (error) {
  //     console.error(" Error fetching ZIP code location:", error);
  //   }
  // };

  return (
    <>
      {/* <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Enter ZIP code"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          style={{ padding: "5px", fontSize: "16px" }}
        />
        <button onClick={handleZipSearch} style={{ marginLeft: "5px", padding: "5px 10px", fontSize: "16px" }}>
        {t("search_button")}
        </button>
      </div> */}
      {loading && <div style={{ textAlign: "center", fontSize: "18px" }}>{t("loading_message")}</div>}
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <button 
          onClick={handleReset}
          style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        >
          {t("reset_map")}
        </button>
      </div>
      {!loading && (
        <MapContainer key={mapKey} center={center} zoom={zoom} style={{ height: "500px", width: "50%", display: "block", margin: "0 auto" }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          />
  
          {fireData.map((fire, index) =>
            fire.geometry?.map((geo, i) => (
              <Marker
                key={`${index}-${i}`}
                position={[geo.coordinates[1], geo.coordinates[0]]}
                icon={fireIcon}
              >
                <Popup>
                  <strong>{fire.title}</strong><br />
                  {geo.date ? new Date(geo.date).toLocaleString() : "No date available"}
                </Popup>
              </Marker>
            ))
          )}
        </MapContainer>
      )}
    </>
  );
};

export default WildfireMap;