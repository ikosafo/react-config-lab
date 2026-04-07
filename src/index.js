
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import loadConfig from "./config/appConfig.js"; // matches folder
 
const config = loadConfig();
console.log("Loaded config:", config);
 
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App config={config} />
  </React.StrictMode>
);