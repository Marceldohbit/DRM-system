import React, { useState } from "react";
import { Link } from "react-router-dom";
import vid2 from '/videos/flood.mp4'
import vid1 from '/videos/landslide.mp4'
import vid3 from '/videos/shock.mp4'
import vid4 from '/videos/earthq.mp4'
import { FaHome, FaBook, FaUpload, FaUserShield } from "react-icons/fa";

const disasterGuidelines = {
  landslide: {
    title: "Landslide Safety Tips",
    text: `- Stay alert and listen to weather warnings.\n- Evacuate immediately if signs of a landslide appear, such as sudden cracks in the ground or tilting trees.\n- Avoid river valleys and low-lying areas during heavy rain.\n- Do not cross fast-moving water or try to escape uphill if caught in a landslide.\n- After the landslide, check for injured people and assist them, avoiding any unstable areas.`,
    video: vid1,
  },
  flooding: {
    title: "Flooding Safety Tips",
    text: `- Move to higher ground and avoid walking or driving through floodwaters.\n- Avoid electrical equipment and downed power lines to prevent electric shock.\n- Keep an emergency kit with essentials like water, food, flashlight, and first aid.\n- Stay informed via local radio or alerts for evacuation orders.\n- Do not drink flood water; it may be contaminated. Boil water for drinking if necessary.`,
    video: vid2,
  },
  earthquake: {
    title: "Earthquake Safety Tips",
    text: `- Drop, cover, and hold on during shaking. Get under a sturdy table or piece of furniture.\n- Stay away from windows, mirrors, and anything that might fall.\n- If outdoors, move to an open area away from buildings, trees, and power lines.\n- After the earthquake, check for injuries and hazards, such as gas leaks or damaged buildings.\n- Be prepared for aftershocks and avoid entering damaged structures.`,
    video: vid4,
  },
  electricShock: {
    title: "Electric Shock Safety Tips",
    text: `- Do not touch the person receiving the shock if they are still in contact with the electrical source.\n- Turn off the power supply or unplug the device causing the shock.\n- Call emergency services immediately.\n- If safe to do so, push the person away from the source using a non-conductive object like wood.\n- Perform CPR if the person is unconscious and not breathing, but only if you're trained.`,
    video: vid3,
  },
};

const hazards = [
  { key: "landslide", label: "Landslide" },
  { key: "flooding", label: "Flood" },
  { key: "earthquake", label: "Earthquake" },
  { key: "electricShock", label: "Electric Shock" },
];

const GuidelineComponent = () => {
  const [selectedDisaster, setSelectedDisaster] = useState("landslide");
  const guideline = disasterGuidelines[selectedDisaster];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between bg-white shadow px-6 py-3">
        <div className="flex items-center gap-2 text-blue-700 font-bold text-xl">
          <span className="text-2xl">🌐</span> Tera Alert
        </div>
        <ul className="flex gap-6 text-gray-700 font-medium">
          <li><Link to="/" className="flex items-center gap-1 hover:text-blue-600"><FaHome /> Home</Link></li>
          <li><Link to="/guide" className="flex items-center gap-1 hover:text-blue-600"><FaBook /> Guideline</Link></li>
          <li><Link to="/upload" className="flex items-center gap-1 hover:text-blue-600"><FaUpload /> Create Alert</Link></li>
          <li><Link to="/admin" className="flex items-center gap-1 hover:text-blue-600"><FaUserShield /> Administration</Link></li>
        </ul>
      </nav>

      {/* Hazard Tabs */}
      <div className="flex justify-center mt-6 mb-2 gap-4">
        {hazards.map((hazard) => (
          <button
            key={hazard.key}
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 shadow-sm border-2 focus:outline-none ${selectedDisaster === hazard.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-100'}`}
            onClick={() => setSelectedDisaster(hazard.key)}
          >
            {hazard.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8 px-6 py-8 max-w-5xl mx-auto w-full bg-white/80 rounded-xl shadow-lg mt-4">
        {/* Text Section */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">{guideline.title}</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 whitespace-pre-line">
            {guideline.text.split('\n').map((line, idx) => (
              <li key={idx}>{line.replace(/^- /, "")}</li>
            ))}
          </ul>
        </div>
        {/* Video Section */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <video
            src={guideline.video}
            controls
            className="rounded-lg shadow-lg w-full max-w-md border-2 border-blue-200"
            title={guideline.title}
          />
        </div>
      </div>
    </div>
  );
};

export default GuidelineComponent;
