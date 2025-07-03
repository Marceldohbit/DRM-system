import React, { useState } from "react";
import { FaMountain, FaWater, FaVolcano } from "react-icons/fa6";
import { Tab } from "@headlessui/react";

const hazards = [
  { key: "landslide", label: "Landslide", icon: <FaMountain /> },
  { key: "flood", label: "Flood", icon: <FaWater /> },
  { key: "volcano", label: "Volcanic Eruption", icon: <FaVolcano /> },
];

const Dashboard = () => {
  const [selectedHazard, setSelectedHazard] = useState("landslide");
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-blue-200">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col mt-4 py-8 px-4 gap-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-8">Hazards</h1>
        <nav className="flex flex-col gap-4">
          {hazards.map((hazard) => (
            <button
              key={hazard.key}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-all duration-200 border-2 focus:outline-none text-lg ${selectedHazard === hazard.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-100'}`}
              onClick={() => setSelectedHazard(hazard.key)}
            >
              {hazard.icon} {hazard.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto bg-white/90 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            {hazards.find(h => h.key === selectedHazard)?.label} Dashboard
          </h2>
          {/* Tab System */}
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex gap-4 mb-6">
              <Tab className={({ selected }) =>
                `px-4 py-2 rounded-full font-semibold border-2 transition-all duration-200 focus:outline-none ${selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-100'}`
              }>Sensor Data</Tab>
              <Tab className={({ selected }) =>
                `px-4 py-2 rounded-full font-semibold border-2 transition-all duration-200 focus:outline-none ${selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-100'}`
              }>Vulnerability Assessment</Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                {/* Sensor Data Tab Content Placeholder */}
                <div className="text-gray-700">Live sensor data, real-time graphs, and alarms will appear here.</div>
              </Tab.Panel>
              <Tab.Panel>
                {/* Vulnerability Assessment Tab Content Placeholder */}
                <div className="text-gray-700">Satellite vulnerability reports, map, and assessment alarms will appear here.</div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
