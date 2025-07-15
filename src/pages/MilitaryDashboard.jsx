import React, { useEffect, useState } from "react";
import { FaShieldAlt, FaSatellite, FaUsers, FaTasks, FaMapMarkedAlt, FaHeadset, FaEye, FaExclamationTriangle, FaPlane, FaTruck, FaFirstAid, FaChartLine, FaRobot, FaTimes, FaRegCommentDots } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import OpenAI from "openai";

// Initialize OpenAI with DeepSeek API Key and Base URL
const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
});

const MilitaryDashboard = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [activeOperations, setActiveOperations] = useState(3);
  const [personnelDeployed, setPersonnelDeployed] = useState(125);
  const [assetsAvailable, setAssetsAvailable] = useState(18);
  const [threatLevel, setThreatLevel] = useState("MODERATE");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Sample disaster alerts
  const disasterAlerts = [
    {
      id: 1,
      title: "Landslide Risk - Buea",
      severity: "HIGH",
      location: { lat: 4.159, lng: 9.241 },
      description: "Satellite imagery shows significant ground movement and slope instability in Buea area. Immediate evacuation recommended for 150 civilians.",
      time: "2025-07-12 10:30:00",
      affected: "150 civilians",
      resources: "2 helicopters, 45 personnel"
    },
    {
      id: 2,
      title: "Flood Alert - Limbe",
      severity: "MODERATE",
      location: { lat: 4.035, lng: 9.689 },
      description: "Rising water levels detected in Limbe coastal area. Moderate flooding expected affecting low-lying residential areas.",
      time: "2025-07-12 09:45:00",
      affected: "85 civilians",
      resources: "3 boats, 28 personnel"
    },
    {
      id: 3,
      title: "Volcanic Activity - Mt. Cameroon",
      severity: "CRITICAL",
      location: { lat: 4.203, lng: 9.170 },
      description: "Increased seismic activity and thermal anomalies detected. Ash plume expanding. Immediate evacuation of 5km radius required.",
      time: "2025-07-12 11:15:00",
      affected: "300 civilians",
      resources: "5 helicopters, 80 personnel"
    }
  ];

  const getSeverityColor = (severity) => {
    switch(severity) {
      case "CRITICAL": return "bg-red-600";
      case "HIGH": return "bg-orange-500";
      case "MODERATE": return "bg-yellow-500";
      case "LOW": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const handleAIChat = async () => {
    if (!aiQuestion.trim()) return;
    setIsLoadingAI(true);
    setAiResponse("");
    
    try {
      // Prepare context for AI
      const contextString = `Military Disaster Response Context:\n` +
        `Alert: ${selectedAlert?.title}\n` +
        `Location: ${selectedAlert?.location.lat}, ${selectedAlert?.location.lng}\n` +
        `Severity: ${selectedAlert?.severity}\n` +
        `Description: ${selectedAlert?.description}\n` +
        `Time: ${selectedAlert?.time}`;

      const completion = await openai.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: "You are a military tactical AI assistant specializing in disaster response and rescue operations. Use tools and reasoning to provide precise, actionable tactical recommendations including specific escape paths with actual location names around disaster areas. Focus on identifying real roads, landmarks, neighborhoods, and safe zones by name. Provide evacuation routes, resource deployment strategies, and operational tactics. Be specific about locations and use geographic knowledge to suggest the best escape routes." 
          },
          { role: "system", content: contextString },
          { role: "user", content: aiQuestion },
        ],
        model: "deepseek/deepseek-r1:free",
      });
      
      setAiResponse(completion.choices[0].message.content || "No response available.");
    } catch (error) {
      console.error("AI Chat Error:", error);
      setAiResponse("Error connecting to AI assistant. Please try again.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Function to determine if a nav item is active
  const isActiveNavItem = (path) => {
    return location.pathname === path;
  };

  // Notification for new messages
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "messages") {
        const allMsgs = JSON.parse(e.newValue || "[]");
        const newMsgs = allMsgs.filter(m => m.recipient === "Military" && !messages.some(msg => msg.id === m.id));
        if (newMsgs.length > 0) {
          toast.info(`New message from ${newMsgs[newMsgs.length-1].sender}`);
          setMessages(allMsgs.filter(m => m.recipient === "Military" || m.sender === "Military"));
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-200 p-8">
      <nav className="terra-navbar h-16 fixed top-0 left-0 w-full z-40 bg-white shadow-xl flex items-center px-8 border-b border-green-300 backdrop-blur-lg" style={{ backgroundColor: 'white' }}>
        <div className="logo flex items-center">
          <img src="/src/pages/logo.png" alt="TerraALERT Logo" className="h-10 w-auto drop-shadow-lg" />
        </div>
        <ul className="menu flex gap-8 ml-auto text-green-800 font-semibold text-lg" style={{ color: '#166534' }}>
          <li><Link to="/military" className={`hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 ${isActiveNavItem('/military') ? 'bg-green-200 border-2 border-green-500 shadow-md' : ''}`} style={{ color: '#166534', backgroundColor: isActiveNavItem('/military') ? '#bbf7d0' : 'transparent' }}>Dashboard</Link></li>
          <li><Link to="/message?role=Military" className={`hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 ${isActiveNavItem('/message') ? 'bg-green-200 border-2 border-green-500 shadow-md' : ''}`} style={{ color: '#166534', backgroundColor: isActiveNavItem('/message') ? '#bbf7d0' : 'transparent' }}>Messaging</Link></li>
          <li><Link to="/upload" className={`hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 ${isActiveNavItem('/upload') ? 'bg-green-200 border-2 border-green-500 shadow-md' : ''}`} style={{ color: '#166534', backgroundColor: isActiveNavItem('/upload') ? '#bbf7d0' : 'transparent' }}>Create Alert</Link></li>
          <li><Link to="/admin" className={`hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 ${isActiveNavItem('/admin') ? 'bg-green-200 border-2 border-green-500 shadow-md' : ''}`} style={{ color: '#166534', backgroundColor: isActiveNavItem('/admin') ? '#bbf7d0' : 'transparent' }}>Administration</Link></li>
          <li><button onClick={() => { localStorage.removeItem('userRole'); window.location.href = '/'; }} className="hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 border border-green-500 hover:border-green-600" style={{ color: '#166534' }}>Logout</button></li>
        </ul>
      </nav>
      <div className="pt-20">
        <div className="max-w-7xl mx-auto bg-white/95 rounded-3xl shadow-2xl p-10 border border-green-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-extrabold text-green-800 mb-4 md:mb-0 flex items-center gap-3 tracking-tight drop-shadow">
              <FaShieldAlt className="text-green-600" /> Military Command Center
            </h1>
            <div className="flex items-center gap-4 bg-green-50 rounded-full px-6 py-3 border border-green-200">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${threatLevel === 'LOW' ? 'bg-green-400' : threatLevel === 'MODERATE' ? 'bg-green-600' : 'bg-green-800'} animate-pulse`}></div>
                <span className="text-sm font-bold text-green-800">Threat Level: {threatLevel}</span>
              </div>
            </div>
          </div>

          {/* Disaster Alerts Section - Now First */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-3">
              <FaExclamationTriangle className="text-green-600" /> Disaster Alerts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {disasterAlerts.map((alert) => (
                <div key={alert.id} className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-green-800">{alert.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4 text-sm">{alert.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Affected:</span>
                      <span className="font-semibold text-green-800">{alert.affected}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Resources:</span>
                      <span className="font-semibold text-green-800">{alert.resources}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-semibold text-gray-800">{alert.time}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedAlert(alert)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-2 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-md"
                  >
                    Show Details & Map
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Alert Details Modal */}
          {selectedAlert && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-green-800 flex items-center gap-3">
                    <FaExclamationTriangle className="text-green-600" />
                    {selectedAlert.title} - Detail View
                  </h2>
                  <button 
                    onClick={() => setSelectedAlert(null)}
                    className="text-gray-500 hover:text-green-600 text-2xl"
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Alert Information */}
                  <div className="space-y-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h3 className="font-bold text-green-800 mb-2">Alert Information</h3>
                      <p className="text-gray-700 mb-3">{selectedAlert.description}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Severity:</span>
                          <span className={`ml-2 px-2 py-1 rounded text-white text-sm font-bold ${getSeverityColor(selectedAlert.severity)}`}>
                            {selectedAlert.severity}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Location:</span>
                          <span className="ml-2 font-semibold">{selectedAlert.location.lat.toFixed(3)}, {selectedAlert.location.lng.toFixed(3)}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Affected:</span>
                          <span className="ml-2 font-semibold text-green-800">{selectedAlert.affected}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Resources:</span>
                          <span className="ml-2 font-semibold text-green-800">{selectedAlert.resources}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* AI Chat Section */}
                    <div className="bg-gradient-to-br from-green-50 via-white to-green-100 rounded-2xl shadow-lg border border-green-200 overflow-hidden">
                      <div className="flex items-center gap-3 px-6 pt-6 pb-2 border-b border-green-100 bg-gradient-to-r from-green-700 to-green-400">
                        <FaRegCommentDots className="text-2xl text-white" />
                        <h3 className="text-xl font-extrabold text-white tracking-tight !text-white">AI Rescue Path Assistant</h3>
                      </div>
                      
                      <div className="px-6 pt-3 pb-2 text-xs text-green-700 bg-green-50 border-b border-green-100 whitespace-pre-line font-mono">
                        {`Alert Context:\nLocation: ${selectedAlert.title}\nSeverity: ${selectedAlert.severity}\nCoordinates: ${selectedAlert.location.lat}, ${selectedAlert.location.lng}`}
                      </div>

                      <div className="flex-1 flex flex-col gap-2 px-6 py-4 bg-white min-h-[120px] max-h-72 overflow-y-auto">
                        {/* Chat bubbles */}
                        {aiQuestion && (
                          <div className="flex justify-end mb-1">
                            <div className="bg-green-600 text-white px-4 py-2 rounded-2xl rounded-br-sm shadow max-w-[80%] text-sm">
                              {aiQuestion}
                            </div>
                          </div>
                        )}
                        {aiResponse && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-sm shadow max-w-[80%] text-gray-800 text-sm prose prose-green whitespace-pre-line" style={{overflowWrap:'anywhere'}}>
                              <FormattedAnswer answer={aiResponse} />
                            </div>
                          </div>
                        )}
                        {isLoadingAI && (
                          <div className="flex justify-start">
                            <div className="bg-gray-200 px-4 py-2 rounded-2xl rounded-bl-sm shadow text-gray-500 text-sm animate-pulse">Analyzing tactical situation...</div>
                          </div>
                        )}
                      </div>

                      <form className="flex gap-2 px-6 py-4 bg-green-50 border-t border-green-100" onSubmit={(e) => { e.preventDefault(); handleAIChat(); }}>
                        <input
                          type="text"
                          value={aiQuestion}
                          onChange={(e) => setAiQuestion(e.target.value)}
                          placeholder="Ask about rescue paths, evacuation routes, or tactical recommendations..."
                          className="flex-1 p-2 border border-green-200 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                          disabled={isLoadingAI}
                          autoFocus
                        />
                        <button
                          className="flex items-center gap-2 bg-gradient-to-br from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-6 py-2 rounded-full font-bold shadow-lg border-2 border-white hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-400 disabled:opacity-60"
                          type="submit"
                          disabled={isLoadingAI || !aiQuestion}
                          style={{ boxShadow: '0 2px 8px 0 rgba(0,128,80,0.10)' }}
                        >
                          {isLoadingAI ? (
                            <span className="flex items-center gap-2">
                              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-green-400 rounded-full"></span> 
                              Analyzing...
                            </span>
                          ) : (
                            <>
                              <FaRegCommentDots className="text-lg" /> Ask AI
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                  
                  {/* Map */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-3">Location Map</h3>
                    <div className="h-96 rounded-lg overflow-hidden">
                      <MapContainer 
                        center={[selectedAlert.location.lat, selectedAlert.location.lng]} 
                        zoom={12} 
                        className="h-full w-full"
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[selectedAlert.location.lat, selectedAlert.location.lng]}>
                          <Popup>
                            <div className="text-center">
                              <h4 className="font-bold text-green-800">{selectedAlert.title}</h4>
                              <p className="text-sm text-gray-600">{selectedAlert.description}</p>
                              <p className="text-xs text-gray-500 mt-2">Severity: {selectedAlert.severity}</p>
                            </div>
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-semibold text-sm">Active Operations</p>
                  <p className="text-2xl font-bold text-green-800">{activeOperations}</p>
                </div>
                <FaTasks className="text-3xl text-green-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-semibold text-sm">Personnel Deployed</p>
                  <p className="text-2xl font-bold text-green-800">{personnelDeployed}</p>
                </div>
                <FaUsers className="text-3xl text-green-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-semibold text-sm">Assets Available</p>
                  <p className="text-2xl font-bold text-green-800">{assetsAvailable}</p>
                </div>
                <FaPlane className="text-3xl text-green-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-semibold text-sm">Communication Status</p>
                  <p className="text-lg font-bold text-green-800">SECURE</p>
                </div>
                <FaHeadset className="text-3xl text-green-500" />
              </div>
            </div>
          </div>

          {/* Main Command Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-bold text-green-800 flex items-center gap-3 mb-4">
                <FaSatellite className="text-green-600" /> Intelligence & Surveillance
              </h2>
              <p className="text-green-700 mb-4">Real-time monitoring of disaster zones through satellite imagery, drone feeds, and ground intelligence reports.</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Satellite Coverage:</span>
                  <span className="font-semibold text-green-800">87%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Drone Feeds:</span>
                  <span className="font-semibold text-green-800">5 Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Ground Reports:</span>
                  <span className="font-semibold text-green-800">12 Today</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-500 text-white py-2 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-md">
                View Live Feeds
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-bold text-green-800 flex items-center gap-3 mb-4">
                <FaUsers className="text-green-600" /> Personnel Management
              </h2>
              <p className="text-green-700 mb-4">Track and coordinate military personnel deployment, assignments, and operational status in real-time.</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Search & Rescue:</span>
                  <span className="font-semibold text-green-800">45 Personnel</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Logistics Support:</span>
                  <span className="font-semibold text-green-800">38 Personnel</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Medical Corps:</span>
                  <span className="font-semibold text-green-800">22 Personnel</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-500 text-white py-2 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-md">
                Manage Personnel
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-bold text-green-800 flex items-center gap-3 mb-4">
                <FaMapMarkedAlt className="text-green-600" /> Tactical Operations
              </h2>
              <p className="text-green-700 mb-4">Plan, execute, and monitor tactical operations including evacuation routes, secure zones, and resource allocation.</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Evacuation Routes:</span>
                  <span className="font-semibold text-green-800">8 Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Secure Zones:</span>
                  <span className="font-semibold text-green-800">3 Established</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Checkpoints:</span>
                  <span className="font-semibold text-green-800">12 Manned</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-500 text-white py-2 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-md">
                View Operations Map
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-bold text-green-800 flex items-center gap-3 mb-4">
                <FaTruck className="text-green-600" /> Logistics & Supply Chain
              </h2>
              <p className="text-green-700 mb-4">Manage equipment, supplies, and resource distribution to support ongoing disaster response operations.</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Supply Depots:</span>
                  <span className="font-semibold text-green-800">4 Operational</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Transport Vehicles:</span>
                  <span className="font-semibold text-green-800">18 Deployed</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Fuel Reserves:</span>
                  <span className="font-semibold text-green-800">78% Full</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-500 text-white py-2 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-md">
                Manage Logistics
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-bold text-green-800 flex items-center gap-3 mb-4">
                <FaFirstAid className="text-green-600" /> Medical Support
              </h2>
              <p className="text-green-700 mb-4">Coordinate medical response teams, field hospitals, and emergency medical services for disaster victims.</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Field Hospitals:</span>
                  <span className="font-semibold text-green-800">2 Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Medical Teams:</span>
                  <span className="font-semibold text-green-800">6 Deployed</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Patients Treated:</span>
                  <span className="font-semibold text-green-800">143 Today</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-500 text-white py-2 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-md">
                Medical Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Format answer with basic markdown (bold, lists, line breaks)
function FormattedAnswer({ answer }) {
  // Simple formatting: bold, lists, line breaks
  let formatted = answer
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
    .replace(/\- (.*?)(?=<br\/>|$)/g, '<li>$1</li>');
  // Wrap lists in <ul>
  formatted = formatted.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
  return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
}

export default MilitaryDashboard;
