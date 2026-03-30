// const appConfig = {
//   environment: process.env.REACT_APP_ENV,
//   apiUrl: process.env.REACT_APP_API_URL,
//   appName: process.env.REACT_APP_APP_NAME,
//   logLevel: process.env.REACT_APP_LOG_LEVEL,
//   analyticsEnabled: process.env.REACT_APP_ENABLE_ANALYTICS === "true"
// };

// export default appConfig;



//We only want to print config when the app is in dev mode.
//This variable is the condition to do that safely.
//read the environment variable set by react and compare to the string "development,
//then store the getValue, either true/false in the the variable 'is'
 
const isDevelopment = process.env.NODE_ENV === "development";
 
const appConfig = {
  environment: process.env.REACT_APP_ENV,
  apiUrl: process.env.REACT_APP_API_URL,
  appName: process.env.REACT_APP_APP_NAME,
  logLevel: process.env.REACT_APP_LOG_LEVEL,
  analyticsEnabled: process.env.REACT_APP_ENABLE_ANALYTICS === "true"
};
 
if (isDevelopment) {
  console.groupCollapsed(" appConfig is in development mode");
  console.log(appConfig);
  console.groupEnd();
}
 
export default appConfig;