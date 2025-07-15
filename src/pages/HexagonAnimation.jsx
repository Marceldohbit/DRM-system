import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

// Animated hexagon using Leaflet's native API and requestAnimationFrame
const HexagonAnimation = ({ lat, lng, color = "#1d4ed8", minRadius = 150, maxRadius = 300, duration = 1200, bouncing = false }) => {
  const polygonRef = useRef(null);
  const map = useMap();

  // Helper function to generate hexagon points
  const getHexagonPoints = (center, radius) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (2 * Math.PI * i) / 6 - Math.PI / 2;
      // Convert radius from meters to degrees (approximate) - made smaller
      const radiusInDegrees = radius / 111320; // 1 degree ≈ 111320 meters
      points.push([
        center[0] + radiusInDegrees * Math.cos(angle),
        center[1] + radiusInDegrees * Math.sin(angle),
      ]);
    }
    return points;
  };

  useEffect(() => {
    if (!map) return;
    let frame;
    let start;
    
    const center = [lat, lng];
    const initialPoints = getHexagonPoints(center, minRadius);
    
    // Create hexagon with enhanced styling for bouncing effect
    let polygon = L.polygon(initialPoints, {
      color,
      fillColor: color,
      fillOpacity: bouncing ? 0.1 : 0.15,
      weight: bouncing ? 3 : 2,
      interactive: false,
      pane: 'markerPane',
    });
    
    polygon.addTo(map);
    polygonRef.current = polygon;

    function animate(ts) {
      if (!start) start = ts;
      const elapsed = (ts - start) % duration;
      
      let r;
      if (bouncing) {
        // Slow bouncing effect for outer hexagon
        const slowBounceT = (elapsed / duration) * Math.PI; // Half cycle for smooth bounce
        r = minRadius + (maxRadius - minRadius) * (0.5 + 0.3 * Math.sin(slowBounceT));
      } else {
        // Regular pulsing animation for inner hexagon
        const t = (elapsed / duration) * 2 * Math.PI;
        r = minRadius + (maxRadius - minRadius) * (0.5 + 0.5 * Math.sin(t));
      }
      
      const newPoints = getHexagonPoints(center, r);
      polygon.setLatLngs(newPoints);
      
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);

    return () => {
      if (polygonRef.current) {
        map.removeLayer(polygonRef.current);
        polygonRef.current = null;
      }
      if (frame) cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line
  }, [lat, lng, color, minRadius, maxRadius, duration, map, bouncing]);

  return null; // This is a map overlay, not a DOM element
};

export default HexagonAnimation;
