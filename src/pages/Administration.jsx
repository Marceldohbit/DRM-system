import React, { useState } from "react";
import "./styles/AdminComponent.css";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Administration = ({ navigateToDashboard }) => {
  const location = useLocation();
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

  // Function to determine if a nav item is active
  const isActiveNavItem = (path) => {
    return location.pathname === path;
  };

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
      localStorage.setItem('userRole', selectedRole);
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-200">
      <nav className="terra-navbar h-16 fixed top-0 left-0 w-full z-40 bg-white shadow-xl flex items-center px-8 border-b border-green-300 backdrop-blur-lg" style={{ backgroundColor: 'white' }}>
        <div className="logo flex items-center">
          <img src="/src/pages/logo.png" alt="TerraALERT Logo" className="h-10 w-auto drop-shadow-lg" />
        </div>
        <ul className="menu flex gap-8 ml-auto text-green-800 font-semibold text-lg" style={{ color: '#166534' }}>
          <li><Link to="/" className={`hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 ${isActiveNavItem('/') ? 'bg-green-200 border-2 border-green-500 shadow-md' : ''}`} style={{ color: '#166534', backgroundColor: isActiveNavItem('/') ? '#bbf7d0' : 'transparent' }}>Home</Link></li>
          <li><Link to="/guide" className={`hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 ${isActiveNavItem('/guide') ? 'bg-green-200 border-2 border-green-500 shadow-md' : ''}`} style={{ color: '#166534', backgroundColor: isActiveNavItem('/guide') ? '#bbf7d0' : 'transparent' }}>Guideline</Link></li>
          <li><Link to="/upload" className={`hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 ${isActiveNavItem('/upload') ? 'bg-green-200 border-2 border-green-500 shadow-md' : ''}`} style={{ color: '#166534', backgroundColor: isActiveNavItem('/upload') ? '#bbf7d0' : 'transparent' }}>Create Alert</Link></li>
          <li><Link to="/admin" className={`hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-100 ${isActiveNavItem('/admin') ? 'bg-green-200 border-2 border-green-500 shadow-md' : ''}`} style={{ color: '#166534', backgroundColor: isActiveNavItem('/admin') ? '#bbf7d0' : 'transparent' }}>Administration</Link></li>
        </ul>
      </nav>
      
      <div className="pt-20 p-8 flex items-center justify-center min-h-screen">
        <div className="bg-white/95 rounded-3xl shadow-2xl p-10 border-4 border-green-100 w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-green-800 mb-2">Admin Login</h2>
            <p className="text-green-700 text-lg">Select your role and enter credentials</p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="role" className="block text-sm font-bold text-green-800 mb-3">Select Role:</label>
              <select 
                id="role" 
                value={selectedRole} 
                onChange={handleRoleChange} 
                className="w-full p-4 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-800 font-semibold bg-white shadow-md"
              >
                <option value="">-- Select Role --</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {selectedRole && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                  <div>
                    <h3 className="font-bold text-green-800">{selectedRole}</h3>
                    <p className="text-sm text-green-700">Enter your credentials below</p>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-green-800 mb-3">Enter Password:</label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      className="w-full p-4 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-800 font-semibold bg-white shadow-md"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleLogin} 
                  disabled={!password || isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login as {selectedRole}
                    </>
                  )}
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 text-center font-semibold animate-shake">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Administration;

