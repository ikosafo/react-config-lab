// const appConfig = {
//   environment: process.env.REACT_APP_ENV,
//   apiUrl: process.env.REACT_APP_API_URL,
//   appName: process.env.REACT_APP_APP_NAME || "My App",
//   logLevel: process.env.REACT_APP_LOG_LEVEL || "info",
//   analyticsEnabled: process.env.REACT_APP_ENABLE_ANALYTICS === "true"
// };
 
// const requiredEnvVars = {
//   environment: "REACT_APP_ENV",
//   apiUrl: "REACT_APP_API_URL"
// };
 
// const missingEnvVars = Object.entries(requiredEnvVars)
//   .filter(([key]) => !appConfig[key])
//   .map(([, envVarName]) => envVarName);
 
// if (missingEnvVars.length > 0) {
//   throw new Error(
//     `Missing required environment variable(s): ${missingEnvVars.join(", ")}. ` +
//     `Please add them to your .env.local or .env.development file.`
//   );
// }
 
 
// const isDev = process.env.REACT_APP_ENV === 'development'; // Log the loaded config in development mode for easier debugging
 
// if (isDev) {
//   console.groupCollapsed('AppConfig is in development mode, config values are not logged to console:');
//   console.log('Loaded config:', appConfig);
//   console.groupEnd();
// } // This helps us to see the loaded config in development mode for easier debugging
 
// else {
//   console.log('AppConfig is not in development mode');
// } // If app is not in development mode, we log a message to indicate that the config is not in development mode.

// export default appConfig;

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