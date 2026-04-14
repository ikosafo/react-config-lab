# Task 4 - Key Vault Connection Module

## Goal

The goal of this task is to create a reusable module that connects to Azure Key Vault and fetches secrets by name.

The module created for this task is:

```text
src/config/azureKeyVault.js
```

## Key Vault URL

The project uses this Key Vault URL:

```text
https://kv-hzb-c2-config.vault.azure.net/
```

This URL points to the Key Vault named:

```text
kv-hzb-c2-config
```

## Credential Object

The module uses `ClientSecretCredential` from `@azure/identity`.

The credential object is created from three environment variables:

```text
AZURE_TENANT_ID
AZURE_CLIENT_ID
AZURE_CLIENT_SECRET
```

These values identify and authenticate the Service Principal that has access to the Key Vault.

The Client Secret value should only be stored locally in `.env` or another secure place. It should not be written in code or committed to Git.

## Secret Client

The module uses `SecretClient` from `@azure/keyvault-secrets`.

The Secret Client combines:

```text
Key Vault URL + Credential object
```

This allows the app or script to call Azure Key Vault using the Service Principal identity.

## getSecret Function

The module exports a reusable function:

```js
getSecret(secretName)
```

The function:

```text
1. Accepts the name of a secret.
2. Calls Azure Key Vault using secretClient.getSecret(secretName).
3. Returns the secret value.
```

Example use:

```js
const value = await getSecret("api-base-url");
```

## Test Script

The module is tested with:

```text
scripts/testAzureKeyVault.js
```

Run the script from the project root:

```powershell
node scripts\testAzureKeyVault.js
```

The script loads `.env`, imports `getSecret()`, and prints the fetched values to the terminal.

## Test Output

The successful test output was:

```text
Secret "api-base-url" value: http://localhost:4000
Secret "app-env" value: staging
Secret "sample-key" value: hello-from-keyvault
```

This confirms that:

```text
1. The Service Principal credentials are working.
2. The Key Vault URL is correct.
3. The Secret Client can connect to Azure Key Vault.
4. The getSecret() function can fetch secrets by name.
```

## Browser Safety Note

The Key Vault module should not be imported directly into the React browser app if it depends on `AZURE_CLIENT_SECRET`.

The secure approach is:

```text
React app -> backend or Node service -> Azure Key Vault
```

This prevents the Azure Client Secret from being exposed in browser JavaScript.
