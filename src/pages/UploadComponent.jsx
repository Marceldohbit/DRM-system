import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import "./styles/UploadComponent.css";
import { Link, useLocation } from "react-router-dom";
const CaptureComponent = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [text, setText] = useState(false)
  const [text2, setText2] = useState(false)
  const locationHook = useLocation();

  // Function to determine if a nav item is active
  const isActiveNavItem = (path) => {
    return locationHook.pathname === path;
  };

  // Capture Photo
  const capturePhoto = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
  };

  const handlesubmitp = () =>{
    setImage(null);
    setText(true);
  }
  const handlesubmitv = () =>{
    setVideoBlob(null);
    setText2(true);
  }

  // Start Recording
  const startRecording = () => {
    setRecording(true);
    const stream = webcamRef.current.stream;
    mediaRecorderRef.current = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorderRef.current.onstop = () => {
      const video = new Blob(chunks, { type: "video/mp4" });
      setVideoBlob(video);
    };

    mediaRecorderRef.current.start();
  };

  // Stop Recording
  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current.stop();
  };

  // Reset
  const resetAll = () => {
    setImage(null);
    setVideoBlob(null);
  };

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
        <div className="px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/95 rounded-3xl shadow-2xl p-8 border-4 border-green-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-bold text-green-800">Upload & Capture</h2>
                <button onClick={resetAll} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg font-semibold">
                  Reset All
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Choose Image */}
                <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 shadow-lg border-2 border-green-100">
                  <h3 className="text-2xl font-bold text-green-800 mb-4">Choose Image</h3>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full p-3 border-2 border-green-200 rounded-lg mb-4 focus:border-green-500 focus:outline-none"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImage(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {image && <img src={image} alt="Selected" className="w-full h-48 object-cover rounded-lg mb-4 shadow-md" />}
                  {!text && (
                    <div className="space-y-4">
                      <textarea 
                        placeholder="Description" 
                        className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none resize-none h-24"
                      />
                      <button 
                        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg font-semibold" 
                        onClick={handlesubmitp}
                      >
                        Submit
                      </button>
                    </div>
                  )}
                  {text && (
                    <div className="text-center p-4 bg-green-100 rounded-lg border-2 border-green-300">
                      <h3 className="text-green-800 font-semibold">Information sent successfully! Thank you</h3>
                    </div>
                  )}
                </div>

                {/* Capture Photo */}
                <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 shadow-lg border-2 border-green-100">
                  <h3 className="text-2xl font-bold text-green-800 mb-4">Capture Photo</h3>
                  {!image && (
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full rounded-lg shadow-md mb-4"
                    />
                  )}
                  <button 
                    onClick={capturePhoto} 
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg font-semibold"
                  >
                    Capture Photo
                  </button>
                </div>

                {/* Choose Video */}
                <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 shadow-lg border-2 border-green-100">
                  <h3 className="text-2xl font-bold text-green-800 mb-4">Choose Video</h3>
                  <input
                    type="file"
                    accept="video/*"
                    className="w-full p-3 border-2 border-green-200 rounded-lg mb-4 focus:border-green-500 focus:outline-none"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setVideoBlob(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {videoBlob && (
                    <video
                      src={videoBlob}
                      controls
                      className="w-full h-48 object-cover rounded-lg mb-4 shadow-md"
                    />
                  )}
                  {!text2 && (
                    <div className="space-y-4">
                      <textarea 
                        placeholder="Description" 
                        className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none resize-none h-24"
                      />
                      <button 
                        onClick={handlesubmitv}  
                        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg font-semibold"
                      >
                        Submit
                      </button>
                    </div>
                  )}
                  {text2 && (
                    <div className="text-center p-4 bg-green-100 rounded-lg border-2 border-green-300">
                      <h3 className="text-green-800 font-semibold">Information sent successfully! Thank you</h3>
                    </div>
                  )}
                </div>

                {/* Capture Video */}
                <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 shadow-lg border-2 border-green-100">
                  <h3 className="text-2xl font-bold text-green-800 mb-4">Capture Video</h3>
                  {!videoBlob && (
                    <>
                      {!recording && (
                        <Webcam
                          ref={webcamRef}
                          className="w-full rounded-lg shadow-md mb-4"
                          audio={true}
                        />
                      )}
                      {recording && (
                        <div className="text-center p-8 bg-red-100 rounded-lg border-2 border-red-300 mb-4">
                          <p className="text-red-800 font-semibold text-lg">Recording...</p>
                        </div>
                      )}
                    </>
                  )}
                  <button
                    onClick={recording ? stopRecording : startRecording}
                    className={`w-full px-6 py-3 rounded-lg transition-colors shadow-lg font-semibold ${
                      recording 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {recording ? "Stop Recording" : "Start Recording"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptureComponent;



