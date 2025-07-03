import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/LandingPage.css";
import MapComponent from "./MapComponent";
import DetailsComponent from "./DetailsComponent";
import SearchComponent from "./SearchComponent";
import DisasterMonitor from "./DisasterMonitor";


const Home = () => {
const api = 'http://localhost/guesthouse';
const [ok, setOk] = useState(false);
const [location, setLocation] = useState(null);


  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="logo">TerraALERT</div>
        <input type="checkbox" id="menu-toggle" className="menu-toggle" />
        <label htmlFor="menu-toggle" className="menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </label>
        <ul className="menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/guide">Guideline</Link></li>
          <li><Link to="/upload">Create Alert</Link></li>
          <li><Link to="/admin">Administration</Link></li>
         
        
        </ul>
      </nav>

      
     <div className="home">
      <DisasterMonitor/>
      
      <div className="first-component">
        <div className="block3">
          <button id="active">Lanslide</button>
          <button>EarthQuake</button>
          <button>Volcano</button>
          <button>Flood</button>
        </div>
    <div className="block1" >
    <DetailsComponent />
    </div>

    <div className="block2" >
    <MapComponent location={location} onSetLocation={setLocation} />
    </div>
      </div>
    
      <div>
      <SearchComponent onSetLocation={setLocation} />
      </div>
      

      <footer className="footer">
        <p>© 2024 Tera Alert. All rights reserved.</p>
      </footer>
      </div>
    </div>
  );
};

export default Home;


