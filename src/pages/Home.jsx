import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./styles/LandingPage.css";
import MapComponent from "./MapComponent";
import DetailsComponent from "./DetailsComponent";
import SearchComponent from "./SearchComponent";
import DisasterMonitor from "./DisasterMonitor";
import { FaHome, FaBook, FaPlus, FaUserShield, FaMountain, FaWater, FaFire, FaGlobe } from "react-icons/fa";


const Home = () => {
  const locationHook = useLocation();
  const api = 'http://localhost/guesthouse';
  const [ok, setOk] = useState(false);
  const [location, setLocation] = useState(null);
  const [activeDisaster, setActiveDisaster] = useState('Landslide');

  // Function to determine if a nav item is active
  const isActiveNavItem = (path) => {
    return locationHook.pathname === path;
  };

  const disasterTypes = [
    { name: 'Landslide', icon: <FaMountain />, color: 'from-orange-500 to-red-500' },
    { name: 'Earthquake', icon: <FaGlobe />, color: 'from-yellow-500 to-orange-500' },
    { name: 'Volcano', icon: <FaFire />, color: 'from-red-500 to-pink-500' },
    { name: 'Flood', icon: <FaWater />, color: 'from-blue-500 to-cyan-500' },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <nav className="terra-navbar h-16 fixed top-0 left-0 w-full z-50 bg-white shadow-xl flex items-center px-8 border-b border-green-300 backdrop-blur-lg" style={{ backgroundColor: 'white' }}>
        <div className="logo flex items-center">
          <img src="/src/pages/logo.png" alt="TerraALERT Logo" className="h-10 w-auto drop-shadow-lg" />
        </div>
        <ul className="menu flex gap-8 ml-auto text-green-800 font-semibold text-lg" style={{ color: '#166534' }}>
          <li>
            <Link to="/" className={`hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 ${isActiveNavItem('/') ? 'bg-green-200 border-2 border-green-500 shadow-md' : ''}`} style={{ color: '#166534', backgroundColor: isActiveNavItem('/') ? '#bbf7d0' : 'transparent' }}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/guide" className={`hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 ${isActiveNavItem('/guide') ? 'bg-green-200 border-2 border-green-500 shadow-md' : ''}`} style={{ color: '#166534', backgroundColor: isActiveNavItem('/guide') ? '#bbf7d0' : 'transparent' }}>
              Guidelines
            </Link>
          </li>
          <li>
            <Link to="/upload" className={`hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 ${isActiveNavItem('/upload') ? 'bg-green-200 border-2 border-green-500 shadow-md' : ''}`} style={{ color: '#166534', backgroundColor: isActiveNavItem('/upload') ? '#bbf7d0' : 'transparent' }}>
              Create Alert
            </Link>
          </li>
          <li>
            <Link to="/admin" className={`hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 ${isActiveNavItem('/admin') ? 'bg-green-200 border-2 border-green-500 shadow-md' : ''}`} style={{ color: '#166534', backgroundColor: isActiveNavItem('/admin') ? '#bbf7d0' : 'transparent' }}>
              Administration
            </Link>
          </li>
        </ul>
      </nav>

      <div className="pt-20 min-h-screen">
        {/* Main Content Section */}
        <div className="px-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/95 rounded-3xl shadow-2xl p-8 border-4 border-green-100">
              {/* Disaster Type Selector */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">Select Disaster Type</h2>
                <div className="flex flex-wrap justify-center gap-4">
                  {disasterTypes.map((disaster) => (
                    <button
                      key={disaster.name}
                      onClick={() => setActiveDisaster(disaster.name)}
                      className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                        activeDisaster === disaster.name
                          ? `bg-gradient-to-r ${disaster.color} text-white shadow-2xl scale-105`
                          : 'bg-white text-green-800 hover:bg-green-50 border-2 border-green-200'
                      }`}
                    >
                      {disaster.icon}
                      {disaster.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Details Section */}
                <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 shadow-lg border-2 border-green-100">
                  <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
                    <FaGlobe className="text-green-600" />
                    Disaster Details
                  </h3>
                  <div className="overflow-hidden rounded-xl">
                    <DetailsComponent />
                  </div>
                </div>

                {/* Map Section */}
                <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 shadow-lg border-2 border-green-100">
                  <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
                    <FaGlobe className="text-green-600" />
                    Live Map
                  </h3>
                  <div className="overflow-hidden rounded-xl">
                    <MapComponent location={location} onSetLocation={setLocation} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="px-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/95 rounded-3xl shadow-2xl p-8 border-4 border-green-100">
              <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">Search Location</h2>
              <SearchComponent onSetLocation={setLocation} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-green-800 to-green-600 text-white py-12 px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-6">
              <img src="/src/pages/logo.png" alt="TerraALERT Logo" className="h-12 w-auto mx-auto mb-4 filter brightness-0 invert" />
              <h3 className="text-2xl font-bold mb-2">TerraALERT</h3>
              <p className="text-green-100">Advanced Disaster Monitoring & Response System</p>
            </div>
            <div className="border-t border-green-400 pt-6">
              <p className="text-green-100">&copy; 2025 TerraALERT. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;


