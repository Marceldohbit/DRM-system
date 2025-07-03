import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import UploadComponent from "./pages/UploadComponent";
import GuidelineComponent from "./pages/GuidelineComponent";
import Administration from "./pages/Administration";
import ScientistsComponent from "./pages/ScientistsComponent";
import MessagingComponent from "./pages/MessagingComponent";
import LocalGovernmentDashboard from "./pages/LocalGovernmentDashboard";
import MilitaryDashboard from "./pages/MilitaryDashboard";
import HealthPersonnelDashboard from "./pages/HealthPersonnelDashboard";
import EnvironmentalistDashboard from "./pages/EnvironmentalistDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Home/>} />
        <Route path="/upload" exact element={<UploadComponent/>} />
        <Route path="/guide" exact element={<GuidelineComponent/>} />
        <Route path="/admin" exact element={<Administration/>} />
        <Route path="/science" exact element={<ScientistsComponent/>} />
        <Route path="/message" exact element={<MessagingComponent/>} />
        <Route path="/local-gov" exact element={<LocalGovernmentDashboard/>} />
        <Route path="/military" exact element={<MilitaryDashboard/>} />
        <Route path="/health" exact element={<HealthPersonnelDashboard/>} />
        <Route path="/environmentalists" exact element={<EnvironmentalistDashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;
