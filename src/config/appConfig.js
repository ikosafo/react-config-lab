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


const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  console.log('Loaded config:', appConfig);
}

 export default appConfig;