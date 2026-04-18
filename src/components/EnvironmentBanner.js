import React from "react";
import config from "../config";
import environments from "../config/environments";

function EnvironmentBanner() {

  const env = environments[config.environment];

  return (
    <div style={{
      background: env?.color || "gray",
      color: "white",
      padding: "10px"
    }}>
      Running in: {env?.name}
    </div>
  );
}

export default EnvironmentBanner;
