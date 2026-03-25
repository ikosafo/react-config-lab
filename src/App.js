import React from "react";
import Dashboard from "./pages/Dashboard";
import EnvironmentBanner from "./components/EnvironmentBanner";

function App() {

  return (
    <div>
    <hi> Hello from my local machine! My name is Fafa  </hi>


      <EnvironmentBanner />

      <Dashboard />

    </div>

  );

}

export default App;