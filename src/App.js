// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./components/style/style.css";
import Home from "./components/Home";
import ChatState from "./context/ChatState";
import ChatPage from "./components/Chat/ChatPage";

const isUser = localStorage.getItem("user-token");

function App() {
  return (
    <ChatState>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chats" element={<ChatPage />} />
          </Routes>
        </div>
      </Router>
    </ChatState>
  );
}

export default App;
