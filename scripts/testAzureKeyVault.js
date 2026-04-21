import process from "node:process";
import { getSecret } from "../src/config/azureKeyVault.js";

if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}

  try {
    process.loadEnvFile(".env");
  } catch {}
}

async function resolveValue(envName, secretName) {
  const localValue = process.env[envName];

  if (localValue) {
    console.log(`${envName}: using local .env value -> ${localValue}`);
    return localValue;
  }

  const keyVaultValue = await getSecret(secretName);
  console.log(
    `${envName}: missing locally, using Key Vault (${secretName}) -> ${keyVaultValue}`
  );
  return keyVaultValue;
}

async function testSecrets() {
  try {
    console.log("Testing config resolution order: .env first, Key Vault second\n");

    const resolvedConfig = {
      environment: await resolveValue("REACT_APP_ENV", "app-env"),
      apiUrl: await resolveValue("REACT_APP_API_URL", "api-base-url"),
      logLevel: await resolveValue("REACT_APP_LOG_LEVEL", "log-level"),
      sampleKey: await getSecret("sample-key")
    };

    console.log("\nFinal resolved config:");
    console.log(resolvedConfig);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testSecrets();
