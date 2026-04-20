import React from "react";
import Dashboard from "./pages/Dashboard";
import EnvironmentBanner from "./components/EnvironmentBanner";
import ConfigViewer from "./components/ConfigViewer";

function App({ config, isDevelopment }) {
  return (
    <div>
      <EnvironmentBanner config={config} />
      {isDevelopment && <ConfigViewer config={config} />}
      <Dashboard />
    </div>
  );
}

export default App;
