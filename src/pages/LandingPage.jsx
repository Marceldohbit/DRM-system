import React from "react";
import { Link } from "react-router-dom";
import "./styles/LandingPage.css";
import PromotionPopup from "./PromotionPopup";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="logo">Guest House</div>
        <input type="checkbox" id="menu-toggle" className="menu-toggle" />
        <label htmlFor="menu-toggle" className="menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </label>
        <ul className="menu">
          <li><Link to="/virtual-tour">Virtual Tour</Link></li>
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/menu">Menu</Link></li>
          <li><Link to="/booking">Booking</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>

      <header className="hero">
        <div className="welcome-message">
          <h1>Welcome to Our Guest House</h1>
          <p>Your home away from home with an immersive experience</p>
          <Link to="/virtual-tour" className="cta-btn">Take a Virtual Tour</Link>
        </div>
      </header>

      <PromotionPopup/>
      
      <section className="features">
        <div className="feature">
          <Link to="/events">
            <h2>Event Hosting</h2>
            <p>Join our special events and create memorable experiences.</p>
          </Link>
        </div>
        <div className="feature">
          <Link to="/menu">
            <h2>Local Cuisine</h2>
            <p>Explore our authentic local cuisine and order online.</p>
          </Link>
        </div>
        <div className="feature">
          <Link to="/booking">
            <h2>Book Your Stay</h2>
            <p>Customize your room ambiance and book now.</p>
          </Link>
        </div>
        <div className="feature">
          <Link to="/exclusive">
            <h2>Exclusive Member Section</h2>
            <p>Enjoy premium member-only perks and discounts.</p>
          </Link>
        </div>
      </section>

      <footer className="footer">
        <p>© 2024 Guest House. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;


