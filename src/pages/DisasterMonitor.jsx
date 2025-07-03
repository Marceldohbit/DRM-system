import React, { useEffect, useState } from "react";
import "./styles/DisasterMonitor.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import aggressiveSound from "./siren.mp3"; // Replace with your sound file path

const DisasterMonitor = () => {
  const [isDisaster, setIsDisaster] = useState(false);

  const playSound = () => {
    const audio = new Audio(aggressiveSound);
    audio.play();
    audio.play();   


  };
  useEffect(() => {
    playSound()
    const interval = setInterval(() => {
      const disasterValue = localStorage.getItem("disaster");
      setIsDisaster(!!disasterValue); // Set true if disaster is present
      
    }, 500); // Check every 500ms


    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  

  return (
    <div className={`monitor ${isDisaster ? "blinking" : ""}`}>
      {isDisaster ? "⚠️ Danger Detected!" : ""}
    </div>
  );
};

export default DisasterMonitor;

