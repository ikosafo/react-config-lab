// We only want to print config when the app is in development mode.
// React sets REACT_APP_ENV to "development" locally and "production" in the build.
// Check that value and log the full config object only when this is a local dev run.

const isDevelopment = process.env.REACT_APP_ENV === "development";

const appConfig = {
  environment: process.env.REACT_APP_ENV,
  apiUrl: process.env.REACT_APP_API_URL,
  appName: process.env.REACT_APP_APP_NAME,
  logLevel: process.env.REACT_APP_LOG_LEVEL,
  analyticsEnabled: process.env.REACT_APP_ENABLE_ANALYTICS,
};

if (isDevelopment) {
  console.groupCollapsed("appConfig is in development ");
  console.log(appConfig);
  console.groupEnd();
}


export default appConfig;
