import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Link, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import aggressiveSound from "./siren.mp3";
import im4 from '/images/img4.jpg'
import floodImage from '/images/floods-mankolo.jpg'
import eruptionImage from '/images/eruption-buea1.jpg'
import MapComponent from "./MapComponent";
import { FaMountain, FaWater, FaVolcano } from "react-icons/fa6";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaPlus, FaMapMarkerAlt } from "react-icons/fa";
import { FaCheckCircle, FaVideo, FaRegCircle } from "react-icons/fa";
import SatelliteAsk from "./SatelliteAsk";

//import { Tab } from '@headlessui/react';

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./styles/ScientistComponent.css";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const hazards = [
  { key: "landslide", label: "Landslide", icon: <FaMountain /> },
  { key: "flood", label: "Flood", icon: <FaWater /> },
  { key: "volcano", label: "Volcanic Eruption", icon: <FaVolcano /> },
];

const sidebarTabs = [
  ...hazards,
  { key: "satellite", label: "UAVs", icon: <FaRegCircle /> },
];

// Satellite data
const satelliteList = [
  {
    id: 1,
    name: "GeoSat-1",
    measures: "Thermal Imaging, Ground Deformation",
    zone: "Buea",
    stationary: false,
    color: "#16a34a",
    // Buea: approx 4.159, 9.241
    trajectory: [
      { lat: 4.159, lng: 9.241 },
      { lat: 4.162, lng: 9.245 },
      { lat: 4.165, lng: 9.250 },
      { lat: 4.162, lng: 9.255 },
      { lat: 4.159, lng: 9.260 },
      { lat: 4.156, lng: 9.255 },
      { lat: 4.153, lng: 9.250 },
      { lat: 4.156, lng: 9.245 },
    ],
    orbitPeriod: 24000, // 24s for a full spiral
  },
  {
    id: 2,
    name: "HydroSat-X",
    measures: "Flood Mapping, Water Level",
    zone: "Limbe",
    stationary: false,
    color: "#059669",
    // Limbe: approx 4.035, 9.689
    trajectory: [
      { lat: 4.035, lng: 9.689 },
      { lat: 4.038, lng: 9.693 },
      { lat: 4.041, lng: 9.698 },
      { lat: 4.038, lng: 9.703 },
      { lat: 4.035, lng: 9.708 },
      { lat: 4.032, lng: 9.703 },
      { lat: 4.029, lng: 9.698 },
      { lat: 4.032, lng: 9.693 },
    ],
    orbitPeriod: 26000, // 26s for a full spiral
  },
  {
    id: 3,
    name: "Landsat-Edge",
    measures: "Landslide Detection, Vegetation",
    zone: "Douala",
    stationary: false,
    color: "#f59e42",
    // Douala: approx 4.051, 9.767
    trajectory: [
      { lat: 4.051, lng: 9.767 },
      { lat: 4.054, lng: 9.771 },
      { lat: 4.057, lng: 9.776 },
      { lat: 4.054, lng: 9.781 },
      { lat: 4.051, lng: 9.786 },
      { lat: 4.048, lng: 9.781 },
      { lat: 4.045, lng: 9.776 },
      { lat: 4.048, lng: 9.771 },
    ],
    orbitPeriod: 28000, // 28s for a full spiral
  },
  {
    id: 4,
    name: "StationSat-Z",
    measures: "Standby (All Hazards)",
    zone: "Central Command",
    stationary: true,
    color: "#a21caf",
    position: { lat: 4.5, lng: 9.5 },
  },
];

// Simulated vulnerability reports for each hazard
const hazardVulnerabilityReports = {
  landslide: [
    {
      id: 1,
      image: im4,
      location: { lat: 4.159, lng: 9.241 },
      address: "Buea, Cameroon",
      severity: "critical",
      description: "Satellite detects major ground movement and slope instability. Immediate evacuation recommended.",
      time: "2025-06-27 10:15:00",
    },
    {
      id: 2,
      image: im4,
      location: { lat: 4.035, lng: 9.689 },
      address: "Limbe, Cameroon",
      severity: "moderate",
      description: "Surface cracks and minor land deformation detected. Monitor closely.",
      time: "2025-06-27 09:50:00",
    },
  ],
  flood: [
    {
      id: 1,
      image: floodImage,
      location: { lat: 4.159, lng: 9.241 },
      address: "Buea, Cameroon",
      severity: "critical",
      description: "Satellite mapping shows severe inundation. Floodwaters rising rapidly.",
      time: "2025-06-27 10:20:00",
    },
    {
      id: 2,
      image: floodImage,
      location: { lat: 4.035, lng: 9.689 },
      address: "Limbe, Cameroon",
      severity: "moderate",
      description: "Moderate flooding in low-lying areas. Pump status: operational.",
      time: "2025-06-27 09:55:00",
    },
  ],
  volcano: [
    {
      id: 1,
      image: eruptionImage,
      location: { lat: 4.159, lng: 9.241 },
      address: "Buea, Cameroon",
      severity: "critical",
      description: "Thermal satellite imagery shows high ground temperature and ash plume. Hazard zone expanding.",
      time: "2025-06-27 10:25:00",
    },
    {
      id: 2,
      image: eruptionImage,
      location: { lat: 4.035, lng: 9.689 },
      address: "Limbe, Cameroon",
      severity: "low",
      description: "Minor SO₂ emissions detected. No immediate threat.",
      time: "2025-06-27 09:40:00",
    },
  ],
};

const severityColors = {
  critical: "bg-red-500",
  moderate: "bg-yellow-400",
  low: "bg-green-500",
};

