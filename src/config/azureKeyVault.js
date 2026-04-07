
 import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
 
// Key Vault URL
const vaultUrl = "https://kv-hzb-c2-config.vault.azure.net/";
 
// Create credential and client
const credential = new DefaultAzureCredential();
const client = new SecretClient(vaultUrl, credential);
 
/**
* Fetch secret by name
* @param {string} name - Secret name in Key Vault
* @returns {Promise<string>} Secret value
*/
export async function getSecret(name) {
  try {
    const secret = await client.getSecret(name);
    return secret.value;
  } catch (err) {
    console.error(`Error fetching secret "${name}":`, err.message);
    return null;
  }
}
 
// ----------------------
// Test all secrets
// ----------------------
(async () => {
  const apiUrl = await getSecret("API-BASE-URL");
  const appEnv = await getSecret("APP-ENV");
  const sampleKey = await getSecret("SAMPLE-KEY");
 
  console.log("API-BASE-URL:", apiUrl);
  console.log("APP-ENV:", appEnv);
  console.log("SAMPLE-KEY:", sampleKey);
})();