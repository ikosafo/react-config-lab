import React from "react";
import environments from "../config/environments";

function EnvironmentBanner({ config }) {
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
