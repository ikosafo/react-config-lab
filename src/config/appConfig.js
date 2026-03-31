const appConfig = {
  environment: process.env.REACT_APP_ENV,
  apiUrl: process.env.REACT_APP_API_URL,
  appName: process.env.REACT_APP_APP_NAME || "My App",
  logLevel: process.env.REACT_APP_LOG_LEVEL || "info",
  analyticsEnabled: process.env.REACT_APP_ENABLE_ANALYTICS === "true"
};
 
const requiredEnvVars = {
  environment: "REACT_APP_ENV",
  apiUrl: "REACT_APP_API_URL"
};
 
const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([key]) => !appConfig[key])
  .map(([, envVarName]) => envVarName);
 
if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variable(s): ${missingEnvVars.join(", ")}. ` +
    `Please add them to your .env.local or .env.development file.`
  );
}
 
 
const isDev = process.env.REACT_APP_ENV === 'development'; // Log the loaded config in development mode for easier debugging
 
if (isDev) {
  console.groupCollapsed('AppConfig is in development mode, config values are not logged to console:');
  console.log('Loaded config:', appConfig);
  console.groupEnd();
} // This helps us to see the loaded config in development mode for easier debugging
 
else {
  console.log('AppConfig is not in development mode');
} // If app is not in development mode, we log a message to indicate that the config is not in development mode.

export default appConfig;

