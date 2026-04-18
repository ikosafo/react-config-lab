# Azure Key Vault Guide

## Goal

This guide explains how Azure Key Vault is used in this project and how a developer can:

- log into Azure
- confirm access to the project Key Vault
- add and view secrets
- test secret loading
- understand local `.env` fallback behavior

## Project Details

The Azure resources used in this project are:

```text
Service Principal: hzb-c2-kv-sp
Key Vault: kv-hzb-c2-config
Vault URL: https://kv-hzb-c2-config.vault.azure.net/
```

## Where To Run Commands

Run commands from the project root in a terminal such as:

- VS Code terminal
- PowerShell
- Command Prompt

Project path used during development:

```text
C:\Users\azame\Desktop\react-config-lab
```

## Azure Login

Log into Azure with:

```powershell
az login
```

Verify the current account:

```powershell
az account show
```

Confirm access to the project Key Vault:

```powershell
az keyvault show --name kv-hzb-c2-config
```

List secret names:

```powershell
az keyvault secret list --vault-name kv-hzb-c2-config --query "[].name"
```

## Local Azure Credentials

The local `.env` file should contain the Azure credentials used by the Key Vault helper:

```env
AZURE_TENANT_ID=<tenant-id>
AZURE_CLIENT_ID=<client-id>
AZURE_CLIENT_SECRET=<client-secret-value>
```

These values must not be committed to Git.

## How To Add Secrets

Secrets can be added in either Azure Portal or Azure CLI.

### Azure Portal

```text
1. Open Azure Portal.
2. Open Key Vaults.
3. Open kv-hzb-c2-config.
4. Select Secrets.
5. Select Generate/Import.
6. Enter the secret name and value.
7. Save the secret.
```

### Azure CLI

Example commands:

```powershell
az keyvault secret set --vault-name kv-hzb-c2-config --name api-base-url --value http://localhost:4000
az keyvault secret set --vault-name kv-hzb-c2-config --name app-env --value staging
az keyvault secret set --vault-name kv-hzb-c2-config --name log-level --value info
az keyvault secret set --vault-name kv-hzb-c2-config --name sample-key --value hello-from-keyvault
```

## Secrets Used In This Project

Current Key Vault secrets used by the project:

- `api-base-url`
- `app-env`
- `log-level`
- `sample-key`

Mapping between local config and Key Vault secrets:

| Meaning | Local env variable | Key Vault secret |
|---|---|---|
| Environment | `REACT_APP_ENV` | `app-env` |
| API URL | `REACT_APP_API_URL` | `api-base-url` |
| Log level | `REACT_APP_LOG_LEVEL` | `log-level` |
| Test secret | none | `sample-key` |

## How The App Reads Secrets

Configuration is centralized in:

```text
src/config/index.js
```

The config object includes:

- `environment`
- `apiUrl`
- `appName`
- `logLevel`
- `analyticsEnabled`

The current loading order is:

```text
1. Local .env value
2. Azure Key Vault value if local value is missing
3. Default value for optional settings only
```

The app startup file is:

```text
src/index.js
```

This loads configuration before rendering the React app.

## How Fallback Works

Fallback is implemented so that local values are checked first.

Example behavior:

- if `REACT_APP_API_URL` exists in `.env.local`, that value is used
- if `REACT_APP_API_URL` is missing locally, the app attempts to read `api-base-url` from Azure Key Vault

This same pattern is used for:

- `REACT_APP_ENV` -> `app-env`
- `REACT_APP_API_URL` -> `api-base-url`
- `REACT_APP_LOG_LEVEL` -> `log-level`

## Required And Optional Configuration

Required values:

- `environment`
- `apiUrl`

Optional values:

- `appName`
- `logLevel`
- `analyticsEnabled`

If a required value is missing, the config validation throws an error with a helpful message telling the developer to check `.env.local` or Azure Key Vault.

## Testing Key Vault Access

To test direct Key Vault access and fallback behavior, run:

```powershell
node scripts\testAzureKeyVault.js
```

This script:

- loads `.env.local` and `.env` if available
- checks local env values first
- fetches missing values from Azure Key Vault
- prints the final resolved values
- also fetches `sample-key` to confirm Key Vault access

## Testing Fallback Behavior

### Test 1 - With `.env.local`

Example `.env.local` values:

```env
REACT_APP_ENV=development
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_LOG_LEVEL=debug
```

Run:

```powershell
node scripts\testAzureKeyVault.js
```

Expected behavior:

- local values are used first
- output shows `using local .env value`

### Test 2 - Without Local Values

Remove or comment out these values in `.env.local`:

```env
REACT_APP_ENV=
REACT_APP_API_URL=
REACT_APP_LOG_LEVEL=
```

Run again:

```powershell
node scripts\testAzureKeyVault.js
```

Expected behavior:

- missing local values are fetched from Azure Key Vault
- output shows `missing locally, using Key Vault`

## Important Security Notes

- Do not commit `.env` files.
- Do not store real secret values in documentation.
- If a client secret is exposed, rotate it immediately in Azure.
- Direct browser use of privileged Azure credentials is not recommended.
- The safer production pattern is:

```text
Frontend -> Backend or startup script -> Azure Key Vault
```
