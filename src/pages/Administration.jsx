import React, { useState } from "react";
import "./styles/AdminComponent.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Administration = ({ navigateToDashboard }) => {
  const roles = ["Local Government", "Military", "Health Personnel", "Environmentalists", "Scientists"];
  const correctPasswords = {
    "Local Government": "local123",
    Military: "military123",
    "Health Personnel": "health123",
    Environmentalists: "env123",
    Scientists: "sci123",
  };

  const [selectedRole, setSelectedRole] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    setError("");
    setPassword("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  const handleLogin = () => {
    if (password === correctPasswords[selectedRole]) {
      setError("");
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Route to the correct dashboard based on role
        if (selectedRole === "Local Government") {
          navigate('/local-gov');
        } else if (selectedRole === "Military") {
          navigate('/military');
        } else if (selectedRole === "Health Personnel") {
          navigate('/health');
        } else if (selectedRole === "Environmentalists") {
          navigate('/environmentalists');
        } else if (selectedRole === "Scientists") {
          navigate('/science');
        }
      }, 2000);
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
       <>
        <nav className="navbar">
        <div className="logo">Tera Alert</div>
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
      <div className="admin-container">
      <h2>Admin Login</h2>
      <div className="select-container">
        <label htmlFor="role">Select Role:</label>
        <select id="role" value={selectedRole} onChange={handleRoleChange} className="select-dropdown2">
          <option value="">-- Select Role --</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {selectedRole && (
        <div className="password-container">
          <label htmlFor="password">Enter Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="password-input"
          />
          <button onClick={handleLogin} className="submit-button">
            {isLoading ? <div className="spinner"></div> : "Submit"}
          </button>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
    </>
  );
};

export default Administration;

