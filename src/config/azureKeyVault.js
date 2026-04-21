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
