import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import { useTranslation } from "react-i18next";
import "leaflet/dist/leaflet.css";
import './wildfireMap.css';  

const WildfireMap = () => {
  const { t } = useTranslation();
  const [fireData, setFireData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zip, setZip] = useState("");
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

        if (!data.events || data.events.length === 0) {
          console.warn("No events found in API response");
          setFireData([]);
          return;
        }

        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        const wildfires = data.events.filter(
          (event) =>
            event.categories.some((cat) =>
              cat.title.toLowerCase().includes("wildfire")
            ) &&
            event.geometry.some((geo) => new Date(geo.date) >= threeMonthsAgo)
        );

        setFireData(wildfires);
      } catch (error) {
        console.error("Error fetching wildfire data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFireData();
  }, []);

  const fetchZipCoordinates = async (zip) => {
    try {
      const response = await fetch(`http://localhost:5001/get-coordinates?zipcode=${zip}`);
      const data = await response.json();
  
      if (data.lat && data.lon) {
        console.log(`Coordinates: ${data.lat}, ${data.lon}`);
        setCenter([data.lat, data.lon]);  
        setZoom(10);  
      } else {
        console.error("Invalid ZIP code.");
        alert("Invalid ZIP code. Please enter a valid one.");
      }
    } catch (error) {
      console.error("Error fetching ZIP coordinates:", error);
    }
  };

  const handleZipSearch = async () => {
    if (!zip.trim()) {
      alert("Please enter a valid ZIP code.");
      return;
    }
  
    console.log(`🔍 Searching for ZIP code: ${zip}`);
  
    await fetchZipCoordinates(zip);
  };

  const fireIcon = divIcon({
    html: `<div style="font-size:24px; color:red;">🔥</div>`,
    className: "fire-icon",
    iconSize: [24, 24],
    popupAnchor: [0, -12],
  });

  const handleReset = () => {
    const confirmReset = window.confirm(t("reset_map_confirm"));
    if (confirmReset) {
      setCenter([37.0902, -95.7129]);
      setZoom(4);
      setMapKey((prevKey) => prevKey + 1);
    }
  };

  return (
    <>
      <div className="zip-container">
        <input
          type="text"
          placeholder="Enter ZIP code"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
        />
        <button onClick={handleZipSearch}>
          {t("search_button")}
        </button>
      </div>

      {loading && (
        <div className="loading-message">
          {t("loading_message")}
        </div>
      )}

      <div className="instructions-container">
        <h2>{t("translate_feature_info")}</h2>
        <p>{t("zoom_instructions")}</p>
        <p>
          {t("double_click_zoom")
            .split("\n")
            .map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
        </p>
        <p>{t("reset_warning")}</p>
        <p>{t("fire_info_steps")}</p>

        <ol>
          <li>{t("step_1")}</li>
          <li>{t("step_2")}</li>
          <li>{t("step_3")}</li>
        </ol>

        <button className="reset-button" onClick={handleReset}>
          {t("reset_map")}
        </button>
      </div>

      {!loading && (
        <MapContainer
          key={`${center[0]}-${center[1]}-${zoom}`} // Update the key based on center and zoom
          center={center}
          zoom={zoom}
          className="map-container"
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
      
          {fireData.map((fire, index) =>
            fire.geometry?.map((geo, i) => (
              <Marker
                key={`${index}-${i}`}
                position={[geo.coordinates[1], geo.coordinates[0]]}
                icon={fireIcon}
              >
                <Popup>
                  <strong>{fire.title}</strong>
                  <br />
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
