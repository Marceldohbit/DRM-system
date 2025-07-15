import React, { useEffect, useState } from "react";
import { FaMapMarkedAlt, FaBullhorn, FaClipboardList, FaRoute, FaTruck, FaBroadcastTower, FaUsers, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaSpinner, FaEye, FaEdit, FaTrash, FaPlus, FaPaperPlane, FaDownload, FaFileAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";

const LocalGovernmentDashboard = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('alerts');
  
  // Alert management state
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'Flood', severity: 'HIGH', location: 'Downtown District', status: 'Active', timestamp: '2025-07-12 10:30:00', affected: 1200, description: 'Heavy rainfall causing street flooding' },
    { id: 2, type: 'Landslide', severity: 'CRITICAL', location: 'Hillside Community', status: 'Monitoring', timestamp: '2025-07-12 09:15:00', affected: 350, description: 'Slope instability detected after recent rains' },
    { id: 3, type: 'Power Outage', severity: 'MODERATE', location: 'Industrial Zone', status: 'Resolved', timestamp: '2025-07-12 08:45:00', affected: 800, description: 'Electrical grid failure affecting businesses' }
  ]);

  // Damage assessment state
  const [damageReports, setDamageReports] = useState([
    { id: 1, location: 'Main Street Bridge', reporter: 'Public Works Dept', severity: 'Major', status: 'Under Review', timestamp: '2025-07-12 11:00:00', description: 'Structural damage to support beams', estimatedCost: '$125,000' },
    { id: 2, location: 'Elementary School', reporter: 'Education Dept', severity: 'Minor', status: 'Approved', timestamp: '2025-07-12 10:15:00', description: 'Roof damage from storm', estimatedCost: '$15,000' },
    { id: 3, location: 'Community Center', reporter: 'Facilities Manager', severity: 'Moderate', status: 'Pending', timestamp: '2025-07-12 09:30:00', description: 'Flooding in basement level', estimatedCost: '$45,000' }
  ]);

  // Evacuation planning state
  const [evacuationPlans, setEvacuationPlans] = useState([
    { id: 1, name: 'Coastal Evacuation Route A', zones: ['Zone 1', 'Zone 2'], capacity: 5000, status: 'Active', shelters: 3, lastUpdated: '2025-07-10' },
    { id: 2, name: 'Mountain Community Route B', zones: ['Zone 3'], capacity: 1200, status: 'Standby', shelters: 2, lastUpdated: '2025-07-08' },
    { id: 3, name: 'Urban Center Route C', zones: ['Zone 4', 'Zone 5'], capacity: 8000, status: 'Under Review', shelters: 5, lastUpdated: '2025-07-09' }
  ]);

  // Resource tracking state
  const [resources, setResources] = useState([
    { id: 1, type: 'Emergency Vehicle', name: 'Fire Truck Unit 1', status: 'Available', location: 'Fire Station A', lastMaintenance: '2025-07-01', capacity: '8 Personnel' },
    { id: 2, type: 'Supply Depot', name: 'Emergency Supply Center', status: 'Fully Stocked', location: 'Warehouse District', lastMaintenance: '2025-07-05', capacity: '500 Families' },
    { id: 3, type: 'Communication Hub', name: 'Emergency Radio Tower', status: 'Operational', location: 'City Hall', lastMaintenance: '2025-06-28', capacity: '50km Range' },
    { id: 4, type: 'Medical Facility', name: 'Mobile Medical Unit', status: 'Deployed', location: 'Downtown District', lastMaintenance: '2025-07-03', capacity: '20 Patients' }
  ]);

  // Public announcement state
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Flood Warning - Downtown', content: 'Residents advised to avoid low-lying areas', priority: 'High', status: 'Sent', timestamp: '2025-07-12 10:35:00', channels: ['SMS', 'Radio', 'Social Media'] },
    { id: 2, title: 'Evacuation Order - Hillside', content: 'Mandatory evacuation for residents in zones 1-3', priority: 'Critical', status: 'Sent', timestamp: '2025-07-12 09:20:00', channels: ['SMS', 'Radio', 'TV', 'Social Media'] },
    { id: 3, title: 'Power Restoration Update', content: 'Electricity restored to 90% of affected areas', priority: 'Medium', status: 'Draft', timestamp: '2025-07-12 11:45:00', channels: ['Social Media', 'Website'] }
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'Medium',
    channels: []
  });

  // Function to determine if a nav item is active
  const isActiveNavItem = (path) => {
    return location.pathname === path;
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'CRITICAL': return 'bg-red-600';
      case 'HIGH': return 'bg-orange-500';
      case 'MODERATE': return 'bg-yellow-500';
      case 'MINOR': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': case 'Operational': case 'Available': case 'Fully Stocked': return 'text-green-600';
      case 'Monitoring': case 'Standby': case 'Under Review': case 'Pending': return 'text-yellow-600';
      case 'Resolved': case 'Approved': case 'Sent': return 'text-blue-600';
      case 'Deployed': return 'text-purple-600';
      case 'Draft': return 'text-gray-600';
      default: return 'text-gray-500';
    }
  };

  const handleSendAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const announcement = {
      id: announcements.length + 1,
      ...newAnnouncement,
      status: 'Sent',
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    
    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({ title: '', content: '', priority: 'Medium', channels: [] });
    toast.success('Announcement sent successfully!');
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-200 p-8">
      <nav className="terra-navbar h-16 fixed top-0 left-0 w-full z-40 bg-white shadow-xl flex items-center px-8 border-b border-green-300 backdrop-blur-lg" style={{ backgroundColor: 'white' }}>
        <div className="logo flex items-center">
          <img src="/src/pages/logo.png" alt="TerraALERT Logo" className="h-10 w-auto drop-shadow-lg" />
        </div>
        <ul className="menu flex gap-8 ml-auto text-green-800 font-semibold text-lg" style={{ color: '#166534' }}>
          <li><Link to="/local-gov" className={`hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 ${isActiveNavItem('/local-gov') ? 'bg-green-200 border-2 border-green-500 shadow-md' : ''}`} style={{ color: '#166534', backgroundColor: isActiveNavItem('/local-gov') ? '#bbf7d0' : 'transparent' }}>Dashboard</Link></li>
          <li><Link to="/message?role=Local Government" className={`hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 ${isActiveNavItem('/message') ? 'bg-green-200 border-2 border-green-500 shadow-md' : ''}`} style={{ color: '#166534', backgroundColor: isActiveNavItem('/message') ? '#bbf7d0' : 'transparent' }}>Messaging</Link></li>
          <li><Link to="/upload" className={`hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 ${isActiveNavItem('/upload') ? 'bg-green-200 border-2 border-green-500 shadow-md' : ''}`} style={{ color: '#166534', backgroundColor: isActiveNavItem('/upload') ? '#bbf7d0' : 'transparent' }}>Create Alert</Link></li>
          <li><Link to="/admin" className={`hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 ${isActiveNavItem('/admin') ? 'bg-green-200 border-2 border-green-500 shadow-md' : ''}`} style={{ color: '#166534', backgroundColor: isActiveNavItem('/admin') ? '#bbf7d0' : 'transparent' }}>Administration</Link></li>
          <li><button onClick={() => { localStorage.removeItem('userRole'); window.location.href = '/'; }} className="hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 border border-green-500 hover:border-green-600" style={{ color: '#166534' }}>Logout</button></li>
        </ul>
      </nav>
      <div className="pt-20 max-w-7xl mx-auto flex gap-0">
        {/* Sidebar */}
        <aside className="w-72 bg-white/90 shadow-2xl flex flex-col py-10 px-6 gap-8 h-[calc(100vh-5rem)] z-40 rounded-tr-3xl rounded-br-3xl border-r-4 border-green-200 backdrop-blur-md">
          <h1 className="text-2xl font-extrabold text-green-800 mb-10 tracking-tight">Navigation</h1>
          <nav className="flex flex-col gap-4">
            {sidebarTabs.map(tab => (
              <button
                key={tab.key}
                className={`flex items-center gap-4 px-6 py-3 rounded-xl font-bold text-lg shadow transition-all duration-200 border-2 focus:outline-none tracking-tight ${activeTab === tab.key ? 'bg-gradient-to-r from-green-600 to-green-400 text-white border-green-600 shadow-lg scale-105' : 'bg-white text-green-800 border-green-300 hover:bg-green-100/80'}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-10 mt-4 overflow-y-auto h-[calc(100vh-5rem)]">
          <div className="bg-white/95 rounded-3xl shadow-2xl p-10 border-4 border-green-100">
            
            {/* Disaster Alert Notifications Tab */}
            {activeTab === 'alerts' && (
              <div>
                <h1 className="text-3xl font-bold text-green-800 mb-6 flex items-center gap-3">
                  <FaBroadcastTower className="text-green-600" /> Disaster Alert Notifications
                </h1>
                <p className="text-green-900 text-lg mb-6 font-semibold">Monitor and manage real-time disaster alerts for your municipality</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-green-800">{alert.type}</h3>
                        <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-semibold text-green-800">{alert.location}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-semibold ${getStatusColor(alert.status)}`}>{alert.status}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Affected:</span>
                          <span className="font-semibold text-green-800">{alert.affected} people</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-semibold text-gray-800">{alert.timestamp}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4 text-sm">{alert.description}</p>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-md text-sm">
                          <FaEye className="inline mr-2" /> View Details
                        </button>
                        <button className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition-all duration-200 shadow-md text-sm">
                          <FaEdit className="inline mr-2" /> Update
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Damage Assessment Reports Tab */}
            {activeTab === 'damage' && (
              <div>
                <h1 className="text-3xl font-bold text-green-800 mb-6 flex items-center gap-3">
                  <FaClipboardList className="text-green-600" /> Damage Assessment Reports
                </h1>
                <p className="text-green-900 text-lg mb-6 font-semibold">Review and manage damage assessment reports from the field</p>
                
                <div className="space-y-6">
                  {damageReports.map((report) => (
                    <div key={report.id} className="bg-gradient-to-r from-green-50 to-white rounded-xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-green-800">{report.location}</h3>
                        <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getSeverityColor(report.severity.toUpperCase())}`}>
                          {report.severity}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-600">Reporter:</span>
                          <p className="font-semibold text-green-800">{report.reporter}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Status:</span>
                          <p className={`font-semibold ${getStatusColor(report.status)}`}>{report.status}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Estimated Cost:</span>
                          <p className="font-semibold text-green-800">{report.estimatedCost}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Submitted:</span>
                          <p className="font-semibold text-gray-800">{report.timestamp}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{report.description}</p>
                      <div className="flex gap-2">
                        <button className="bg-gradient-to-r from-green-600 to-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-md">
                          <FaEye className="inline mr-2" /> View Full Report
                        </button>
                        <button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-md">
                          <FaDownload className="inline mr-2" /> Download
                        </button>
                        <button className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition-all duration-200 shadow-md">
                          <FaEdit className="inline mr-2" /> Update Status
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evacuation Planning Tab */}
            {activeTab === 'evac' && (
              <div>
                <h1 className="text-3xl font-bold text-green-800 mb-6 flex items-center gap-3">
                  <FaRoute className="text-green-600" /> Evacuation Planning & Scheduling
                </h1>
                <p className="text-green-900 text-lg mb-6 font-semibold">Plan and manage evacuation routes and emergency shelters</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {evacuationPlans.map((plan) => (
                    <div key={plan.id} className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-green-800">{plan.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(plan.status)}`}>
                          {plan.status}
                        </span>
                      </div>
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Evacuation Zones:</span>
                          <span className="font-semibold text-green-800">{plan.zones.join(', ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Capacity:</span>
                          <span className="font-semibold text-green-800">{plan.capacity.toLocaleString()} people</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Emergency Shelters:</span>
                          <span className="font-semibold text-green-800">{plan.shelters} locations</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Updated:</span>
                          <span className="font-semibold text-gray-800">{plan.lastUpdated}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-md">
                          <FaMapMarkedAlt className="inline mr-2" /> View Map
                        </button>
                        <button className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition-all duration-200 shadow-md">
                          <FaEdit className="inline mr-2" /> Edit Plan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resource Tracking Tab */}
            {activeTab === 'resources' && (
              <div>
                <h1 className="text-3xl font-bold text-green-800 mb-6 flex items-center gap-3">
                  <FaTruck className="text-green-600" /> Resource Tracking
                </h1>
                <p className="text-green-900 text-lg mb-6 font-semibold">Monitor and manage critical emergency resources</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resources.map((resource) => (
                    <div key={resource.id} className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-green-800">{resource.name}</h3>
                          <p className="text-sm text-gray-600">{resource.type}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(resource.status)}`}>
                          {resource.status}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-semibold text-green-800">{resource.location}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Capacity:</span>
                          <span className="font-semibold text-green-800">{resource.capacity}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Last Maintenance:</span>
                          <span className="font-semibold text-gray-800">{resource.lastMaintenance}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-md text-sm">
                          <FaEye className="inline mr-2" /> Track
                        </button>
                        <button className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition-all duration-200 shadow-md text-sm">
                          <FaEdit className="inline mr-2" /> Update
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Public Announcement Generator Tab */}
            {activeTab === 'announcements' && (
              <div>
                <h1 className="text-3xl font-bold text-green-800 mb-6 flex items-center gap-3">
                  <FaBullhorn className="text-green-600" /> Public Announcement Generator
                </h1>
                <p className="text-green-900 text-lg mb-6 font-semibold">Create and manage public announcements for emergency communications</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Create New Announcement */}
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-lg border border-green-200">
                    <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                      <FaPlus className="text-green-600" /> Create New Announcement
                    </h3>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-green-800 mb-2">Title</label>
                        <input
                          type="text"
                          value={newAnnouncement.title}
                          onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                          placeholder="Emergency announcement title..."
                          className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-green-800 mb-2">Content</label>
                        <textarea
                          rows="4"
                          value={newAnnouncement.content}
                          onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                          placeholder="Enter announcement content..."
                          className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-green-800 mb-2">Priority Level</label>
                        <select
                          value={newAnnouncement.priority}
                          onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}
                          className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-green-800 mb-2">Broadcast Channels</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['SMS', 'Radio', 'TV', 'Social Media', 'Website', 'Emergency App'].map((channel) => (
                            <label key={channel} className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={newAnnouncement.channels.includes(channel)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewAnnouncement({...newAnnouncement, channels: [...newAnnouncement.channels, channel]});
                                  } else {
                                    setNewAnnouncement({...newAnnouncement, channels: newAnnouncement.channels.filter(c => c !== channel)});
                                  }
                                }}
                                className="rounded border-green-300 focus:ring-green-400"
                              />
                              {channel}
                            </label>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleSendAnnouncement}
                        className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-md"
                      >
                        <FaPaperPlane className="inline mr-2" /> Send Announcement
                      </button>
                    </form>
                  </div>

                  {/* Recent Announcements */}
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-lg border border-green-200">
                    <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                      <FaFileAlt className="text-green-600" /> Recent Announcements
                    </h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {announcements.map((announcement) => (
                        <div key={announcement.id} className="bg-white p-4 rounded-lg shadow border border-green-100">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-green-800">{announcement.title}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getSeverityColor(announcement.priority.toUpperCase())}`}>
                              {announcement.priority}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">{announcement.content}</p>
                          <div className="flex justify-between items-center text-xs text-gray-600">
                            <span className={`font-semibold ${getStatusColor(announcement.status)}`}>{announcement.status}</span>
                            <span>{announcement.timestamp}</span>
                          </div>
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {announcement.channels.map((channel, index) => (
                                <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                  {channel}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LocalGovernmentDashboard;
