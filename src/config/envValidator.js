// ============================================================
// src/config/envValidator.js
// Validates that all required configuration values are present
// before the app starts running.
//
// Required variables — app cannot start without these
// Optional variables — have safe defaults if missing
//
// Task 9 — Sprint 2
// ============================================================


// ============================================================
// REQUIRED_VARIABLES
// These variables must have a value for the app to function.
// If any are missing, the app will throw an error and stop.
//
// Each entry has:
//   key         — the config object property name
//   envName     — the .env variable name
//   vaultName   — the Key Vault secret name
//   description — what this variable does
// ============================================================
const REQUIRED_VARIABLES = [
  {
    key: "environment",
    envName: "REACT_APP_ENV",
    vaultName: "REACT-APP-ENV",
    description: "The environment the app is running in (development, staging, production)"
  },
  {
    key: "apiUrl",
    envName: "REACT_APP_API_URL",
    vaultName: "REACT-APP-API-URL",
    description: "The base URL for all API calls"
  }
];


// ============================================================
// OPTIONAL_VARIABLES
// These variables have safe defaults if not found anywhere.
// The app will still run without them.
// ============================================================
const OPTIONAL_VARIABLES = [
  {
    key: "appName",
    envName: "REACT_APP_APP_NAME",
    vaultName: "react-app-app-name",
    defaultValue: "React Config Lab",
    description: "The display name of the application"
  },
  {
    key: "logLevel",
    envName: "REACT_APP_LOG_LEVEL",
    vaultName: "REACT-APP-LOG-LEVEL",
    defaultValue: "info",
    description: "How much detail to log (debug, info, warn, error)"
  },
  {
    key: "analyticsEnabled",
    envName: "REACT_APP_ENABLE_ANALYTICS",
    vaultName: "REACT-APP-ENABLE-ANALYTICS",
    defaultValue: false,
    description: "Whether analytics tracking is enabled"
  }
];


// ============================================================
// validateConfig
// Checks that all required variables have values.
// Collects ALL missing variables before throwing —
// so the developer sees everything that's wrong at once,
// not just the first missing value.
//
// Parameters:
//   config — the config object built by index.js
// ============================================================
export const validateConfig = (config) => {

  // Collect all missing required variables
  const missing = REQUIRED_VARIABLES.filter(variable => {
    const value = config[variable.key];
    // A value is missing if it is null, undefined, or empty string
    return value === null || value === undefined || value === "";
  });

  // If nothing is missing — all good, return silently
  if (missing.length === 0) return;

  // Build a helpful error message listing everything that's wrong
  const errorLines = [
    "",
    "╔══════════════════════════════════════════════════════════╗",
    "║         CONFIGURATION ERROR — APP CANNOT START           ║",
    "╚══════════════════════════════════════════════════════════╝",
    "",
    `${missing.length} required configuration value(s) are missing:`,
    "",
    ...missing.map(variable => [
      `  ✗ ${variable.key}`,
      `    What it does : ${variable.description}`,
      `    .env name    : ${variable.envName}`,
      `    Vault secret : ${variable.vaultName}`,
      `    Fix          : Add to .env.local OR add to Azure Key Vault`,
      ""
    ].join("\n")),
    "How to fix:",
    "  Option 1 — Add to .env.local:",
    ...missing.map(v => `    ${v.envName}=your-value-here`),
    "",
    "  Option 2 — Add to Azure Key Vault:",
    ...missing.map(v => `    az keyvault secret set --vault-name kv-hzb-c2-config --name "${v.vaultName}" --value "your-value-here"`),
    "",
  ];

  throw new Error(errorLines.join("\n"));
};


// ============================================================
// Export variable lists so other files can reference them
// For example, index.js could use these to know which
// variables to fetch from Key Vault
// ============================================================
export { REQUIRED_VARIABLES, OPTIONAL_VARIABLES };