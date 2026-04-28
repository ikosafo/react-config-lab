// Load secrets from environment variables (browser safe)
const config = {
  "API-BASE-URL": process.env.REACT_APP_API_BASE_URL || "local-fallback-api",
  "APP-ENV": process.env.REACT_APP_APP_ENV || "local-fallback-env",
  "SAMPLE-KEY": process.env.REACT_APP_SAMPLE_KEY || "local-fallback-key",
};

// Function to log which values are from .env and which are fallbacks
export function logConfigSource() {
  Object.entries(config).forEach(([key, value]) => {
    const envVar = process.env[`REACT_APP_${key.replace(/-/g, "_")}`];
    if (envVar) {
      console.log(`${key}: ${value} (from .env)`);
    } else {
      console.log(`${key}: ${value} (fallback)`);
    }
  });
}

// Return the config object
export default function loadConfig() {
  return config;
}
