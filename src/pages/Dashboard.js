import React from "react";
import ConfigViewer from "../components/ConfigViewer";
import { isDevelopment } from "../config/appConfig";

function Dashboard() {
  return (
    <div style={{ padding: 30 }}>
      <h1>Hello from my local machine</h1>
      {isDevelopment && <ConfigViewer />}
    </div>
  );
}

export default Dashboard;
