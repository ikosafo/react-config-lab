const configEndpoint = process.env.REACT_APP_CONFIG_API_URL || "http://localhost:5000/api/config";

let cachedConfig = null;
let loadPromise = null;

function mapSecretNameToConfigKey(secretName) {
  switch (secretName) {
    case "react-app-api-url":
      return "apiUrl";
    case "react-app-app-name":
      return "appName";
    case "react-app-log-level":
      return "logLevel";
    default:
      return null;
  }
}

async function loadRemoteConfig() {
  if (cachedConfig) return cachedConfig;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const response = await fetch(configEndpoint, {
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Config API request failed with status ${response.status}`);
      }

      cachedConfig = await response.json();

      if (process.env.REACT_APP_ENV === "development") {
        console.log("✅ Loaded configuration from backend Key Vault proxy:", configEndpoint);
      }

      return cachedConfig;
    } catch (error) {
      if (process.env.REACT_APP_ENV === "development") {
        console.warn("⚠️  Could not load config from backend proxy:", error.message);
      }

      // Fallback resolution is centralized in src/config/index.js.
      cachedConfig = {};

      return cachedConfig;
    }
  })();

  return loadPromise;
}

export async function getSecret(secretName) {
  const config = await loadRemoteConfig();
  const configKey = mapSecretNameToConfigKey(secretName);

  if (!configKey) return null;

  const value = config[configKey];
  return value || null;
}

export async function getRemoteConfig() {
  return loadRemoteConfig();
}
