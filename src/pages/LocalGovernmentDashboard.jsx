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

  // Sidebar tabs
  const sidebarTabs = [
    { key: 'alerts', label: 'Disaster Alert Notifications', icon: <FaBroadcastTower /> },
    { key: 'damage', label: 'Damage Assessment Reports', icon: <FaClipboardList /> },
    { key: 'evac', label: 'Evacuation Planning & Scheduling', icon: <FaRoute /> },
    { key: 'resources', label: 'Resource Tracking', icon: <FaTruck /> },
    { key: 'announcements', label: 'Public Announcement Generator', icon: <FaBullhorn /> },
  ];
  const [activeTab, setActiveTab] = useState('alerts');

  // Tab content
  const tabContent = {
    alerts: {
      title: 'Disaster Alert Notifications',
      icon: <FaBroadcastTower />,
      desc: 'View and manage real-time disaster alerts for your municipality. Issue public warnings and monitor alert status.'
    },
    damage: {
      title: 'Damage Assessment Reports',
      icon: <FaClipboardList />,
      desc: 'Access and submit damage assessment reports. Review field data and photos from affected areas.'
    },
    evac: {
      title: 'Evacuation Planning & Scheduling',
      icon: <FaRoute />,
      desc: 'Plan and schedule evacuation routes. Assign shelters and track evacuation progress in real time.'
    },
    resources: {
      title: 'Resource Tracking',
      icon: <FaTruck />,
      desc: 'Monitor the status and location of critical resources (vehicles, supplies, personnel) for disaster response.'
    },
    announcements: {
      title: 'Public Announcement Generator',
      icon: <FaBullhorn />,
      desc: 'Draft and broadcast public announcements to inform citizens about safety measures, evacuation orders, and updates.'
    },
  };

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
      <div className="pt-20 max-w-7xl mx-auto flex gap-0">
        {/* Sidebar */}
        <aside className="w-72 bg-white/90 shadow-2xl flex flex-col py-10 px-6 gap-8 h-[calc(100vh-5rem)] z-40 rounded-tr-3xl rounded-br-3xl border-r-4 border-blue-200 backdrop-blur-md">
          <h1 className="text-2xl font-extrabold text-blue-700 mb-10 tracking-tight">Navigation</h1>
          <nav className="flex flex-col gap-4">
            {sidebarTabs.map(tab => (
              <button
                key={tab.key}
                className={`flex items-center gap-4 px-6 py-3 rounded-xl font-bold text-lg shadow transition-all duration-200 border-2 focus:outline-none tracking-tight ${activeTab === tab.key ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white border-blue-600 shadow-lg scale-105' : 'bg-white text-blue-800 border-blue-300 hover:bg-blue-100/80'}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-10 mt-4 overflow-y-auto h-[calc(100vh-5rem)]">
          <div className="bg-white/95 rounded-3xl shadow-2xl p-10 border-4 border-blue-100">
            <h1 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-3">
              {tabContent[activeTab].icon} {tabContent[activeTab].title}
            </h1>
            <div className="text-blue-900 text-lg mb-2 font-semibold">{tabContent[activeTab].desc}</div>
            {/* Add more detailed content for each tab here as needed */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LocalGovernmentDashboard;
