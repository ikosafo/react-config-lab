import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js"; // Added .js
import loadConfig from "./config/index.js"; // Added .js

const root = ReactDOM.createRoot(document.getElementById("root"));

// Task 6 & 8: Centralized loading function
async function startApp() {
  try {
    // Wait for the Vault/Env to return the data
    const config = await loadConfig();

    // Task 6d: Log values in development to confirm
    console.log("🚀 Config initialized:", config);

    root.render(
      <React.StrictMode>
        {/* Pass the loaded config to your App component */}
        <App config={config} />
      </React.StrictMode>
    );
  } catch (error) {
    // Task 9c: Create helpful error messages
    console.error("Initialization failed:", error);
    root.render(
      <div style={{ padding: "40px", color: "red", fontFamily: "sans-serif" }}>
        <h1>🛑 Configuration Error</h1>
        <p>{error.message}</p>
        <p>Check your <strong>Azure login</strong> and <strong>Key Vault permissions</strong>.</p>
      </div>
    );
  }
}

startApp();