//Pull in the two Azure SDK packages you installed in Task 3
// @azure/identity handles authentication with Azure AD
const { DefaultAzureCredential } = require("@azure/identity");
// @azure/keyvault-secrets talks to the vault itself
const { SecretClient } = require("@azure/keyvault-secrets");

//The address of the project's vault. This never changes
// The URL of your Azure Key Vault
const vaultUrl = "https://kv-hzb-c2-config.vault.azure.net/";

//DefaultAzureCredential is smart, on the laptop it uses the az login session. In production it uses the Service Principal env vars automatically.
// Creates a credential that tries multiple auth methods automatically
// Locally: uses your az login session
// In production: uses AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID
const credential = new DefaultAzureCredential();

//Combines the credential + vault URL into a client object that can talk to the vault.
// Creates the client that connects to your specific vault
const secretClient = new SecretClient(vaultUrl, credential);

//The reusable function the rest of the app will call. Pass in a secret name, get back its value.
// Fetches a single secret by name from Key Vault
// Returns the secret's value as a string
async function getSecret(secretName) {
  try {
    const secret = await secretClient.getSecret(secretName);
    return secret.value;
  } catch (error) {
    console.error(`Failed to fetch secret "${secretName}":`, error.message);
    return null;
  }
}

//Export the function so other files can use it. The test block only runs when you execute this file directly with Node — not when it's imported by another file.
module.exports = { getSecret };
 
// Test block — only runs when you call: node src/config/azureKeyVault.js
if (require.main === module) {
  (async () => {
    console.log("Testing Key Vault connection...");
    const value = await getSecret("APP-ENV");
    console.log("APP-ENV =", value);
  })();
}