import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Basic environment setup if needed for client-side
// Note: dotenv is usually for server-side or build-time config in React apps (handled by react-scripts/vite)

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
