//We only want to print config when the app is in dev mode.
//This variable is the condition to do that safely.
//read the environment variable set by react and compare to the string "development,
//then store the getValue, either true/false in the the variable 'is'

import { getSecretValue } from "./azureKeyVault"; 
export const isDevelopment = process.env.REACT_APP_ENV === "development"; //we read the environment variable set by React and compare it to the string "development", then store the result, either true or false, in the variable 'isDevelopment'. This variable can then be used throughout our application to conditionally execute code that should only run in development mode, such as logging configuration details or enabling certain debugging features. By using this approach, we can ensure that sensitive information is not exposed in production environments while still allowing developers to access necessary configuration details during development.
export default appConfig;
 
const appConfig = {
  environment: process.env.REACT_APP_ENV,
  apiUrl: process.env.REACT_APP_API_URL,
  appName: process.env.REACT_APP_APP_NAME,
  logLevel: process.env.REACT_APP_LOG_LEVEL,
  analyticsEnabled: process.env.REACT_APP_ENABLE_ANALYTICS === "true"
};

// const appConfig = { ...defaultConfig };

 
const keyVaultSecretNames = {
  environment: process.env.REACT_APP_KV_SECRET_ENV || "react-app-env",
  apiUrl: process.env.REACT_APP_KV_SECRET_API_URL || "react-app-api-url",
  appName: process.env.REACT_APP_KV_SECRET_APP_NAME || "react-app-app-name",
};

export const loadAppConfigFromKeyVault = async () => {
  const [environment, apiUrl, appName] = await Promise.all([
    getSecretValue(keyVaultSecretNames.environment, defaultConfig.environment),
    getSecretValue(keyVaultSecretNames.apiUrl, defaultConfig.apiUrl),
    getSecretValue(keyVaultSecretNames.appName, defaultConfig.appName),
  ]);
 
  appConfig.environment = environment;
  appConfig.apiUrl = apiUrl;
  appConfig.appName = appName;

if (isDevelopment) { 
  console.groupCollapsed(" loaded from key vault");  
  console.log("environment:", appConfig.environment);
    console.log("apiUrl:", appConfig.apiUrl);
    console.log("appName:", appConfig.appName);
    console.log("fullConfig:", appConfig); 
  console.groupEnd();
} else {
  console.log("appConfig is not in development mode.");
}
 export default appConfig;

}