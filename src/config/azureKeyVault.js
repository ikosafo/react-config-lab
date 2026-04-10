// Load environment variables from your .env file
require('dotenv').config(); 

const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

// Use the vault name from your .env file
const vaultName = process.env.REACT_APP_AZURE_KEYVAULT_NAME || "kv-hzb-c2-config";
const url = `https://${vaultName}.vault.azure.net`;

const credential = new DefaultAzureCredential();
const client = new SecretClient(url, credential);

async function logAllSecrets() {
    console.log("--- 🚀 FETCHING ALL KEY VAULT SECRETS ---");
    try {
        const secretProperties = client.listPropertiesOfSecrets();
        
        console.log("-----------------------------------------------");
        console.log("NAME                | VALUE");
        console.log("--------------------|--------------------------");

        for await (const properties of secretProperties) {
            const secret = await client.getSecret(properties.name);
            console.log(`${properties.name.padEnd(20)}| ${secret.value}`);
        }

        console.log("-----------------------------------------------");
        console.log(`✅ SUCCESS! All secrets displayed.`);
    } catch (error) {
        console.error("❌ FAILED TO FETCH SECRETS!");
        console.error("Error Message:", error.message);
    }
}

// Export the function for other files
module.exports = { logAllSecrets };

// Run the test
logAllSecrets();
