// ============================================================
// src/config/index.js
// Central configuration file for the GAS Project
// This file is the ONLY place where config is loaded.
// All other files should import from here instead of reading
// process.env directly.
// Satisfies Tasks 6, 7, and 8
// ============================================================


// Import the getSecret function we built in Task 4
// This is the function that connects to Azure Key Vault
// and fetches a secret by name
import { getSecret } from "./azureKeyVault.js";

// Import the validateConfig function from Sprint 1
// This checks that required variables are present
// and throws an error if any are missing
import { validateConfig } from "./envValidator.js";


// ============================================================
// isDevelopment
// A simple true/false flag that tells us if the app is
// currently running in development mode on someone's laptop.
// NODE_ENV is automatically set by React — you never set it
// manually. It is "development" when you run npm start,
// and "production" when you run npm run build.
// We use this to decide whether to log config to the console.
// ============================================================
export const isDevelopment = process.env.NODE_ENV === "development";


// ============================================================
// getConfig — the heart of Tasks 6 and 7
//
// This function is called for every config variable.
// It tries three places in order and returns the first value it finds:
//
// 1. Check the .env file (process.env) — local development values
// 2. If not found → ask Azure Key Vault for the value
// 3. If still not found → use the fallback default
//
// Parameters:
//   envKey   — the .env variable name  e.g. "REACT_APP_ENV"
//   vaultKey — the Key Vault secret name e.g. "REACT-APP-ENV"
//   fallback — a safe default if neither source has the value
// ============================================================
async function getConfig(envKey, vaultKey, fallback = null) {

  // Step 1 — Look in the .env file first
  // process.env is a Node.js object that holds all environment
  // variables. React automatically loads .env.local and
  // .env.development into process.env when you run npm start.
  const envValue = process.env[envKey];

  // If a value was found in .env and it is not empty, use it
  // This is the Task 7 fallback — .env takes priority over Key Vault
  if (envValue !== undefined && envValue !== "") {
    return envValue;
  }

  // Step 2 — .env value was not found, so try Key Vault
  // We log a warning so developers know Key Vault is being used
  // This makes debugging easier — you can see in the console
  // which variables came from .env and which came from the vault
  console.warn(`[Config] ${envKey} not in .env — fetching from Key Vault...`);

  // Call the getSecret function from azureKeyVault.js
  // This authenticates to Azure AD and fetches the secret by name
  const vaultValue = await getSecret(vaultKey);

  // If Key Vault returned a value, use it
  if (vaultValue !== null) {
    return vaultValue;
  }

  // Step 3 — neither .env nor Key Vault had the value
  // Return the fallback default so the app doesn't crash
  // Optional variables have safe defaults, required ones will
  // be caught by validateConfig below
  return fallback;
}


// ============================================================
// loadConfig — fetches all five config variables
//
// This function calls getConfig for every variable the app needs.
// It uses Promise.all to fetch all five at the same time in parallel
// instead of one by one — this is much faster because all five
// Key Vault requests happen simultaneously.
//
// The order of variables in Promise.all must match the order
// they are destructured in the const [ ] line below.
// ============================================================
async function loadConfig() {

  // Fetch all five variables at the same time
  // Each getConfig call checks .env first, then Key Vault
  // The third argument is the fallback default value
  const [environment, apiUrl, appName, logLevel, analyticsEnabled] =
  await Promise.all([
    getConfig("REACT_APP_ENV",              "REACT-APP-ENV"),
    getConfig("REACT_APP_API_URL",          "REACT-APP-API-URL"),
    getConfig("REACT_APP_APP_NAME",         "react-app-app-name",        "React Config Lab"),
    getConfig("REACT_APP_LOG_LEVEL",        "REACT-APP-LOG-LEVEL",       "info"),
    getConfig("REACT_APP_ENABLE_ANALYTICS", "REACT-APP-ENABLE-ANALYTICS","false"),
  ]);


  // Build the config object using the values we just fetched
  // Keep one stable config shape so the rest of the app can
  // consume a single resolved config object.
  const config = {
    environment,        // e.g. "development", "staging", "production"
    apiUrl,             // e.g. "http://localhost:3000/api"
    appName,            // e.g. "React Config Lab"
    logLevel,           // e.g. "info", "debug"

    // analyticsEnabled comes back as a string "true" or "false"
    // from both .env and Key Vault — strings only
    // We convert it to a real boolean here using === "true"
    // so the rest of the app can use it as true/false properly
    analyticsEnabled: analyticsEnabled === "true",
  };


  // Task 9 — Validate that required variables are present
  // validateConfig checks that environment and apiUrl are not null
  // If either is missing it throws an error with a helpful message
  // This prevents the app from starting with broken config
  validateConfig(config);


  // Only log the config in development mode
  // We never log config in production because it could expose
  // sensitive values in browser dev tools or server logs
  if (isDevelopment) {
    console.groupCollapsed("config (development mode)");
    console.log(config);
    console.groupEnd();
  }

  // Return the completed config object
  return config;
}


// ============================================================
// configPromise — the exported config
//
// Because Key Vault calls are asynchronous (they make network
// requests), we cannot export a plain object directly.
// Instead we export a Promise that resolves to the config object.
//
// Any file that imports this config needs to await it:
//   import configPromise from "./config";
//   const config = await configPromise;
//
// loadConfig() is called once when the app starts.
// The result is cached in configPromise so Key Vault is only
// called once — not every time a component needs the config.
// ============================================================

const configPromise = loadConfig();
configPromise.then(config => console.log("\n✅ Config loaded successfully:\n", config));
export default configPromise;

