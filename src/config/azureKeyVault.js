import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";


const credential = new DefaultAzureCredential();
const vaultUrl = "https://kv-hzb-c2-config.vault.azure.net/";
const client = new SecretClient(vaultUrl, credential);


export async function getSecret(secretName) {
    try {
        const secret = await client.getSecret(secretName);
        console.log(`Secret value for ${secretName}: ${secret.value}`);
        return secret.value;
    } catch (error) {
        console.error("Error fetching secret:", error);
        throw error;
    }
}

// Example usage (uncomment to test):
 getSecret("app-env").then(value => console.log("Fetched value:", value));