const defineSensorParams = {
  landslide: [
    { label: "Rainfall (mm/h)", key: "rainfall" },
    { label: "Soil Moisture (%)", key: "soilMoisture" },
    { label: "Slope Angle (°)", key: "slopeAngle" },
    { label: "Seismic Activity (Hz)", key: "seismic" },
    { label: "Temperature (°C)", key: "temperature" },
    { label: "Humidity (%)", key: "humidity" },
    { label: "Vegetation Cover (%)", key: "vegetation" },
  ],
  flood: [
    { label: "Rainfall (mm/h)", key: "rainfall" },
    { label: "River Level (m)", key: "riverLevel" },
    { label: "Soil Moisture (%)", key: "soilMoisture" },
    { label: "Humidity (%)", key: "humidity" },
    { label: "Temperature (°C)", key: "temperature" },
    { label: "Slope Angle (°)", key: "slopeAngle" },
    { label: "Tide Level (m)", key: "tideLevel" },
    { label: "Pump Status", key: "pumpStatus" },
  ],
  volcano: [
    { label: "Seismic Activity (Hz)", key: "seismic" },
    { label: "SO₂ Emissions (ppm)", key: "so2" },
    { label: "CO₂ Emissions (ppm)", key: "co2" },
    { label: "Ground Temp (°C)", key: "groundTemp" },
    { label: "Ash Detection (mg/m³)", key: "ash" },
    { label: "Ground Deformation (mm)", key: "deformation" },
  ],
};

// Simulate sensor data for the selected hazard and sensor index
function generateHazardSensorData(hazard) {
  const params = defineSensorParams[hazard];
  return params.map(param => ({
    ...param,
    value: param.key === "pumpStatus"
      ? (Math.random() > 0.7 ? "OFF" : "ON")
      : (Math.random() * 100).toFixed(2),
  }));
}

// Define hazardSensors at the top-level, before the component
const hazardSensors = {
  landslide: [
    { id: 1, name: "Sensor 1", location: { lat: 4.159, lng: 9.241 }, address: "Buea, Cameroon" },
    { id: 2, name: "Sensor 2", location: { lat: 4.035, lng: 9.689 }, address: "Limbe, Cameroon" },
    { id: 3, name: "Sensor 3", location: { lat: 5.024, lng: 9.300 }, address: "Kumba, Cameroon" },
    { id: 4, name: "Sensor 4", location: { lat: 4.950, lng: 9.800 }, address: "Tiko, Cameroon" },
  ],
  flood: [
    { id: 1, name: "Sensor 1", location: { lat: 4.159, lng: 9.241 }, address: "Buea, Cameroon" },
    { id: 2, name: "Sensor 2", location: { lat: 4.035, lng: 9.689 }, address: "Limbe, Cameroon" },
    { id: 3, name: "Sensor 3", location: { lat: 5.024, lng: 9.300 }, address: "Kumba, Cameroon" },
    { id: 4, name: "Sensor 4", location: { lat: 4.950, lng: 9.800 }, address: "Tiko, Cameroon" },
  ],
  volcano: [
    { id: 1, name: "Sensor 1", location: { lat: 4.159, lng: 9.241 }, address: "Buea, Cameroon" },
    { id: 2, name: "Sensor 2", location: { lat: 4.035, lng: 9.689 }, address: "Limbe, Cameroon" },
    { id: 3, name: "Sensor 3", location: { lat: 5.024, lng: 9.300 }, address: "Kumba, Cameroon" },
    { id: 4, name: "Sensor 4", location: { lat: 4.950, lng: 9.800 }, address: "Tiko, Cameroon" },
  ],
};

import CircleAnimation from "./CircleAnimation";
import HexagonAnimation from "./HexagonAnimation";

