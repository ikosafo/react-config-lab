// src/App.js

import React from "react";
import appConfig from "./config/appConfig"; // central config
import ConfigDisplay from "./components/ConfigDisplay"; // Task 5

function App() {
  // Task 4: log config only in development
  if (process.env.NODE_ENV === "development") {
    console.log("Full appConfig:", appConfig);
  }

  return (
    <div className="App">
      <h1>Welcome to the React Config Lab!</h1>

      {/* Task 4: Show main config in App */}
      <h2>Environment Config (from App.js)</h2>
      <ul>
        {appConfig.analyticsEnabled ? (
  <p>Analytics is ON for this environment ✅</p>
) : (
  <p>Analytics is OFF for this environment ❌</p>
)}

        <li>Environment: {appConfig.environment}</li>
        <li>API URL: {appConfig.apiUrl}</li>
        <li>App Name: {appConfig.appName}</li>
        <li>Log Level: {appConfig.logLevel}</li>
        <li>Analytics Enabled: {appConfig.analyticsEnabled.toString()}</li>
      </ul>

      {/* Task 5: Show config from separate component */}
      <ConfigDisplay />
    </div>
  );
}

export default App;
