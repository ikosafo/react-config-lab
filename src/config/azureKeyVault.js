// const { ClientSecretCredential } = require("@azure/identity");
// const { SecretClient } = require("@azure/keyvault-secrets");

// // Azure Key Vault endpoint used by this application.
// const vaultUrl = "https://kv-hzb-c2-config.vault.azure.net/";

// // Service principal credentials are loaded from environment variables so
// // secrets are not hard-coded in source control.
// const tenantId = process.env.AZURE_TENANT_ID;
// const clientId = process.env.AZURE_CLIENT_ID;
// const clientSecret = process.env.AZURE_CLIENT_SECRET;

// // Fail fast if the app starts without the credentials needed to access Key Vault.
// if (!tenantId || !clientId || !clientSecret) {
//   throw new Error(
//     "Missing Azure authentication environment variables. " +
//     "Please set AZURE_TENANT_ID, AZURE_CLIENT_ID, and AZURE_CLIENT_SECRET."
//   );
// }

// const credential = new ClientSecretCredential(
//   tenantId,
//   clientId,
//   clientSecret
// );

// // Reuse a single SecretClient instance for all Key Vault secret lookups.
// const secretClient = new SecretClient(vaultUrl, credential);

// /**
//  * Fetch a secret from Azure Key Vault by name
//  * @param {string} secretName
//  * @returns {Promise<string>}
//  */
// async function getSecret(secretName) {
//   const response = await secretClient.getSecret(secretName);
//   return response.value;
// }

// module.exports = { credential, secretClient, getSecret };



import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

// The URL of your Azure Key Vault
const vaultUrl = "https://kv-hzb-c2-config.vault.azure.net/";

// Credential object used to authenticate with Azure
const credential = new DefaultAzureCredential();

// Secret client used to communicate with Azure Key Vault
const secretClient = new SecretClient(vaultUrl, credential);

/**
 * Fetch a secret value from Azure Key Vault by secret name
 * @param {string} secretName
 * @returns {Promise<string | null>}
 */
export async function getSecret(secretName) {
  try {
    const secret = await secretClient.getSecret(secretName);
    return secret.value ?? null;
  } catch (error) {
    console.error(
      `Error fetching secret "${secretName}" from Key Vault:`,
      error.message
    );
    return null;
  }
}

// Export client if needed elsewhere
export { secretClient };
