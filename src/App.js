import React from "react";
import Dashboard from "./pages/Dashboard";
import EnvironmentBanner from "./components/EnvironmentBanner";

function App() {

  return (
    <div>
    <h1> Hello from my local machine! My name is Fafa  </h1>


      <EnvironmentBanner />

      <Dashboard />

    </div>

  );

}

export default App;