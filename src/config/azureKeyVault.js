import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

// Task 4c: Key Vault URL
const vaultUrl = "https://kv-hzb-c2-config.vault.azure.net/";

/**
 * ENVIRONMENT CHECK
 * DefaultAzureCredential is a Node.js-only library. 
 * We check if we are in the browser to prevent crashes.
 */
const isBrowser = typeof window !== "undefined";

let client = null;

if (!isBrowser) {
  // Task 1b & 4b: Initialize Credential and Client (Server-side only)
  // This will use your 'az login' locally or Service Principal in production
  const credential = new DefaultAzureCredential();
  client = new SecretClient(vaultUrl, credential);
}

/**
 * Task 4d: Fetch secret by name
 * @param {string} name - Secret name in Key Vault
 * @returns {Promise<string|null>} Secret value or null if browser/error
 */
export async function getSecret(name) {
  // If in browser, return null (Task 7 fallback will take over in index.js)
  if (isBrowser) {
    return null;
  }

  try {
    // Azure secrets use hyphens, code usually uses underscores
    const normalizedName = name.replace(/_/g, "-");
    
    const secret = await client.getSecret(normalizedName);
    return secret.value;
  } catch (err) {
    // Task 2e: Documenting common errors
    console.error(`❌ Key Vault Error ("${name}"):`, err.message);
    return null;
  }
}

// ---------------------------------------------------------
// Task 4e: TESTING BLOCK (Run this file directly via Node)
// ---------------------------------------------------------
// To run: node src/config/azureKeyVault.js
if (!isBrowser && import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    console.log("--- ☁️ Testing Azure Connection ---");
    const test = await getSecret("API-BASE-URL");
    if (test) {
      console.log("✅ Connection Successful! Secret found.");
    } else {
      console.log("❌ Connection Failed. Check 'az login' or permissions.");
    }
  })();
}