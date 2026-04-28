import { getSecret } from "./azureKeyVault.js";

async function loadConfig() {
  const config = {
    // Priority: .env first, then Azure
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || await getSecret("API-BASE-URL"),
    APP_ENV: process.env.REACT_APP_APP_ENV || await getSecret("APP-ENV"),
    SAMPLE_KEY: process.env.REACT_APP_SAMPLE_KEY || await getSecret("SAMPLE-KEY")
  };

  // --- TASK 9: ENFORCE THE CRASH ---
  // If API_BASE_URL is still undefined/null after checking both places
  if (!config.API_BASE_URL) {
    throw new Error("❌ FATAL: API_BASE_URL is missing from both .env and Azure Key Vault!");
  }

  return config;
}

export default loadConfig;