const ScientistsComponent = () => {
  const location = useLocation();
  
  // Function to determine if a nav item is active
  const isActiveNavItem = (path) => {
    return location.pathname === path;
  };

  const [region, setRegion] = useState("Northwest");
  const [sensorData, setSensorData] = useState([[], [], []]);
  const [vulnerabilityData, setVulnerabilityData] = useState([[], [], []]);
  const [time, setTime] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [select, setSelect] = useState(false);
  const [showDanger, setShowDanger] = useState(false);
  const [S0, setS1] = useState('sensor1')
  const [S1, setS2] = useState('sensor2')
  const [S2, setS3] = useState('sensor3')
  const [activeSidebarTab, setActiveSidebarTab] = useState("landslide");
  const [activeHazard, setActiveHazard] = useState("landslide");
  const [showSatelliteMap, setShowSatelliteMap] = useState(null); // satellite id or null

  // --- Animated Orbit for Satellites ---
  // For each moving satellite, define a zone center and max radius (for grid-based orbit)
  const satelliteOrbitParams = satelliteList.map(sat => {
    if (sat.stationary) {
      return { center: sat.position, maxRadius: 0, angleOffset: 0, orbitPeriod: 20000 };
    }
    // Use average of trajectory points as center (city center)
    const n = sat.trajectory.length;
    const avgLat = sat.trajectory.reduce((sum, p) => sum + p.lat, 0) / n;
    const avgLng = sat.trajectory.reduce((sum, p) => sum + p.lng, 0) / n;
    // Use max distance from center as maxRadius (in degrees)
    let maxRadius = 0;
    sat.trajectory.forEach(p => {
      const d = Math.sqrt(Math.pow(p.lat - avgLat, 2) + Math.pow(p.lng - avgLng, 2));
      maxRadius = Math.max(maxRadius, d);
    });
    // Increase the scanning area for comprehensive grid coverage
    maxRadius = (maxRadius + 0.02) * 1.2; // larger area for grid scanning
    const angleOffset = Math.random() * 2 * Math.PI;
    return { center: { lat: avgLat, lng: avgLng }, maxRadius, angleOffset, orbitPeriod: sat.orbitPeriod || 90000 };
  });

  // Animate satellites in square wave pattern
  const [satellitePositions, setSatellitePositions] = useState(() =>
    satelliteList.map((sat, i) => sat.stationary ? sat.position : { ...satelliteOrbitParams[i].center })
  );

  useEffect(() => {
    let frame;
    function animate() {
      const now = Date.now();
      setSatellitePositions(
        satelliteList.map((sat, i) => {
          if (sat.stationary) return sat.position;
          const { center, maxRadius, angleOffset, orbitPeriod } = satelliteOrbitParams[i];
          // Grid-based scanning period: use orbitPeriod for each satellite
          const period = orbitPeriod;
          const t = ((now % period) / period); // 0 to 1
          
          // Grid-based vertical strip scanning pattern
          const gridColumns = 12; // More strips for narrower width when turning right
          const stripWidth = (maxRadius * 2) / gridColumns;
          
          // Calculate which strip we're in and progress within that strip
          const totalProgress = t * gridColumns;
          const currentStrip = Math.floor(totalProgress);
          const stripProgress = totalProgress % 1; // 0 to 1 within current strip
          
          // Calculate the x position (longitude) for the current strip
          const stripLng = center.lng - maxRadius + (currentStrip * stripWidth) + (stripWidth * 0.5);
          
          // Calculate vertical movement within the strip
          // Move up and down in alternating strips for continuous coverage
          let lat;
          if (currentStrip % 2 === 0) {
            // Even strips: move from bottom to top
            lat = center.lat - maxRadius + (stripProgress * maxRadius * 2);
          } else {
            // Odd strips: move from top to bottom
            lat = center.lat + maxRadius - (stripProgress * maxRadius * 2);
          }
          
          const lng = stripLng;
          
          return { lat, lng };
        })
      );
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => frame && cancelAnimationFrame(frame);
    // eslint-disable-next-line
  }, []);
  const [activeTab, setActiveTab] = useState("sensor");
  const [sensorHistory, setSensorHistory] = useState([]);
  const [bigSensor, setBigSensor] = useState(null);
  const [showSensorMap, setShowSensorMap] = useState(null);
  const [sensorHistories, setSensorHistories] = useState([[], [], [], []]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddSensor, setShowAddSensor] = useState(false);
  const [newLat, setNewLat] = useState("");
  const [newLng, setNewLng] = useState("");
  const [customSensors, setCustomSensors] = useState([]);
  const [vulTab, setVulTab] = useState('user');
  const [fullscreenImg, setFullscreenImg] = useState(null);
  const [messages, setMessages] = useState([]);
  const [cmdRefresh, setCmdRefresh] = useState(0);
  const [investigationPoints, setInvestigationPoints] = useState([]);

  // --- Satellite Analysis Actions ---
  // Add videoRequested and videoAvailable to reports (in-memory, not persisted)
  const [satReports, setSatReports] = useState(() => {
    // Deep clone to avoid mutating original
    return hazardVulnerabilityReports[activeHazard]?.map(r => ({ ...r })) || [];
  });

  // Keep satReports in sync with activeHazard
  useEffect(() => {
    setSatReports(hazardVulnerabilityReports[activeHazard]?.map(r => ({ ...r })) || []);
  }, [activeHazard]);

  // Handler: Mark for Investigation
  const handleMarkForInvestigation = (report) => {
    // Prevent duplicates by uniqueKey (hazard+id)
    const uniqueKey = `${activeHazard}-${report.id}`;
    if (!investigationPoints.some(p => p.uniqueKey === uniqueKey)) {
      setInvestigationPoints(prev => [
        ...prev,
        {
          uniqueKey,
          address: report.address,
          lat: report.location.lat,
          lng: report.location.lng,
          description: report.description,
          time: report.time,
          severity: report.severity,
          videoAvailable: !!report.videoRequested,
        }
      ]);
    }
  };

  // Handler: Request Video Feed
  const handleRequestVideoFeed = (report) => {
    setSatReports(prev => prev.map(r =>
      r.id === report.id ? { ...r, videoRequested: true } : r
    ));
    // Also update investigationPoints if already marked
    const uniqueKey = `${activeHazard}-${report.id}`;
    setInvestigationPoints(prev => prev.map(p =>
      p.uniqueKey === uniqueKey ? { ...p, videoAvailable: true } : p
    ));
  };

  // Handler: View Video Feed (placeholder)
  const handleViewVideoFeed = (report) => {
    toast.info(`Showing video feed for ${report.address}`);
  };

  // Handler: Alert Authorities (placeholder)
  const handleAlertAuthorities = (report) => {
    toast.warn(`Authorities alerted for ${report.address}`);
  };

  const Thetext = `
  A steep slope at the edge of our quarter has become a growing concern.Over the past weeks, visible cracks 
  
  have appeared on the ground, stretching  across several meters. Trees on the slope are leaning precariously, 
  
  with   their roots partially exposed, indicating significant soil movement. Residents nearby have also reported 
  
  hearing faint rumbling sounds, particularly after the  recent rains, suggesting that the ground might be shifting.

  **What makes the situation more alarming is the ongoing construction at the slope’s base.
            
  Heavy machinery has been excavating the area, while deforestation has stripped away stabilizing vegetation. To make 
 
  matters worse, the construction company installed poorly designed drainage systems, causing water to pool in parts 
 
  of the slope. This accumulation of water has likely saturated the soil, making it heavier and more prone to sliding.

  Given the slope’s history of smaller landslides and the visible warning signs, the risk of a major collapse is real. 
 
  If it happens, homes and roads below the slope could be buried under debris. Additionally, there is a nearby stream that
 
  could become blocked, leading to flooding and cutting off access to essential services.Immediate action is needed. 
 
  Authorities should inspect the site and halt construction until proper stabilization measures are implemented. Residents
 
  in the danger zone  must be relocated as a precaution, and monitoring systems should be installed to track further soil movement.
`
 const txt = `  John Doe
               
   682570839

   Buea/Sanpit
 
 `
 

  const generateRandomData = (sensorIndex) => {
    const weights = [
      [0.3, 0.2, 0.4, 0.1], // Weights for Sensor 1
      [10, 10, 10, 10], // Weights for Sensor 2
      [0.2, 0.3, 0.2, 0.3], // Weights for Sensor 3
    ];
    const randomValues = {
      humanActivities: Math.random() * 10,
      soilTexture: Math.random() * 10,
      rainfall: Math.random() * 10,
      landscape: Math.random() * 10,
    };
    
    const vulnerability =
      randomValues.humanActivities * weights[sensorIndex][0] +
      randomValues.soilTexture * weights[sensorIndex][1] +
      randomValues.rainfall * weights[sensorIndex][2] +
      randomValues.landscape * weights[sensorIndex][3];

    return { randomValues, vulnerability: vulnerability.toFixed(2) };
  };

  const playSound = () => {
    const audio = new Audio(aggressiveSound);
    setShowDanger(true);
    audio.play();
    audio.play();
    audio.play();
    audio.play();
    audio.play();
    audio.play();
    setTimeout(()=>{
      audio.play();
      audio.play();
      audio.play();
      audio.play();
    }, 8000)

   // Show danger block
    setTimeout(() => setShowDanger(false), 15000); // Hide after 5 seconds
  };

  const clear = () =>{
    setS1('sensor1')
    setS2('sensor2')
    setS3('sensor3')

    localStorage.removeItem('disaster')
  }
  // Aggressive notification popups and sound are disabled for now
  const showNotification = (event) => {
    if(event){
      var val= event.target.value;
      if(val == 'sensor1'){
        setS1(' Danger')
      }
      else if(val == 'sensor2'){
        setS2('Danger')
      }
      else if(val == 'sensor3'){
        setS3('Danger')
      }
    }
    else{
      setS2('Danger')
    }
    localStorage.setItem("disaster","true");
    // toast.error("This is an aggressive notification!", {
    //   position: "top-center",
    //   autoClose: false,
    //   closeOnClick: true,
    //   draggable: true,
    //   className: "aggressive-toast",
    // });
    // playSound();
  };
  // Disable auto aggressive notification popup
  // useEffect(()=>{
  //     setTimeout(() => {
  //       showNotification();
  //     }, 12000);
  // },[])

  useEffect(() => {
    const interval = setInterval(() => {
      const newSensorData = [[], [], []];
      const newVulnerabilityData = [[], [], []];

      for (let i = 0; i < 3; i++) {
        const { randomValues, vulnerability } = generateRandomData(i);
        newSensorData[i] = [
          randomValues,
          ...sensorData[i],
        ].slice(0, 10);
        newVulnerabilityData[i] = [
          vulnerability,
          ...vulnerabilityData[i],
        ].slice(0, 10);
      }

      setSensorData(newSensorData);
      setVulnerabilityData(newVulnerabilityData);
      setTime((prev) => [new Date().toLocaleTimeString(), ...prev].slice(0, 10));
    }, 2000);

    return () => clearInterval(interval);
  }, [sensorData, vulnerabilityData]);

  useEffect(() => {
    if (!activeHazard) return;
    const interval = setInterval(() => {
      setSensorHistories(prev => prev.map(
        (history, idx) => [
          generateHazardSensorData(activeHazard),
          ...history.slice(0, 19)
        ]
      ));
    }, 2000);
    return () => clearInterval(interval);
  }, [activeHazard]);

  // Ensure each custom sensor has a corresponding history array
  useEffect(() => {
    // When customSensors changes, ensure sensorHistories has enough arrays
    if (customSensors.length > 0) {
      setSensorHistories(prev => {
        const needed = hazardSensors[activeHazard].length + customSensors.length;
        if (prev.length < needed) {
          return [
            ...prev,
            ...Array(needed - prev.length).fill([])
          ];
        }
        return prev;
      });
    }
    // eslint-disable-next-line
  }, [customSensors, activeHazard]);

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
    setSensorData([[], [], []]);
    setVulnerabilityData([[], [], []]);
    setTime([]);
  };

  // Notification for new messages
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "messages") {
        const allMsgs = JSON.parse(e.newValue || "[]");
        const newMsgs = allMsgs.filter(m => m.recipient === "Scientists" && !messages.some(msg => msg.id === m.id));
        if (newMsgs.length > 0) {
          toast.info(`New message from ${newMsgs[newMsgs.length-1].sender}`);
          setMessages(allMsgs.filter(m => m.recipient === "Scientists" || m.sender === "Scientists"));
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [messages]);

  // Define normal/critical thresholds for each parameter
const hazardThresholds = {
  landslide: {
    soilMoisture: 70,
    rainfall: 60,
    slopeAngle: 40,
    vibration: 80,
    displacement: 50,
  },
  flood: {
    waterLevel: 80,
    rainfallRate: 60,
    flowVelocity: 70,
    soilSaturation: 80,
    pumpStatus: "OFF", // critical if OFF
  },
  volcano: {
    seismic: 80,
    so2: 70,
    co2: 70,
    groundTemp: 60,
    ash: 60,
    deformation: 50,
  },
};

// Aggregate function for a single sensor's values
function aggregateSensorValuesForSensor(sensorReading, hazard) {
  if (!Array.isArray(sensorReading)) return 0;
  let sum = 0, count = 0;
  sensorReading.forEach((param) => {
    if (typeof param.value === 'string' && param.key === 'pumpStatus') {
      sum += param.value === 'OFF' ? 100 : 0;
      count++;
    } else if (!isNaN(Number(param.value))) {
      sum += Number(param.value);
      count++;
    }
  });
  return count ? (sum / count).toFixed(2) : 0;
}

  // List of Cameroon regions
const cameroonRegions = [
  "Adamawa", "Centre", "East", "Far North", "Littoral", "North", "Northwest", "West", "South", "Southwest"
];

  // Combine default and custom sensors for filtering
const allSensors = [...hazardSensors[activeHazard], ...customSensors];

  // Filter sensors by region (address includes region name)
  const filteredSensors = allSensors.filter(sensor =>
    (!selectedRegion || sensor.address.toLowerCase().includes(selectedRegion.toLowerCase())) &&
    (!searchTerm || sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) || sensor.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // For polygon drawing
const polygonPoints = allSensors && allSensors.length > 2
  ? allSensors.map(s => [s.location.lat, s.location.lng])
  : [];

const handleAddSensor = () => {
  if (!newLat || !newLng) return;
  const lat = parseFloat(newLat);
  const lng = parseFloat(newLng);
  if (isNaN(lat) || isNaN(lng)) return;
  const name = `Sensor ${hazardSensors[activeHazard].length + customSensors.length + 1}`;
  setCustomSensors([...customSensors, {
    id: Date.now(),
    name,
    location: { lat, lng },
    address: `Custom (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    custom: true
  }]);
  setShowAddSensor(false);
  setNewLat("");
  setNewLng("");
};

  // Pentagon points generator
function getPentagonPoints(center, size = 0.01) {
  // size is the radius in degrees
  const points = [];
  for (let i = 0; i < 5; i++) {
    const angle = (2 * Math.PI * i) / 5 - Math.PI / 2;
    points.push([
      center.lat + size * Math.cos(angle),
      center.lng + size * Math.sin(angle),
    ]);
  }
  return points;
}

// Hexagon points generator
function getHexagonPoints(center, size = 0.01) {
  // size is the radius in degrees
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (2 * Math.PI * i) / 6 - Math.PI / 2;
    points.push([
      center.lat + size * Math.cos(angle),
      center.lng + size * Math.sin(angle),
    ]);
  }
  return points;
}

// Ensure reports is defined in the component before use
const reports = hazardVulnerabilityReports[activeHazard] || [];

  return (
    <>
    {/* Hide navbar when showing sensor map */}
    {showSensorMap === null && (
      <nav className="terra-navbar h-18 fixed top-0 left-0 w-full z-50 bg-white shadow-xl flex items-center px-10 border-b border-green-300 backdrop-blur-lg" style={{ backgroundColor: 'white' }}>
        <div className="logo flex items-center">
          <img src="/src/pages/logo.png" alt="TerraALERT Logo" className="h-12 w-auto drop-shadow-lg" />
        </div>
        <ul className="menu flex gap-10 ml-auto text-green-800 font-semibold text-lg" style={{ color: '#166534' }}>
          <li><Link to="/science" className={`hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 ${isActiveNavItem('/science') ? 'bg-green-200 border-2 border-green-500 shadow-md' : ''}`} style={{ color: '#166534', backgroundColor: isActiveNavItem('/science') ? '#bbf7d0' : 'transparent' }}>Dashboard</Link></li>
          <li><Link to="/message?role=Scientists" className={`hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 ${isActiveNavItem('/message') ? 'bg-green-200 border-2 border-green-500 shadow-md' : ''}`} style={{ color: '#166534', backgroundColor: isActiveNavItem('/message') ? '#bbf7d0' : 'transparent' }}>Messaging</Link></li>
          <li><Link to="/upload" className={`hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 ${isActiveNavItem('/upload') ? 'bg-green-200 border-2 border-green-500 shadow-md' : ''}`} style={{ color: '#166534', backgroundColor: isActiveNavItem('/upload') ? '#bbf7d0' : 'transparent' }}>Create Alert</Link></li>
          <li><Link to="/admin" className={`hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 ${isActiveNavItem('/admin') ? 'bg-green-200 border-2 border-green-500 shadow-md' : ''}`} style={{ color: '#166534', backgroundColor: isActiveNavItem('/admin') ? '#bbf7d0' : 'transparent' }}>Administration</Link></li>
          <li><button onClick={() => { localStorage.removeItem('userRole'); window.location.href = '/'; }} className="hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 border border-green-500 hover:border-green-600" style={{ color: '#166534' }}>Logout</button></li>
        </ul>
      </nav>
    )}
    <div className="min-h-screen flex bg-gradient-to-br from-green-100 via-green-200 to-green-50 pt-24">
    {/* Sidebar Navigation */}
    <aside className="w-72 bg-white/80 shadow-2xl flex flex-col py-10 px-6 gap-8 fixed top-20 left-0 h-[calc(100vh-5rem)] z-40 rounded-tr-3xl rounded-br-3xl border-r border-green-200 backdrop-blur-md">
      <h1 className="text-3xl font-extrabold text-green-800 mb-10 tracking-tight">Navigation</h1>
      <nav className="flex flex-col gap-6">
        {sidebarTabs.map((tab) => (
          <button
            key={tab.key}
            className={`flex items-center gap-4 px-6 py-3 rounded-xl font-bold text-lg shadow transition-all duration-200 border-2 focus:outline-none tracking-tight ${activeSidebarTab === tab.key ? 'bg-gradient-to-r from-green-600 to-green-400 text-white border-green-600 shadow-lg scale-105' : 'bg-white/80 text-green-800 border-green-300 hover:bg-green-100/80'}`}
            onClick={() => {
              setActiveSidebarTab(tab.key);
              if (hazards.some(h => h.key === tab.key)) setActiveHazard(tab.key);
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>
    </aside>
    {/* Main Content */}
    <main className="flex-1 p-10 ml-72 mt-4 overflow-y-auto h-[calc(100vh-5rem)]">
      <div className="max-w-7xl mx-auto bg-white/95 rounded-3xl shadow-2xl p-10 border border-green-100">
        {/* Sidebar tab content switch */}
        {activeSidebarTab !== 'satellite' ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
              <h2 className="text-3xl font-extrabold text-green-800 tracking-tight drop-shadow">{hazards.find(h => h.key === activeHazard)?.label} Dashboard</h2>
              <div className="flex gap-4">
                <button
                  className={`px-6 py-2 rounded-full font-bold border-2 text-lg shadow transition-all duration-200 focus:outline-none tracking-tight ${activeTab === 'sensor' ? 'bg-gradient-to-r from-green-600 to-green-400 text-white border-green-600 shadow-lg scale-105' : 'bg-white/80 text-green-800 border-green-300 hover:bg-green-100/80'}`}
                  onClick={() => setActiveTab('sensor')}
                >Sensor Data</button>
                <button
                  className={`px-6 py-2 rounded-full font-bold border-2 text-lg shadow transition-all duration-200 focus:outline-none tracking-tight ${activeTab === 'vulnerability' ? 'bg-gradient-to-r from-green-600 to-green-400 text-white border-green-600 shadow-lg scale-105' : 'bg-white/80 text-green-800 border-green-300 hover:bg-green-100/80'}`}
                  onClick={() => setActiveTab('vulnerability')}
                >Vulnerability Assessment</button>
              </div>
            </div>
            {/* Tab Content */}
            {activeTab === 'sensor' && (
              <div className="w-full flex flex-col gap-8">
                {/* Region filter and search */}
                <div className="flex flex-wrap gap-4 mb-6 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Region</label>
                    <select
                      className="border border-green-300 rounded px-3 py-2 focus:border-green-500 focus:outline-none"
                      value={selectedRegion}
                      onChange={e => setSelectedRegion(e.target.value)}
                    >
                      <option value="">All Regions</option>
                      {cameroonRegions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input
                      type="text"
                      className="border border-green-300 rounded px-3 py-2 focus:border-green-500 focus:outline-none"
                      placeholder="Sensor name or address"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button
                    className="ml-2 px-4 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700"
                    onClick={() => { /* No-op, search is live, but button for UI */ }}
                  >Search</button>
                  <button
                    className="ml-2 px-4 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700"
                    onClick={() => setShowAddSensor(true)}
                  >+ Add Sensor</button>
                </div>
                {showAddSensor && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
                      <button className="absolute top-2 right-2 text-xl" onClick={() => setShowAddSensor(false)}>&times;</button>
                      <h4 className="font-bold mb-4">Add Sensor</h4>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Latitude</label>
                        <input type="number" className="border rounded px-3 py-2 w-full" value={newLat} onChange={e => setNewLat(e.target.value)} />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Longitude</label>
                        <input type="number" className="border rounded px-3 py-2 w-full" value={newLng} onChange={e => setNewLng(e.target.value)} />
                      </div>
                      <button className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700" onClick={handleAddSensor}>Add</button>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                  {filteredSensors.map((sensor, idx) => {
                    // ...existing code for rendering each sensor card...
                    const sensorIdx = allSensors.findIndex(s => s.id === sensor.id);
                    return (
                      <div
                        key={sensor.id}
                        className="relative bg-green-50 rounded-lg p-6 shadow flex flex-col"
                        style={{ height: '22rem', minHeight: '16rem' }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-semibold">{sensor.name} <span className="text-xs text-gray-500">({sensor.address})</span></h3>
                          <div className="flex gap-2">
                            <button
                              className="p-2 rounded-full bg-green-200 hover:bg-green-400 text-green-800"
                              onClick={() => setShowSensorMap(sensor.id)}
                              title="Show on Map"
                            >
                              <FaMapMarkerAlt />
                            </button>
                            <button
                              className="p-2 rounded-full bg-green-200 hover:bg-green-400 text-green-800"
                              onClick={() => setBigSensor(bigSensor === sensor.id ? null : sensor.id)}
                              title={bigSensor === sensor.id ? "Minimize" : "Show Details"}
                            >
                              <FaPlus className={bigSensor === sensor.id ? 'rotate-45 transition-transform' : ''} />
                            </button>
                          </div>
                        </div>
                        {/* Always show the graph, only show parameters if expanded */}
                        <div className="w-full flex-1 min-h-0 mb-2">
                          <Line
                            data={{
                              labels: (sensorHistories[sensorIdx] || []).map((_, i) => `T-${i * 2}s`).reverse(),
                              datasets: [
                                {
                                  label: 'Aggregate Value',
                                  data: (sensorHistories[sensorIdx] || []).map(h => aggregateSensorValuesForSensor(h, activeHazard)).reverse(),
                                  borderColor: 'rgb(34, 197, 94)',
                                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                  borderWidth: 3,
                                  pointRadius: 2,
                                  tension: 0.4,
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: { display: true, position: 'top', labels: { font: { size: 14 } } },
                                title: { display: false },
                                tooltip: { enabled: true },
                              },
                              scales: {
                                x: { title: { display: true, text: 'Time', font: { size: 14 } } },
                                y: { title: { display: true, text: 'Aggregate Value', font: { size: 14 } } },
                              },
                            }}
                            height={160}
                          />
                        </div>
                        {/* Expandable parameters below the graph */}
                        {bigSensor === sensor.id && (
                          <div className="bg-white bg-opacity-95 rounded-b-lg p-4 z-10 shadow-xl border-t border-green-200 mt-2">
                            <button className="absolute right-6 top-2 text-lg font-bold text-gray-500 hover:text-red-600" onClick={() => setBigSensor(null)} title="Close">&times;</button>
                            <ul className="space-y-2">
                              {((sensorHistories[sensorIdx] && sensorHistories[sensorIdx][0]) || []).map((param, pidx) => {
                                const threshold = hazardThresholds[activeHazard]?.[param.key];
                                const isCritical =
                                  typeof threshold === 'number'
                                    ? Number(param.value) > threshold
                                    : (param.key === 'pumpStatus' && param.value === 'OFF');
                                return (
                                  <li key={param.key} className="flex justify-between items-center text-gray-700">
                                    <span>{param.label}</span>
                                    <span className={`font-mono font-bold px-2 py-1 rounded ${isCritical ? 'bg-red-500 text-white' : 'text-green-700 bg-white'}`}>{param.value}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                        {/* Sensor location map modal */}
                        {showSensorMap === sensor.id && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                            <div className="absolute inset-0 flex flex-col">
                              <button className="absolute top-6 right-10 z-[200] text-5xl font-extrabold text-white bg-red-500 bg-opacity-80 rounded-full px-4 py-2 shadow-lg hover:bg-red-700 hover:scale-110 transition-all focus:outline-none" onClick={() => setShowSensorMap(null)} title="Close">&times;</button>
                              <div className="absolute top-8 left-8 bg-white bg-opacity-90 rounded shadow p-4 z-50">
                                <h4 className="font-bold mb-2">{sensor.name} Location</h4>
                                <div className="mb-2 text-sm text-gray-600">Lat: {sensor.location.lat}, Lng: {sensor.location.lng}</div>
                              </div>
                              <MapContainer center={[sensor.location.lat, sensor.location.lng]} zoom={15} className="w-full h-full z-[100]">
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[sensor.location.lat, sensor.location.lng]}>
                                  <Popup>{sensor.address}</Popup>
                                </Marker>
                                <Polygon positions={getPentagonPoints(sensor.location, 0.002)} pathOptions={{ color: 'purple', fillOpacity: 0.2 }} />
                              </MapContainer>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {activeTab === 'vulnerability' && (
              <div className="flex flex-col gap-6">
                {/* ...existing code for vulnerability tab... */}
                {/* The full vulnerability tab code block is already present below, so this is just a placeholder to fix the syntax error. */}
              </div>
            )}
          </>
        ) : (
          // Satellite tab content
          <>
            <h2 className="text-3xl font-extrabold text-green-800 tracking-tight drop-shadow mb-8">Satellites Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {satelliteList.map((sat, idx) => (
                <div key={sat.id} className="relative bg-green-50 rounded-lg p-6 shadow flex flex-col border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-block w-4 h-4 rounded-full" style={{ background: sat.color }}></span>
                    <span className="font-bold text-lg text-green-900">{sat.name}</span>
                    {sat.stationary && <span className="ml-2 px-2 py-1 rounded-full bg-purple-200 text-purple-800 text-xs font-semibold">Stationary</span>}
                  </div>
                  <div className="mb-1 text-gray-700"><span className="font-semibold">Measures:</span> {sat.measures}</div>
                  <div className="mb-1 text-gray-700"><span className="font-semibold">Zone:</span> {sat.zone}</div>
                  <div className="mb-1 text-gray-700"><span className="font-semibold">Current Position:</span> Lat: {satellitePositions[idx].lat.toFixed(3)}, Lng: {satellitePositions[idx].lng.toFixed(3)}
                    {!sat.stationary && (
                      <span className="ml-2 text-xs text-green-500 animate-pulse">(Orbiting)</span>
                    )}
                  </div>
                  <button
                    className="mt-3 p-2 rounded-full bg-green-200 hover:bg-green-400 text-green-800 shadow self-start"
                    title="Show on Map"
                    onClick={() => setShowSatelliteMap(idx)}
                  >
                    <FaMapMarkerAlt />
                  </button>
                </div>
              ))}
            </div>
            {/* Satellite Map Modal */}
            {showSatelliteMap !== null && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                <div className="absolute inset-0 flex flex-col">
                  <button className="absolute top-6 right-10 z-[200] text-5xl font-extrabold text-white bg-red-500 bg-opacity-80 rounded-full px-4 py-2 shadow-lg hover:bg-red-700 hover:scale-110 transition-all focus:outline-none" onClick={() => setShowSatelliteMap(null)} title="Close">&times;</button>
                  <div className="absolute top-8 left-8 bg-white bg-opacity-90 rounded shadow p-4 z-50">
                    <h4 className="font-bold mb-2">{satelliteList[showSatelliteMap].name} Trajectory</h4>
                    <div className="mb-2 text-sm text-gray-600">Current Position: Lat: {satellitePositions[showSatelliteMap].lat.toFixed(3)}, Lng: {satellitePositions[showSatelliteMap].lng.toFixed(3)}</div>
                  </div>
                  <MapContainer center={[satellitePositions[showSatelliteMap].lat, satellitePositions[showSatelliteMap].lng]} zoom={8} className="w-full h-full z-[100]">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {/* Draw the zone as a circle for moving satellites */}
                    {!satelliteList[showSatelliteMap].stationary && (
                      <>
                        {/* Draw the zone as a bigger bouncing hexagon */}
                        {(() => {
                          const { center, maxRadius } = satelliteOrbitParams[showSatelliteMap];
                          // Convert maxRadius (in degrees) to meters (approx, 1 deg lat ~ 111km)
                          const meters = maxRadius * 111000;
                          return (
                            <HexagonAnimation
                              lat={center.lat}
                              lng={center.lng}
                              color={satelliteList[showSatelliteMap].color}
                              minRadius={meters * 0.8}
                              maxRadius={meters * 1.2}
                              duration={6000}
                              bouncing={true}
                            />
                          );
                        })()}
                        {/* Moving marker with animated hexagon and path tracing */}
                        <Marker position={[satellitePositions[showSatelliteMap].lat, satellitePositions[showSatelliteMap].lng]}>
                          <Popup>{satelliteList[showSatelliteMap].name} (Moving)</Popup>
                        </Marker>
                        {/* Animated smaller hexagon around marker */}
                        <HexagonAnimation
                          lat={satellitePositions[showSatelliteMap].lat}
                          lng={satellitePositions[showSatelliteMap].lng}
                          color={satelliteList[showSatelliteMap].color}
                          minRadius={100}
                          maxRadius={200}
                          duration={1500}
                          bouncing={false}
                        />
                      </>
                    )}
                    {satelliteList[showSatelliteMap].stationary && (
                      <>
                        <Marker position={[satellitePositions[showSatelliteMap].lat, satellitePositions[showSatelliteMap].lng]}>
                          <Popup>{satelliteList[showSatelliteMap].name} (Stationary)</Popup>
                        </Marker>
                        {/* Animated smaller hexagon for stationary as well for consistency */}
                        <HexagonAnimation
                          lat={satellitePositions[showSatelliteMap].lat}
                          lng={satellitePositions[showSatelliteMap].lng}
                          color={satelliteList[showSatelliteMap].color}
                          minRadius={150}
                          maxRadius={250}
                          duration={3000}
                          bouncing={true}
                        />
                      </>
                    )}
                  </MapContainer>
                </div>
              </div>
            )}
          </>
        )}
        {activeTab === 'vulnerability' && (
          <div className="flex flex-col gap-6">
            <div className="flex gap-4 mb-4">
              <button
                className={`px-4 py-2 rounded-full font-semibold border-2 transition-all duration-200 focus:outline-none ${vulTab === 'user' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-700 border-green-300 hover:bg-green-100'}`}
                onClick={() => setVulTab('user')}
              >User Reports</button>
              <button
                className={`px-4 py-2 rounded-full font-semibold border-2 transition-all duration-200 focus:outline-none ${vulTab === 'sat' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-700 border-green-300 hover:bg-green-100'}`}
                onClick={() => setVulTab('sat')}
              >Satellite Analysis</button>
            </div>
            {vulTab === 'user' && (
              <div className="flex flex-col md:flex-row gap-8">
                {/* User Vulnerability Reports List */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-lg font-semibold mb-2">User Vulnerability Reports</h3>
                  {/* Example user report, replace with real user data if available */}
                  <div className="flex gap-4 bg-green-50 rounded-lg p-4 shadow items-center">
                    <img src={im4} alt="User Report" className="w-24 h-24 object-cover rounded border cursor-pointer" onClick={() => setFullscreenImg(im4)} />
                    <div className="flex-1">
                      <div className="font-semibold">Buea/Sanpit</div>
                      <div className="text-gray-700 text-sm">A steep slope at the edge of our quarter has become a growing concern. Over the past weeks, visible cracks have appeared on the ground, stretching across several meters. Trees on the slope are leaning precariously, with their roots partially exposed, indicating significant soil movement. Residents nearby have also reported hearing faint rumbling sounds, particularly after the recent rains, suggesting that the ground might be shifting.</div>
                    </div>
                  </div>
                </div>
                {/* Map with User Report Marker */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">User Report Map</h3>
                  <MapContainer center={[4.159, 9.241]} zoom={13} className="h-80 w-full rounded-lg shadow z-[100]">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[4.159, 9.241]}>
                      <Popup>Buea/Sanpit: User Report</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}
            {vulTab === 'sat' && (
              <>
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Satellite Vulnerability Reports List */}
                  <div className="flex-1 space-y-4">
                    <h3 className="text-lg font-semibold mb-2">Satellite Vulnerability Reports</h3>
                    {satReports.map((report) => (
                      <div key={report.id} className="flex gap-4 bg-green-50 rounded-lg p-4 shadow items-center">
                        <img src={report.image} alt="Satellite" className="w-24 h-24 object-cover rounded border cursor-pointer" onClick={() => setFullscreenImg(report.image)} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-block w-3 h-3 rounded-full ${severityColors[report.severity]}`}></span>
                            <span className="font-bold capitalize">{report.severity} risk</span>
                            <span className="ml-2 text-xs text-gray-500">{report.time}</span>
                          </div>
                          <div className="font-semibold">{report.address}</div>
                          <div className="text-gray-700 text-sm">{report.description}</div>
                          {/* Map icon for full screen map */}
                          <button
                            className="mt-2 p-2 rounded-full bg-green-200 hover:bg-green-400 text-green-800 shadow"
                            title="Show on Map"
                            onClick={() => setShowSensorMap(report.id)}
                          >
                            <FaMapMarkerAlt />
                          </button>
                          {/* Message/Ask DeepSeek icon */}
                          <SatelliteAsk report={report} />
                          {/* Command & Control for Drones/Satellites */}
                          <div className="mt-3 flex flex-col gap-2">
                            <div className="font-semibold text-green-700">Command & Control</div>
                            <div className="flex gap-2 items-center">
                              <span className="text-sm text-gray-700">Lat: {report.location.lat}, Lng: {report.location.lng}</span>
                              <button
                                className={`px-4 py-2 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${report.videoRequested ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-green-500'}`}
                                onClick={() => handleRequestVideoFeed(report)}
                                disabled={!!report.videoRequested}
                              >
                                {report.videoRequested ? '✓ Video Requested' : 'Request Video Feed'}
                              </button>
                            </div>
                            {report.videoRequested && (
                              <div className="mt-2 p-2 bg-green-100 rounded text-green-700 font-semibold flex items-center gap-2">
                                <FaVideo className="text-green-600" />
                                <span>Video feed requested for ({report.location.lat}, {report.location.lng})</span>
                                <button className="ml-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold shadow-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2" onClick={() => handleViewVideoFeed(report)}>View Feed</button>
                              </div>
                            )}
                          </div>
                          {/* Additional actions */}
                          <div className="mt-3 flex gap-3 items-center relative">
                            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 relative" onClick={() => handleMarkForInvestigation(report)}>
                              Mark for Investigation
                              {/* Green circled check if already marked */}
                              {investigationPoints.some(p => p.uniqueKey === `${activeHazard}-${report.id}`) && (
                                <span className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg z-10">
                                  <FaCheckCircle className="text-green-500 text-lg" style={{ borderRadius: '50%', background: 'white' }} />
                                </span>
                              )}
                            </button>
                            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" onClick={() => handleAlertAuthorities(report)}>
                              Alert Authorities
                            </button>
                          </div>
                          {showSensorMap === report.id && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                              <div className="absolute inset-0 flex flex-col">
                                <button className="absolute top-6 right-10 z-[200] text-5xl font-extrabold text-white bg-red-500 bg-opacity-80 rounded-full px-4 py-2 shadow-lg hover:bg-red-700 hover:scale-110 transition-all focus:outline-none" onClick={() => setShowSensorMap(null)} title="Close">&times;</button>
                                <div className="absolute top-8 left-8 bg-white bg-opacity-90 rounded shadow p-4 z-50">
                                  <h4 className="font-bold mb-2">{report.address} Location</h4>
                                  <div className="mb-2 text-sm text-gray-600">Lat: {report.location.lat}, Lng: {report.location.lng}</div>
                                </div>
                                <MapContainer center={[report.location.lat, report.location.lng]} zoom={15} className="w-full h-full z-[100]">
                                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                  <Marker position={[report.location.lat, report.location.lng]}>
                                    <Popup>{report.address}</Popup>
                                  </Marker>
                                  <Polygon positions={getPentagonPoints(report.location, 0.002)} pathOptions={{ color: 'purple', fillOpacity: 0.2 }} />
                                </MapContainer>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Map with User Report Marker */}
                  {/* Satellite Analysis Map removed as requested */}
                </div>
                {/* Investigation Points List: always visible, even if empty */}
                <div className="mt-8 bg-green-50 rounded-xl p-6 shadow border border-green-200">
                  <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">Investigation Points <FaCheckCircle className="text-yellow-500" /></h3>
                  {investigationPoints.length === 0 ? (
                    <div className="text-green-400 font-semibold">No points marked for investigation yet.</div>
                  ) : (
                    <ul className="space-y-3">
                      {investigationPoints.map(point => (
                        <li key={point.uniqueKey} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-white rounded-lg p-4 shadow border border-green-100">
                          <div className="flex items-center gap-2">
                            <FaCheckCircle className="text-yellow-500" title="Marked for Investigation" />
                            <div>
                              <div className="font-semibold text-green-700">{point.address}</div>
                              <div className="text-sm text-gray-600">Lat: {point.lat}, Lng: {point.lng}</div>
                              <div className="text-xs text-gray-500">{point.description}</div>
                              <div className="text-xs text-gray-400">{point.time}</div>
                            </div>
                          </div>
                          <div className="flex gap-3 items-center mt-2 md:mt-0">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${point.severity === 'critical' ? 'bg-red-500 text-white' : point.severity === 'moderate' ? 'bg-yellow-400 text-black' : 'bg-green-500 text-white'}`}>{point.severity}</span>
                            {point.videoAvailable ? (
                              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-200 text-green-800 font-semibold text-xs"><FaVideo /> Video Feed Available</span>
                            ) : (
                              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 text-gray-600 font-semibold text-xs"><FaVideo /> No Video</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <ToastContainer />
    </main>
    {/* Fullscreen image modal */}
    {fullscreenImg && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={() => setFullscreenImg(null)}>
        <img src={fullscreenImg} alt="Full Screen" className="max-w-4xl max-h-[90vh] rounded shadow-lg border-4 border-white" />
        <button className="absolute top-8 right-12 text-4xl text-white font-bold hover:text-red-400 z-50" onClick={e => { e.stopPropagation(); setFullscreenImg(null); }}>&times;</button>
      </div>
    )}
  </div>
  </>
  );
};

export default ScientistsComponent;


