import React, { useEffect, useState } from "react";
import { FaHeartbeat, FaHospital, FaAmbulance, FaUserMd, FaSyringe, FaComments } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const HealthPersonnelDashboard = () => {
  const [messages, setMessages] = useState([]);

  // Notification for new messages
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "messages") {
        const allMsgs = JSON.parse(e.newValue || "[]");
        const newMsgs = allMsgs.filter(m => m.recipient === "Health Personnel" && !messages.some(msg => msg.id === m.id));
        if (newMsgs.length > 0) {
          toast.info(`New message from ${newMsgs[newMsgs.length-1].sender}`);
          setMessages(allMsgs.filter(m => m.recipient === "Health Personnel" || m.sender === "Health Personnel"));
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
          <li><Link to="/health">Dashboard</Link></li>
          <li><Link to="/message?role=Health%20Personnel">Messaging</Link></li>
          <li><Link to="/upload">Create Alert</Link></li>
          <li><Link to="/admin">Administration</Link></li>
          <li><button onClick={() => { localStorage.removeItem('userRole'); window.location.href = '/'; }} className="hover:underline">Logout</button></li>
        </ul>
      </nav>
      <div className="pt-20 max-w-6xl mx-auto bg-white/90 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-3">
          <FaHeartbeat className="text-red-500" /> Health Personnel Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-blue-50 rounded-lg p-6 shadow flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2"><FaHospital /> Health Alerts Feed</h2>
            <div className="text-gray-700">Real-time updates on injuries, exposure, or outbreaks. Heat maps of affected populations. Triggered by field reports or scientist simulations.</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 shadow flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2"><FaUserMd /> Medical Case Tracker</h2>
            <div className="text-gray-700">Dashboard of active cases with triage priority. Tabs for gas exposure, injuries, fatalities. Syncs with field and hospital reports.</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 shadow flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2"><FaAmbulance /> Resource Management</h2>
            <div className="text-gray-700">View and update availability of beds, ambulances, oxygen, vaccines. Request supplies and redeploy personnel.</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 shadow flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2"><FaSyringe /> Health Response Planner</h2>
            <div className="text-gray-700">Deploy health teams, schedule mobile clinics, access health response protocols, and plan vaccination drives.</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-6 shadow flex flex-col gap-4 md:col-span-2">
            <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2"><FaComments /> Messaging System</h2>
            <div className="text-gray-700">Receive instructions from scientists/government. Send alerts to hospitals and clinics. Notify public on health precautions.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthPersonnelDashboard;
