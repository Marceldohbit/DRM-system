import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import aggressiveSound from "./siren.mp3";
import im4 from '/images/img4.jpg'
import MapComponent from "./MapComponent";
import { FaMountain, FaWater, FaVolcano } from "react-icons/fa6";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaPlus, FaMapMarkerAlt } from "react-icons/fa";
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
      image: im4,
      location: { lat: 4.159, lng: 9.241 },
      address: "Buea, Cameroon",
      severity: "critical",
      description: "Satellite mapping shows severe inundation. Floodwaters rising rapidly.",
      time: "2025-06-27 10:20:00",
    },
    {
      id: 2,
      image: im4,
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
      image: im4,
      location: { lat: 4.159, lng: 9.241 },
      address: "Buea, Cameroon",
      severity: "critical",
      description: "Thermal satellite imagery shows high ground temperature and ash plume. Hazard zone expanding.",
      time: "2025-06-27 10:25:00",
    },
    {
      id: 2,
      image: im4,
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
    { label: "Seismic Activities (Hz)", key: "seismic" },
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

const ScientistsComponent = () => {
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
  const [activeHazard, setActiveHazard] = useState("landslide");
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

// Ensure reports is defined in the component before use
const reports = hazardVulnerabilityReports[activeHazard] || [];

  return (
    <>
    {/* Hide navbar when showing sensor map */}
    {showSensorMap === null && (
      <nav className="navbar h-18 fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-indigo-900 via-indigo-600 to-cyan-500 shadow-xl flex items-center px-10 border-b border-indigo-300 backdrop-blur-lg">
        <div className="logo font-extrabold text-3xl tracking-tight text-white drop-shadow-lg">TerraALERT</div>
        <ul className="menu flex gap-10 ml-auto text-white font-semibold text-lg">
          <li><Link to="/science" className="hover:text-cyan-200 transition">Dashboard</Link></li>
          <li><Link to="/message?role=Scientists" className="hover:text-cyan-200 transition">Messaging</Link></li>
          <li><Link to="/upload" className="hover:text-cyan-200 transition">Create Alert</Link></li>
          <li><Link to="/admin" className="hover:text-cyan-200 transition">Administration</Link></li>
          <li><button onClick={() => { localStorage.removeItem('userRole'); window.location.href = '/'; }} className="hover:underline">Logout</button></li>
        </ul>
      </nav>
    )}
    <div className="min-h-screen flex bg-gradient-to-br from-blue-100 via-blue-200 to-blue-50 pt-24">
    {/* Sidebar Navigation */}
    <aside className="w-72 bg-white/80 shadow-2xl flex flex-col py-10 px-6 gap-8 fixed top-20 left-0 h-[calc(100vh-5rem)] z-40 rounded-tr-3xl rounded-br-3xl border-r border-blue-200 backdrop-blur-md">
      <h1 className="text-3xl font-extrabold text-blue-800 mb-10 tracking-tight">Hazards</h1>
      <nav className="flex flex-col gap-6">
        {hazards.map((hazard) => (
          <button
            key={hazard.key}
            className={`flex items-center gap-4 px-6 py-3 rounded-xl font-bold text-lg shadow transition-all duration-200 border-2 focus:outline-none tracking-tight ${activeHazard === hazard.key ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white border-blue-600 shadow-lg scale-105' : 'bg-white/80 text-blue-800 border-blue-300 hover:bg-blue-100/80'}`}
            onClick={() => setActiveHazard(hazard.key)}
          >
            {hazard.icon} {hazard.label}
          </button>
        ))}
      </nav>
    </aside>
    {/* Main Content */}
    <main className="flex-1 p-10 ml-72 mt-4 overflow-y-auto h-[calc(100vh-5rem)]">
      <div className="max-w-7xl mx-auto bg-white/95 rounded-3xl shadow-2xl p-10 border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
          <h2 className="text-3xl font-extrabold text-blue-800 tracking-tight drop-shadow">{hazards.find(h => h.key === activeHazard)?.label} Dashboard</h2>
          <div className="flex gap-4">
            <button
              className={`px-6 py-2 rounded-full font-bold border-2 text-lg shadow transition-all duration-200 focus:outline-none tracking-tight ${activeTab === 'sensor' ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white border-blue-600 shadow-lg scale-105' : 'bg-white/80 text-blue-800 border-blue-300 hover:bg-blue-100/80'}`}
              onClick={() => setActiveTab('sensor')}
            >Sensor Data</button>
            <button
              className={`px-6 py-2 rounded-full font-bold border-2 text-lg shadow transition-all duration-200 focus:outline-none tracking-tight ${activeTab === 'vulnerability' ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white border-blue-600 shadow-lg scale-105' : 'bg-white/80 text-blue-800 border-blue-300 hover:bg-blue-100/80'}`}
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
                  className="border border-gray-300 rounded px-3 py-2"
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
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder="Sensor name or address"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
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
                  <button className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700" onClick={handleAddSensor}>Add</button>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {filteredSensors.map((sensor, idx) => {
                // Find the correct index for sensorHistories
                const sensorIdx = allSensors.findIndex(s => s.id === sensor.id);
                return (
                  <div
                    key={sensor.id}
                    className="relative bg-blue-50 rounded-lg p-6 shadow flex flex-col"
                    style={{ height: '22rem', minHeight: '16rem' }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">{sensor.name} <span className="text-xs text-gray-500">({sensor.address})</span></h3>
                      <div className="flex gap-2">
                        <button
                          className="p-2 rounded-full bg-blue-200 hover:bg-blue-400 text-blue-800"
                          onClick={() => setShowSensorMap(sensor.id)}
                          title="Show on Map"
                        >
                          <FaMapMarkerAlt />
                        </button>
                        <button
                          className="p-2 rounded-full bg-blue-200 hover:bg-blue-400 text-blue-800"
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
                              borderColor: 'rgb(37, 99, 235)',
                              backgroundColor: 'rgba(37, 99, 235, 0.1)',
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
                      <div className="bg-white bg-opacity-95 rounded-b-lg p-4 z-10 shadow-xl border-t border-blue-200 mt-2">
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
                                <span className={`font-mono font-bold px-2 py-1 rounded ${isCritical ? 'bg-red-500 text-white' : 'text-blue-700 bg-white'}`}>{param.value}</span>
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
            <div className="flex gap-4 mb-4">
              <button
                className={`px-4 py-2 rounded-full font-semibold border-2 transition-all duration-200 focus:outline-none ${vulTab === 'user' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-100'}`}
                onClick={() => setVulTab('user')}
              >User Reports</button>
              <button
                className={`px-4 py-2 rounded-full font-semibold border-2 transition-all duration-200 focus:outline-none ${vulTab === 'sat' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-100'}`}
                onClick={() => setVulTab('sat')}
              >Satellite Analysis</button>
            </div>
            {vulTab === 'user' && (
              <div className="flex flex-col md:flex-row gap-8">
                {/* User Vulnerability Reports List */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-lg font-semibold mb-2">User Vulnerability Reports</h3>
                  {/* Example user report, replace with real user data if available */}
                  <div className="flex gap-4 bg-blue-50 rounded-lg p-4 shadow items-center">
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
              <div className="flex flex-col md:flex-row gap-8">
                {/* Satellite Vulnerability Reports List */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-lg font-semibold mb-2">Satellite Vulnerability Reports</h3>
                  {reports.map((report) => (
                    <div key={report.id} className="flex gap-4 bg-blue-50 rounded-lg p-4 shadow items-center">
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
                          className="mt-2 p-2 rounded-full bg-blue-200 hover:bg-blue-400 text-blue-800 shadow"
                          title="Show on Map"
                          onClick={() => setShowSensorMap(report.id)}
                        >
                          <FaMapMarkerAlt />
                        </button>
                        {/* Command & Control for Drones/Satellites */}
                        <div className="mt-3 flex flex-col gap-2">
                          <div className="font-semibold text-blue-700">Command & Control</div>
                          <div className="flex gap-2 items-center">
                            <input
                              type="number"
                              step="0.0001"
                              placeholder="Latitude"
                              className="border border-blue-300 rounded px-2 py-1 w-28"
                              value={report.cmdLat || ''}
                              onChange={e => {
                                report.cmdLat = e.target.value;
                                setCmdRefresh(Math.random());
                              }}
                            />
                            <input
                              type="number"
                              step="0.0001"
                              placeholder="Longitude"
                              className="border border-blue-300 rounded px-2 py-1 w-28"
                              value={report.cmdLng || ''}
                              onChange={e => {
                                report.cmdLng = e.target.value;
                                setCmdRefresh(Math.random());
                              }}
                            />
                            
                            <button
                              className="px-3 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow"
                              onClick={() => handleRequestVideoFeed(report)}
                            >
                              Request Video Feed
                            </button>
                          </div>
                          {report.videoRequested && (
                            <div className="mt-2 p-2 bg-green-100 rounded text-green-700 font-semibold flex items-center gap-2">
                              <span>Video feed requested for ({report.cmdLat}, {report.cmdLng})</span>
                              <button className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => handleViewVideoFeed(report)}>View Feed</button>
                            </div>
                          )}
                        </div>
                        {/* Additional actions */}
                        <div className="mt-2 flex gap-2">
                          <button className="px-3 py-1 rounded bg-yellow-500 text-white font-semibold hover:bg-yellow-600 shadow" onClick={() => handleMarkForInvestigation(report)}>Mark for Investigation</button>
                          <button className="px-3 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700 shadow" onClick={() => handleAlertAuthorities(report)}>Alert Authorities</button>
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
            )}
            {vulTab === 'sat' && investigationPoints.length > 0 && (
              <div className="mt-8 bg-blue-50 rounded-xl p-6 shadow border border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Investigation Points</h3>
                <ul className="space-y-3">
                  {investigationPoints.map(point => (
                    <li key={point.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-white rounded-lg p-4 shadow border border-blue-100">
                      <div>
                        <div className="font-semibold text-blue-700">{point.address}</div>
                        <div className="text-sm text-gray-600">Lat: {point.lat}, Lng: {point.lng}</div>
                        <div className="text-xs text-gray-500">{point.description}</div>
                        <div className="text-xs text-gray-400">{point.time}</div>
                      </div>
                      <div className="flex gap-3 items-center mt-2 md:mt-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${point.severity === 'critical' ? 'bg-red-500 text-white' : point.severity === 'moderate' ? 'bg-yellow-400 text-black' : 'bg-green-500 text-white'}`}>{point.severity}</span>
                        {point.videoAvailable ? (
                          <span className="px-3 py-1 rounded-full bg-green-200 text-green-800 font-semibold text-xs">Video Feed Available</span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 font-semibold text-xs">No Video</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
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


