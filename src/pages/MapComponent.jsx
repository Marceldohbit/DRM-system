import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({ location, onSetLocation }) => {
  const defaultPosition = [4.1591, 9.2318]; // Default position for Northwest (arbitrary)

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [position.coords.latitude, position.coords.longitude];
          onSetLocation(userLocation);
        },
        () => {
          onSetLocation(defaultPosition);
        }
      );
    } else {
      onSetLocation(defaultPosition);
    }
  }, [onSetLocation]);

  return (
    
    <MapContainer
       id="map"
      center={location || defaultPosition}
      zoom={13}
      style={{ height: "450px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {location && (
        <Marker position={location}>
          <Popup>You are here!</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;

