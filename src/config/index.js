 
 
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import loadConfig from "./config/appConfig.js"; // <-- updated path
 
async function init() {
  try {
    const config = await loadConfig();
    console.log("Loaded config from Key Vault:", config);
 
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      <React.StrictMode>
        <App config={config} />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Failed to load config from Key Vault:", err);
  }
}
 
init();
 