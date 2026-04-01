//We only want to print config when the app is in dev mode.
//This variable is the condition to do that safely.
//read the environment variable set by react and compare to the string "development,
//then store the getValue, either true/false in the the variable 'is'


 

 
 
export const isDevelopment = process.env.REACT_APP_ENV === "development"; //we read the environment variable set by React and compare it to the string "development", then store the result, either true or false, in the variable 'isDevelopment'. This variable can then be used throughout our application to conditionally execute code that should only run in development mode, such as logging configuration details or enabling certain debugging features. By using this approach, we can ensure that sensitive information is not exposed in production environments while still allowing developers to access necessary configuration details during development.
 
 
const appConfig = {
  environment: process.env.REACT_APP_ENV,
  apiUrl: process.env.REACT_APP_API_URL,
  appName: process.env.REACT_APP_APP_NAME,
  logLevel: process.env.REACT_APP_LOG_LEVEL,
  analyticsEnabled: process.env.REACT_APP_ENABLE_ANALYTICS === "true"
};

if (isDevelopment) { 
  console.groupCollapsed(" appConfig is in development mode");  
  console.log("appConfig values:", appConfig); 
  console.groupEnd();
} else {
  console.log("appConfig is not in development mode.");
}
export default appConfig;