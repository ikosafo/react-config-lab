import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { loadConfig, validateConfig } from "./config";

const root = ReactDOM.createRoot(document.getElementById("root"));

loadConfig()
  .then(() => {
    validateConfig();

    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error("Failed to load config:", error);

    root.render(
      <React.StrictMode>
        <div style={{ padding: "1rem", color: "red" }}>
          Failed to load configuration.
        </div>
      </React.StrictMode>
    );
  });

reportWebVitals();
