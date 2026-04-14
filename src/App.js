import React from "react";
import Dashboard from "./pages/Dashboard";
import EnvironmentBanner from "./components/EnvironmentBanner";
//import "./config/azureKeyVault";

function App() {

  return (

    <div>

      <EnvironmentBanner />

      <Dashboard />

    </div>

  );

}

export default App;
