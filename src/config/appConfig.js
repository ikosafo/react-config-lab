console.log("API URL:", process.env.REACT_APP_API_URL);

const appConfig = {
  environment: process.env.REACT_APP_ENV,
  apiUrl: process.env.REACT_APP_API_URL,
  appName: process.env.REACT_APP_APP_NAME,
  logLevel: process.env.REACT_APP_LOG_LEVEL,
  analyticsEnabled: process.env.REACT_APP_ENABLE_ANALYTICS === "true"
};


export default appConfig;
