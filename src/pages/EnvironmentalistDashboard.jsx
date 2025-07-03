import React, { useEffect, useState } from "react";
import { FaLeaf, FaMapMarkedAlt, FaChartLine, FaCamera, FaComments, FaFlask } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const EnvironmentalistDashboard = () => {
  const [messages, setMessages] = useState([]);

  // Notification for new messages
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "messages") {
        const allMsgs = JSON.parse(e.newValue || "[]");
        const newMsgs = allMsgs.filter(m => m.recipient === "Environmentalists" && !messages.some(msg => msg.id === m.id));
        if (newMsgs.length > 0) {
          toast.info(`New message from ${newMsgs[newMsgs.length-1].sender}`);
          setMessages(allMsgs.filter(m => m.recipient === "Environmentalists" || m.sender === "Environmentalists"));
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-8">
      <nav className="navbar h-16 fixed top-0 left-0 w-full z-40 bg-white shadow flex items-center px-8">
        <div className="logo font-bold text-2xl text-green-700">TerraALERT</div>
        <ul className="menu flex gap-8 ml-auto text-green-700 font-semibold">
          <li><Link to="/environmentalists">Dashboard</Link></li>
          <li><Link to="/message?role=Environmentalists">Messaging</Link></li>
          <li><Link to="/upload">Create Alert</Link></li>
          <li><Link to="/admin">Administration</Link></li>
          <li><button onClick={() => { localStorage.removeItem('userRole'); window.location.href = '/'; }} className="hover:underline">Logout</button></li>
        </ul>
      </nav>
      <div className="pt-20 max-w-6xl mx-auto bg-white/90 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-3">
          <FaLeaf className="text-green-500" /> Environmentalist Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-blue-50 rounded-lg p-6 shadow flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2"><FaChartLine /> Environmental Data Panel</h2>
            <div className="text-gray-700">Real-time data from CO₂ sensors, rainfall, soil movement, and temperature. Visual graphs and alert triggers for threshold breaches.</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 shadow flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2"><FaMapMarkedAlt /> Risk Mapping & Zoning</h2>
            <div className="text-gray-700">Interactive map showing volcano zones, landslide slopes, degassing areas. Mark and annotate at-risk regions.</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 shadow flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2"><FaCamera /> Field Report Submission</h2>
            <div className="text-gray-700">Upload site observations, lab data, and images. Classify severity and auto-share with scientists and government.</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 shadow flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2"><FaFlask /> Simulation Review Access</h2>
            <div className="text-gray-700">View simplified scientific simulations and interpretation panel. Suggest field action based on trends.</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 shadow flex flex-col gap-4 md:col-span-2">
            <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2"><FaComments /> Messaging Module</h2>
            <div className="text-gray-700">Share local observations with scientists. Receive instructions for monitoring high-risk zones. Collaborate with emergency teams.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalistDashboard;
