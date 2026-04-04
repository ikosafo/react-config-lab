import { validateConfig } from "./envValidator";

// Local development behavior should follow React's build mode, not the
// deployment target stored in REACT_APP_ENV.
export const isDevelopment = process.env.NODE_ENV === "development";

const appConfig = {
  environment: process.env.REACT_APP_ENV,
  apiUrl: process.env.REACT_APP_API_URL,
  appName: process.env.REACT_APP_APP_NAME || "React Config Lab",
  logLevel: process.env.REACT_APP_LOG_LEVEL || "info",
  analyticsEnabled: process.env.REACT_APP_ENABLE_ANALYTICS === "true"
};

validateConfig(appConfig);

// Only log config in development mode to avoid exposing sensitive information
if (isDevelopment) {
  console.groupCollapsed("appConfig (development mode)");
  console.log(appConfig);
  console.groupEnd();
}

export default appConfig;
