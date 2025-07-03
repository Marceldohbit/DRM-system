import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import aggressiveSound from "./siren.mp3"; // Replace with your sound file path
import "./styles/DangerAnimation.css"; // Import CSS for animations


const AggressiveNotificationButton = () => {
  const playSound = () => {
    const audio = new Audio(aggressiveSound);
    audio.play();
  };

  const showNotification = () => {
    toast.error("This is an aggressive notification!", {
      position: "top-center",
      autoClose: false,
      closeOnClick: true,
      draggable: true,
      className: "aggressive-toast",
    });
    playSound();
  };

  return (
    <div>
      <button
        onClick={showNotification}
        style={{
          backgroundColor: "red",
          color: "white",
          padding: "10px 20px",
          fontSize: "16px",
          fontWeight: "bold",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Trigger Aggressive Notification
      </button>
      <ToastContainer />
    </div>
  );
};

export default AggressiveNotificationButton;