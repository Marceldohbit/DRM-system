import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import "./styles/UploadComponent.css";
import { Link } from "react-router-dom";
const CaptureComponent = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [text, setText] =  useState(false)
  const [text2, setText2] =  useState(false)

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
          <li><Link to="/guide">Guidline</Link></li>
          <li><Link to="/upload">Create Alert</Link></li>
          <li><Link to="/admin">Administration</Link></li>
         
        
        </ul>
      </nav>
      <div className="capture-container">
      <div className="reset">
      <h2>Upload & Capture</h2>
      <button onClick={resetAll} className="btn reset-btn">
        Reset All
      </button>
      </div>
      <div className="sections">
        {/* Choose Image */}
        <div className="section">
          <h3 className="tit">Choose Image</h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImage(URL.createObjectURL(file));
              }
            }}
          />
          {image && <img src={image} alt="Selected" className="preview" />}
        { !text && (
          <div id="filed">
          <textarea value="Describtion">  </textarea>
          <button  className="btn" onClick={handlesubmitp}>Submit</button>
          </div>
       )}
       {text &&(
        <h3>Information sent successfully! Thank you</h3>
       )}
        </div>
        

        {/* Capture Photo */}
        <div className="section">
          <h3 className="tit">Capture Photo</h3>
          {!image && (
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="webcam"
            />
          )}
          <button onClick={capturePhoto} className="btn">
            Capture Photo
          </button>
        </div>

        {/* Choose Video */}
        <div className="section">
          <h3 className="tit">Choose Video</h3>
          <input
            type="file"
            accept="video/*"
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
              className="preview"
            />
          )}
          {!text2 && (
          <div id="filed">
          <textarea placeholder="Describtion">  </textarea>
          <button onClick={handlesubmitv}  className="btn">Submit</button>
          </div>
        )}
        {text2 &&(
        <h3>Information sent successfully! Thank you</h3>
       )}

        </div>

        {/* Capture Video */}
        <div className="section">
          <h3 className="tit">Capture Video</h3>
          {!videoBlob && (
            <>
              {!recording && (
                <Webcam
                  ref={webcamRef}
                  className="webcam"
                  audio={true}
                />
              )}
              {recording && <p>Recording...</p>}
            </>
          )}
          <button
            onClick={recording ? stopRecording : startRecording}
            className="btn"
          >
            {recording ? "Stop Recording" : "Start Recording"}
          </button>
        </div>
      </div>

      {/* Reset Button */}
      
    </div>
    </>
  );
};

export default CaptureComponent;



