const config = {
  environment: process.env.REACT_APP_ENV || null,
  apiUrl: process.env.REACT_APP_API_URL || null,
  appName: process.env.REACT_APP_APP_NAME || "My App",
  logLevel: process.env.REACT_APP_LOG_LEVEL || null,
  analyticsEnabled: process.env.REACT_APP_ENABLE_ANALYTICS === "true"
};

const requiredVariables = ["environment", "apiUrl"];

async function getSecretValue(secretName) {
  const { getSecret } = await import("./azureKeyVault");
  return getSecret(secretName);
}

export async function loadConfig() {
  if (!config.environment) {
    config.environment = await getSecretValue("app-env");
  }

  if (!config.apiUrl) {
    config.apiUrl = await getSecretValue("api-base-url");
  }

  if (!config.logLevel) {
    config.logLevel = await getSecretValue("log-level");
  }

  if (!config.logLevel) {
    config.logLevel = "info";
  }

  if (process.env.NODE_ENV === "development") {
    console.log("Loaded config:", config);
  }

  return config;
}

export function validateConfig() {
  const missing = requiredVariables
    .filter((key) => !config[key])
    .map((key) => {
      if (key === "environment") {
        return "environment (REACT_APP_ENV or Key Vault secret: app-env)";
      }

      if (key === "apiUrl") {
        return "apiUrl (REACT_APP_API_URL or Key Vault secret: api-base-url)";
      }

      return key;
    });

  if (missing.length > 0) {
    throw new Error(
      "Missing required configuration:\n" +
      missing.join("\n") +
      "\nCheck .env.local first, then confirm Azure Key Vault access and secret names."
    );
  }
}

export default config;
