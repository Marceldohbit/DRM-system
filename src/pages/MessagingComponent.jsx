import React, { useState, useEffect } from "react";
import "./styles/MessagingComponent.css";
import { FaUser, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const roles = [
  "Military",
  "Scientists",
  "Local Government",
  "Health Personnel",
  "Environmentalists"
];

const MessagingComponent = () => {
  // Get role from query param or localStorage (simulate login)
  const urlParams = new URLSearchParams(window.location.search);
  const defaultRole = urlParams.get("role") || localStorage.getItem("userRole") || "Scientists";
  const [role, setRole] = useState(defaultRole);
  const [selectedRole, setSelectedRole] = useState(roles.find(r => r !== defaultRole) || roles[0]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  // Load messages for this role from localStorage
  useEffect(() => {
    const allMsgs = JSON.parse(localStorage.getItem("messages") || "[]");
    setMessages(allMsgs.filter(m => m.recipient === role || m.sender === role));
    localStorage.setItem("userRole", role);
  }, [role]);

  // Listen for new messages (simulate notification)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "messages") {
        const allMsgs = JSON.parse(e.newValue || "[]");
        const newMsgs = allMsgs.filter(m => m.recipient === role && !messages.some(msg => msg.id === m.id));
        if (newMsgs.length > 0) {
          toast.info(`New message from ${newMsgs[newMsgs.length-1].sender}`);
          setMessages(allMsgs.filter(m => m.recipient === role || m.sender === role));
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [role, messages]);

  const sendMessage = () => {
    if (input.trim() !== "") {
      const allMsgs = JSON.parse(localStorage.getItem("messages") || "[]");
      const msg = {
        id: Date.now(),
        sender: role,
        recipient: selectedRole,
        text: input,
        time: new Date().toLocaleString()
      };
      localStorage.setItem("messages", JSON.stringify([...allMsgs, msg]));
      setMessages([...messages, msg]);
      setInput("");
      toast.success(`Message sent to ${selectedRole}`);
    }
  };

  return (
    <>
      <nav className="navbar h-16 fixed top-0 left-0 w-full z-40 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 shadow-xl flex items-center px-10 border-b border-blue-300 backdrop-blur-lg">
        <div className="logo font-extrabold text-2xl tracking-tight text-white drop-shadow-lg">TerraALERT</div>
        <ul className="menu flex gap-8 ml-auto text-white font-semibold text-lg">
          <li><Link to="/science" className="hover:text-blue-200 transition">Dashboard</Link></li>
          <li><Link to="/" className="hover:text-blue-200 transition">Home</Link></li>
        </ul>
      </nav>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-50 pt-24">
        <div className="w-full max-w-2xl bg-white/95 rounded-3xl shadow-2xl p-8 border border-blue-100 flex flex-col gap-6">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-blue-100">
            <h1 className="font-extrabold text-2xl text-blue-800 tracking-tight drop-shadow">Logged in as <span className="text-blue-600">{role}</span></h1>
            <div className="role-select flex items-center gap-2">
              <label htmlFor="role" className="font-semibold text-blue-700">Message to:</label>
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="rounded-lg border border-blue-300 px-3 py-2 bg-blue-50 text-blue-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {roles.filter((r) => r !== role).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </header>
          <div className="message-box flex flex-col gap-3 max-h-96 overflow-y-auto px-2 py-2 bg-blue-50 rounded-xl border border-blue-100">
            {messages.length === 0 && (
              <div className="text-center text-blue-400 font-semibold py-8">No messages yet. Start a conversation!</div>
            )}
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex items-end gap-3 ${msg.sender === role ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender !== role && (
                  <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-xl shadow"><FaUser /></div>
                )}
                <div className={`rounded-2xl px-5 py-3 shadow-lg max-w-xs break-words ${msg.sender === role ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white ml-2' : 'bg-white text-blue-900 mr-2 border border-blue-200'}`}>
                  <div className="font-semibold text-sm mb-1">{msg.sender === role ? 'You' : msg.sender}</div>
                  <div className="text-base">{msg.text}</div>
                  <div className="text-xs text-blue-200 mt-1">{msg.time}</div>
                </div>
                {msg.sender === role && (
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl shadow"><FaUser /></div>
                )}
              </div>
            ))}
          </div>
          <footer className="flex gap-3 pt-2 border-t border-blue-100">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message to ${selectedRole}`}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 rounded-2xl border border-blue-300 px-4 py-3 bg-blue-50 text-blue-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 shadow"
            />
            <button
              onClick={sendMessage}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold shadow-lg hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition-all text-lg"
            >
              <FaPaperPlane /> Send
            </button>
          </footer>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default MessagingComponent;


