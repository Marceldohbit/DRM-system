import React, { useEffect, useState } from "react";
import { FaMapMarkedAlt, FaBullhorn, FaClipboardList, FaRoute, FaTruck, FaBroadcastTower } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const LocalGovernmentDashboard = () => {
  const [messages, setMessages] = useState([]);

  // Notification for new messages
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "messages") {
        const allMsgs = JSON.parse(e.newValue || "[]");
        const newMsgs = allMsgs.filter(m => m.recipient === "Local Government" && !messages.some(msg => msg.id === m.id));
        if (newMsgs.length > 0) {
          toast.info(`New message from ${newMsgs[newMsgs.length-1].sender}`);
          setMessages(allMsgs.filter(m => m.recipient === "Local Government" || m.sender === "Local Government"));
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-8">
      <nav className="navbar h-16 fixed top-0 left-0 w-full z-40 bg-white shadow flex items-center px-8">
        <div className="logo font-bold text-2xl text-blue-700">TerraALERT</div>
        <ul className="menu flex gap-8 ml-auto text-blue-700 font-semibold">
          <li><Link to="/local-gov">Dashboard</Link></li>
          <li><Link to="/message?role=Local%20Government">Messaging</Link></li>
          <li><Link to="/upload">Create Alert</Link></li>
          <li><Link to="/admin">Administration</Link></li>
          <li><button onClick={() => { localStorage.removeItem('userRole'); window.location.href = '/'; }} className="hover:underline">Logout</button></li>
        </ul>
      </nav>
      <div className="pt-20 max-w-6xl mx-auto bg-white/90 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-3">
          <FaMapMarkedAlt className="text-blue-500" /> Local Government Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-blue-50 rounded-lg p-6 shadow flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2"><FaBroadcastTower /> Disaster Alert Notifications</h2>
            <div className="text-gray-700">View and manage real-time disaster alerts for your municipality. Issue public warnings and monitor alert status.</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 shadow flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2"><FaClipboardList /> Damage Assessment Reports</h2>
            <div className="text-gray-700">Access and submit damage assessment reports. Review field data and photos from affected areas.</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 shadow flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2"><FaRoute /> Evacuation Planning & Scheduling</h2>
            <div className="text-gray-700">Plan and schedule evacuation routes. Assign shelters and track evacuation progress in real time.</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 shadow flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2"><FaTruck /> Resource Tracking</h2>
            <div className="text-gray-700">Monitor the status and location of critical resources (vehicles, supplies, personnel) for disaster response.</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 shadow flex flex-col gap-4 md:col-span-2">
            <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2"><FaBullhorn /> Public Announcement Generator</h2>
            <div className="text-gray-700">Draft and broadcast public announcements to inform citizens about safety measures, evacuation orders, and updates.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalGovernmentDashboard;
