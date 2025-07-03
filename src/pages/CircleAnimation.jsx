
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

// Animated circle using Leaflet's native API and requestAnimationFrame
const CircleAnimation = ({ lat, lng, color = "#1d4ed8", minRadius = 300, maxRadius = 900, duration = 1200 }) => {
  const circleRef = useRef(null);
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    let frame;
    let start;
    let circle = L.circle([lat, lng], {
      color,
      fillColor: color,
      fillOpacity: 0.15,
      weight: 2,
      radius: minRadius,
      interactive: false,
      pane: 'markerPane',
    });
    circle.addTo(map);
    circleRef.current = circle;

    function animate(ts) {
      if (!start) start = ts;
      const elapsed = (ts - start) % duration;
      // Animate radius from min to max and back
      const t = (elapsed / duration) * 2 * Math.PI;
      const r = minRadius + (maxRadius - minRadius) * (0.5 + 0.5 * Math.sin(t));
      circle.setRadius(r);
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);

    return () => {
      if (circleRef.current) {
        map.removeLayer(circleRef.current);
        circleRef.current = null;
      }
      if (frame) cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line
  }, [lat, lng, color, minRadius, maxRadius, duration, map]);

  return null; // This is a map overlay, not a DOM element
};

export default CircleAnimation;
