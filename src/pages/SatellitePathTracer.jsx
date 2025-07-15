import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

// Path tracing component for moving satellites
const SatellitePathTracer = ({ lat, lng, color = "#1d4ed8", isActive = true }) => {
  const pathRef = useRef(null);
  const pathPointsRef = useRef([]);
  const map = useMap();

  useEffect(() => {
    if (!map || !isActive) return;
    
    // Create path polyline
    let pathPolyline = L.polyline([], {
      color: color,
      weight: 3,
      opacity: 0.6,
      interactive: false,
      pane: 'markerPane',
      dashArray: '5, 10', // Dashed line for path
    });
    
    pathPolyline.addTo(map);
    pathRef.current = pathPolyline;

    // Function to update path
    const updatePath = () => {
      if (!pathRef.current) return;
      
      // Add current position to path
      const currentPosition = [lat, lng];
      pathPointsRef.current.push({
        point: currentPosition,
        timestamp: Date.now()
      });
      
      // Remove points older than 20 seconds
      const twentySecondsAgo = Date.now() - 20000;
      pathPointsRef.current = pathPointsRef.current.filter(p => p.timestamp > twentySecondsAgo);
      
      // Update path polyline with remaining points
      const pathPoints = pathPointsRef.current.map(p => p.point);
      pathPolyline.setLatLngs(pathPoints);
    };

    // Update path every 500ms
    const interval = setInterval(updatePath, 500);

    return () => {
      if (pathRef.current) {
        map.removeLayer(pathRef.current);
        pathRef.current = null;
      }
      if (interval) clearInterval(interval);
    };
  }, [map, isActive, color]);

  // Update path when position changes
  useEffect(() => {
    if (!pathRef.current || !isActive) return;
    
    const currentPosition = [lat, lng];
    pathPointsRef.current.push({
      point: currentPosition,
      timestamp: Date.now()
    });
    
    // Remove points older than 20 seconds
    const twentySecondsAgo = Date.now() - 20000;
    pathPointsRef.current = pathPointsRef.current.filter(p => p.timestamp > twentySecondsAgo);
    
    // Update path polyline with remaining points
    const pathPoints = pathPointsRef.current.map(p => p.point);
    pathRef.current.setLatLngs(pathPoints);
  }, [lat, lng, isActive]);

  return null; // This is a map overlay, not a DOM element
};

export default SatellitePathTracer;
