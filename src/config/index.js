import { getRemoteConfig } from "../services/keyVault";

const environment = process.env.REACT_APP_ENV || process.env.NODE_ENV;
const isDevelopment = environment === "development";

export const configClassification = {
  required: ["REACT_APP_ENV", "REACT_APP_API_URL"],
  optional: ["REACT_APP_APP_NAME", "REACT_APP_LOG_LEVEL", "REACT_APP_ENABLE_ANALYTICS"],
};

const config = {
  environment,
  apiUrl: process.env.REACT_APP_API_URL || "",
  appName: process.env.REACT_APP_APP_NAME || "",
  logLevel: process.env.REACT_APP_LOG_LEVEL || "",
  analyticsEnabled: process.env.REACT_APP_ENABLE_ANALYTICS === "",
};

const source = {
  apiUrl: process.env.REACT_APP_API_URL
    ? "Local .env (REACT_APP_API_URL)"
    : "fallback (default empty string)",
  appName: process.env.REACT_APP_APP_NAME
    ? "Local .env (REACT_APP_APP_NAME)"
    : "fallback (default \"React Config Lab\")",
  logLevel: process.env.REACT_APP_LOG_LEVEL
    ? "Local .env (REACT_APP_LOG_LEVEL)"
    : "fallback (default \"info\")",
};

let loadPromise = null;

function buildRequiredConfigError() {
  const missing = [];

  //Required environment can come from REACT_APP_ENV or NODE_ENV fallback.
  if (!config.environment) {
    missing.push({
      key: "REACT_APP_ENV",
      reason: "Environment identifier is required.",
      fix: "Set REACT_APP_ENV in env.development/.env.development or env.local/.env.local.",
    });
  }

  // Required value can come from local env or Key Vault resolution.
  if (!config.apiUrl) {
    missing.push({
      key: "REACT_APP_API_URL",
      reason: "API base URL is required for all backend calls.",
      fix: "Set REACT_APP_API_URL in local env or set Key Vault secret 'react-app-api-url'.",
    });
  }

  if (missing.length === 0) return null;

  const details = missing
    .map(
      (item) =>
        `- ${item.key}: ${item.reason} ${item.fix}`
    )
    .join("\n");

  return new Error(
    [
      "Missing required configuration.",
      "The app cannot start until these values are provided:",
      details,
    ].join("\n")
  );
}

export async function loadConfig() {
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    if (isDevelopment) {
      console.log(
        "🔍 Loading central config (.env first, then Key Vault for missing values)...\n"
      );
    }

    const remoteConfig = await getRemoteConfig().catch(() => ({}));

    if (!config.apiUrl && remoteConfig.apiUrl) {
      config.apiUrl = remoteConfig.apiUrl;
      source.apiUrl = "Azure Key Vault (react-app-api-url)";
    }

    if (!config.appName && remoteConfig.appName) {
      config.appName = remoteConfig.appName;
      source.appName = "Azure Key Vault (react-app-app-name)";
    }

    if (!process.env.REACT_APP_LOG_LEVEL && remoteConfig.logLevel) {
      config.logLevel = remoteConfig.logLevel;
      source.logLevel = "Azure Key Vault (react-app-log-level)";
    }

    const requiredError = buildRequiredConfigError();
    if (requiredError) {
      if (isDevelopment) {
        console.error("🚨 Configuration validation failed:\n" + requiredError.message);
      }
      throw requiredError;
    }

    if (isDevelopment) {
      console.groupCollapsed("✅ Config Loaded - Central Source");
      console.log(`API URL source: ${source.apiUrl}`);
      console.log(`App Name source: ${source.appName}`);
      console.log(`Log Level source: ${source.logLevel}`);
      console.table({
        "API URL": config.apiUrl || "(empty)",
        "App Name": config.appName || "(empty)",
        "Log Level": config.logLevel,
        Environment: config.environment,
        "Analytics Enabled": config.analyticsEnabled,
      });
      console.groupEnd();
    }

    return config;
  })();

  return loadPromise;
}

export default config;
