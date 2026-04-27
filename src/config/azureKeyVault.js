import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";


const credential = new DefaultAzureCredential();
const vaultUrl = "https://kv-hzb-c2-config.vault.azure.net/";
const client = new SecretClient(vaultUrl, credential);

let keyVaultClient;
 
const getKeyVaultClient = () => {
    if (!keyVaultClient) {
        const credential = new DefaultAzureCredential();
        keyVaultClient = new SecretClient(vaultUrl, credential);
    }
 
    return keyVaultClient;
};
 
export const getSecretValue = async (secretName, fallbackValue = "") => {
    if (!secretName) {
        return fallbackValue;
    }
 
    try {
        const client = getKeyVaultClient();
        const secret = await client.getSecret(secretName);
        return secret?.value ?? fallbackValue;
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.warn(`Key Vault fallback used for ${secretName}:`, error.message);
        }
        return fallbackValue;
    }
};
 