import { ClientSecretCredential } from "@azure/identity"; 
import { SecretClient } from "@azure/keyvault-secrets";

const tenantId = process.env.REACT_APP_AZURE_TENANT_ID;
const clientId = process.env.REACT_APP_AZURE_CLIENT_ID;
const clientSecret = process.env.REACT_APP_AZURE_CLIENT_SECRET;

// Initializing the specific Service Principal credential
const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
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
getSecret("sample-key").then(value => console.log("Fetched value:", value));