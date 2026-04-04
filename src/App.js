import React from "react";
import Dashboard from "./pages/Dashboard";
import EnvironmentBanner from "./components/EnvironmentBanner";
import ConfigViewer from "./components/ConfigViewer";
import { isDevelopment } from "./config/appConfig";

function App() {
  return (
    <div>
      <EnvironmentBanner />
      {isDevelopment && <ConfigViewer />}
      <Dashboard />
    </div>
  );
}

export default App;
