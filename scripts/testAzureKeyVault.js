// const process = require("node:process");

// // Load local Azure credentials before importing the Key Vault module.
// process.loadEnvFile(".env");

// // Import the shared helper that reads secrets from Azure Key Vault.
// const { getSecret } = require("../src/config/azureKeyVault.js");

// async function test() {
//   try {
//     // Keep the test list small so this script verifies access without dumping every secret.
//     const secretNames = ["api-base-url", "app-env", "sample-key"];

//     // Fetch each configured secret one at a time and print its value for local verification.
//     for (const secretName of secretNames) {
//       const value = await getSecret(secretName);
//       console.log(`Secret "${secretName}" value:`, value);
//     }
//   } catch (error) {
//     // Surface the Azure/client error message without the full stack trace.
//     console.error("Error fetching secret:", error.message);
//   }
// }

// // Run the manual Key Vault connectivity check.
// test();



// import { getSecret } from "../src/config/azureKeyVault.js";

// async function testSecrets() {
//   try {
//     const secrets = [
//       "api-base-url",
//       "app-env",
//       "sample-key"
//     ];

//     for (const name of secrets) {
//       const value = await getSecret(name);
//       console.log(`${name}: ${value}`);
//     }

//   } catch (error) {
//     console.error("Error:", error.message);
//   }
// }

// testSecrets();


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
