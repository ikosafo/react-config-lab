// @azure/identity handles authentication with Azure AD
import { DefaultAzureCredential } from "@azure/identity";
// @azure/keyvault-secrets talks to the vault itself
import { SecretClient } from "@azure/keyvault-secrets";

const vaultUrl = "https://kv-hzb-c2-config.vault.azure.net/";

const credential = new DefaultAzureCredential();
const secretClient = new SecretClient(vaultUrl, credential);

// Fetches a single secret by name from Key Vault
// Returns the secret's value as a string, or null on error
export async function getSecret(secretName) {
  try {
    const secret = await secretClient.getSecret(secretName);
    return secret.value;
  } catch (error) {
    console.error(`Failed to fetch secret "${secretName}":`, error.message);
    return null;
  }
}