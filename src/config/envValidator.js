import appConfig from "./appConfig";

const requiredVariables = [
  "environment",
  "apiUrl"
];

// Optional values are safe to fill in with defaults at runtime.
// These are allowed to be missing as long as the app can still run.
//defines a function named validateConfig
//makes it available for import from other files
export const validateConfig = () => {
  const missingKeys = requiredVariables.filter((key) => !appConfig[key]);

  if (missingKeys.length > 0) {
    const message = `Missing required configuration variable(s): ${missingKeys.join(", ")}`;

    if (process.env.NODE_ENV === "development") {
      console.error(`🚨 ${message}`);
    }

    throw new Error(message);
  }

};