# Task 3 - Azure SDK Notes

## Goal

The goal of this task is to install the Azure SDK packages needed for the project to communicate with Azure Key Vault.

The required packages are:

```text
@azure/identity
@azure/keyvault-secrets
```

## Installation Command

The packages can be installed from the project root with:

```powershell
npm install @azure/identity @azure/keyvault-secrets
```

## Package Confirmation

The project includes the required dependencies in `package.json`:

```json
"@azure/identity": "^4.13.1",
"@azure/keyvault-secrets": "^4.10.0"
```

## What @azure/identity Does

`@azure/identity` is the Azure authentication library used by Azure SDK clients. It provides credential classes that can request access tokens from Microsoft Entra ID.

In this project, the important credential class is:

```js
ClientSecretCredential
```

`ClientSecretCredential` uses:

```text
AZURE_TENANT_ID
AZURE_CLIENT_ID
AZURE_CLIENT_SECRET
```

These values represent the Service Principal used to authenticate the application.

In simple terms:

```text
@azure/identity proves who the app is.
```

## What @azure/keyvault-secrets Does

`@azure/keyvault-secrets` is the Azure SDK package used to read and manage secrets stored in Azure Key Vault.

In this project, the important class is:

```js
SecretClient
```

`SecretClient` connects to the Key Vault URL and provides methods such as:

```text
getSecret(secretName)
setSecret(secretName, value)
beginDeleteSecret(secretName)
listPropertiesOfSecrets()
```

In this project, we only use `getSecret()` to fetch stored configuration values.

In simple terms:

```text
@azure/keyvault-secrets gets secrets from Azure Key Vault.
```

## How Both Packages Work Together

```text
@azure/identity authenticates the app.
@azure/keyvault-secrets uses that authenticated identity to access Key Vault.
```

Project flow:

```text
ClientSecretCredential -> SecretClient -> getSecret(secretName)
```

## Project Usage

The Azure SDK is used in:

```text
src/config/azureKeyVault.js
```

The module imports the SDK packages, creates a credential object, creates a Secret Client, and exports a reusable `getSecret()` function.
