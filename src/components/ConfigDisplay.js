// src/components/ConfigDisplay.js
import React from "react";
import appConfig from "../config/appConfig";

function ConfigDisplay() {
  return (
    <div>
      <h2>Environment Config (from Component)</h2>
      <ul>
        <li>Environment: {appConfig.environment}</li>
        <li>API URL: {appConfig.apiUrl}</li>
        <li>App Name: {appConfig.appName}</li>
        <li>Log Level: {appConfig.logLevel}</li>
        <li>Analytics Enabled: {appConfig.analyticsEnabled && <p>Analytics enabled in component!</p>}
</li>
      </ul>
    </div>
  );
}

export default ConfigDisplay;
