import React from "react";
import config from "../config/appConfig";

function ConfigViewer() {
  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h3>Current Configuration</h3>

      <p><strong>Environment:</strong> {config.environment}</p>
      <p><strong>API URL:</strong> {config.apiUrl}</p>
      <p><strong>App Name:</strong> {config.appName}</p>
      <p><strong>Log Level:</strong> {config.logLevel}</p>
      <p>
        <strong>Analytics Enabled:</strong>{" "}
        {config.analyticsEnabled ? "✅ ON" : "❌ OFF"}
      </p>
    </div>
  );
}

export default ConfigViewer;
