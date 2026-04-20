# Azure Key Vault Guide

**GAS Project - Configuration Team | Sprint 2, Task 10**

> This guide is for any new developer joining the project.
> By the end of it you will be able to log into Azure, access the vault,
> add secrets, and understand how the app reads them.

---

## Table of Contents

1. [Background - Why Key Vault?](#1-background---why-key-vault)
2. [How to Log Into Azure](#2-how-to-log-into-azure)
3. [How to Access the Key Vault](#3-how-to-access-the-key-vault)
4. [How to Add Secrets](#4-how-to-add-secrets)
5. [How the App Reads Secrets](#5-how-the-app-reads-secrets)
6. [How the Fallback Works](#6-how-the-fallback-works)
7. [Required vs Optional Secrets](#7-required-vs-optional-secrets)
8. [Migrated Variables](#8-migrated-variables)
9. [Secret Naming Rules](#9-secret-naming-rules)
10. [Common Errors and Fixes](#10-common-errors-and-fixes)
11. [Quick Reference](#11-quick-reference)

---

## 1. Background - Why Key Vault?

Before Key Vault, sensitive values like API URLs and environment settings lived in `.env` files on each developer's laptop. This caused problems:

- Files could be accidentally committed to GitHub
- Different developers had different values
- No audit trail of who accessed what

**Azure Key Vault** solves this by storing secrets in one secure place in the cloud. The app fetches them at runtime. No secrets in files, no secrets in code.

---

## 2. How to Log Into Azure

We do not log in with personal accounts. We log in as the **Service Principal** - the app's dedicated robot identity.

### Step 1 - Make sure Azure CLI is installed

```bash
az --version
```

If you see a version number, you're good. If not, install from:
https://aka.ms/installazurecliwindows

### Step 2 - Navigate to the project folder

```bash
cd C:\Users\YourName\Desktop\Free_Lancing\react-config-lab
```

### Step 3 - Log in as the Service Principal

```bash
az login --service-principal \
  --username 0fdbe924-73c9-4f30-95d2-206140eea111 \
  --password <CLIENT_SECRET> \
  --tenant 501c5854-0570-4876-8793-fa427b522557
```

> Replace `<CLIENT_SECRET>` with the value shared securely by Isaac.
> Never paste the secret into a public chat or commit it to GitHub.

### Step 4 - Confirm login worked

You should see:

```json
{
  "name": "Pay-As-You-Go",
  "state": "Enabled",
  "user": {
    "type": "servicePrincipal"
  }
}
```

---

## 3. How to Access the Key Vault

### Confirm you can see the vault

```bash
az keyvault show --name kv-hzb-c2-config
```

You should see the vault details including:

```text
"name": "kv-hzb-c2-config"
"location": "germanywestcentral"
"vaultUri": "https://kv-hzb-c2-config.vault.azure.net/"
```

### List all secrets currently in the vault

```bash
az keyvault secret list --vault-name kv-hzb-c2-config --output table
```

### View the value of a specific secret

```bash
az keyvault secret show --vault-name kv-hzb-c2-config --name "REACT-APP-ENV" --query value
```

---

## 4. How to Add Secrets

### Important naming rule

Azure Key Vault **does not allow underscores** in secret names.
Always use **hyphens** instead:

| Wrong | Correct |
|---|---|
| `REACT_APP_ENV` | `REACT-APP-ENV` |
| `API_BASE_URL` | `API-BASE-URL` |

### Add a secret via CLI

```bash
az keyvault secret set \
  --vault-name kv-hzb-c2-config \
  --name "SECRET-NAME" \
  --value "secret-value"
```

### Examples - all five app secrets

```bash
az keyvault secret set --vault-name kv-hzb-c2-config --name "REACT-APP-ENV" --value "development"
az keyvault secret set --vault-name kv-hzb-c2-config --name "REACT-APP-API-URL" --value "https://api.example.com"
az keyvault secret set --vault-name kv-hzb-c2-config --name "react-app-app-name" --value "React Config Lab"
az keyvault secret set --vault-name kv-hzb-c2-config --name "REACT-APP-LOG-LEVEL" --value "info"
az keyvault secret set --vault-name kv-hzb-c2-config --name "REACT-APP-ENABLE-ANALYTICS" --value "false"
```

> If you get a `Forbidden` error, you need write access.
> Contact Isaac and ask him to grant the Key Vault Secrets Officer role
> to the Service Principal `hzb-c2-kv-sp`.

---

## 5. How the App Reads Secrets

The app uses two files to connect to and read from Key Vault:

### `src/config/azureKeyVault.js`

This file handles the connection to Key Vault. It exports one function:

```javascript
getSecret(secretName)
```

Call it with a secret name and it returns the value:

```javascript
import { getSecret } from "./azureKeyVault.js";

const value = await getSecret("REACT-APP-ENV");
console.log(value); // "development"
```

Internally it uses `DefaultAzureCredential` which:
- On your laptop uses your `az login` session automatically
- In production uses `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID` environment variables automatically

### `src/config/index.js`

This is the **central config file** - the single source of truth for all configuration. It loads all five variables and exports one config promise that resolves before the app renders.

```javascript
import configPromise from "./config/index.js";

const config = await configPromise;
console.log(config.environment); // "development"
console.log(config.apiUrl); // "https://api.example.com"
```

Never read `process.env` directly in your components. Always use the resolved config from `src/config/index.js`.

---

## 6. How the Fallback Works

The app checks **two places** for each config value, in this order:

```text
1. Check .env.local (or .env.development) first
2. If not found, fetch from Azure Key Vault
3. If still not found, use the hardcoded default for optional variables
```

### What this means in practice

| Scenario | What happens |
|---|---|
| `.env.local` exists with values | App uses `.env.local` and Key Vault is skipped |
| `.env.local` missing or empty | App fetches from Key Vault automatically |
| Key Vault also unavailable | Optional vars use defaults, required vars throw an error |

### Testing the fallback

1. Start the app with local values present and confirm those values appear in the development config log.
2. Remove or rename `.env.local` and restart the app.
3. Confirm the console shows messages like `[Config] REACT_APP_ENV not in .env - fetching from Key Vault...`.
4. Restore `.env.local` after the test.

---

## 7. Required vs Optional Secrets

### Required - app cannot start without these

| Config Key | .env Name | Vault Secret |
|---|---|---|
| `environment` | `REACT_APP_ENV` | `REACT-APP-ENV` |
| `apiUrl` | `REACT_APP_API_URL` | `REACT-APP-API-URL` |

If either of these is missing from both `.env` and Key Vault, the app throws a detailed error message with both the `.env` name and the vault secret name.

### Optional - have safe defaults if missing

| Config Key | .env Name | Vault Secret | Default |
|---|---|---|---|
| `appName` | `REACT_APP_APP_NAME` | `react-app-app-name` | `"React Config Lab"` |
| `logLevel` | `REACT_APP_LOG_LEVEL` | `REACT-APP-LOG-LEVEL` | `"info"` |
| `analyticsEnabled` | `REACT_APP_ENABLE_ANALYTICS` | `REACT-APP-ENABLE-ANALYTICS` | `false` |

---

## 8. Migrated Variables

These variables were migrated away from direct `process.env` usage into the central config loader:

- `REACT_APP_ENV`
- `REACT_APP_API_URL`
- `REACT_APP_APP_NAME`
- `REACT_APP_LOG_LEVEL`
- `REACT_APP_ENABLE_ANALYTICS`

---

## 9. Secret Naming Rules

| Rule | Detail |
|---|---|
| No underscores | Use hyphens only - `REACT-APP-ENV` not `REACT_APP_ENV` |
| Case sensitive | `REACT-APP-ENV` and `react-app-env` are different secrets |
| Agree as a team | Pick one convention - all uppercase recommended |
| No spaces | Secret names cannot contain spaces |

---

## 10. Common Errors and Fixes

| Error | Cause | Fix |
|---|---|---|
| `az is not recognized` | Azure CLI not installed | Install from https://aka.ms/installazurecliwindows |
| `AADSTS700016` | Wrong tenant ID used | Use tenant `501c5854-0570-4876-8793-fa427b522557` |
| `No subscriptions found` | Logged in with personal account | Log in as Service Principal instead |
| `Vault not found in subscription` | Wrong subscription | Re-login as Service Principal |
| `ForbiddenByRbac` on read | Service Principal has no read access | Contact Isaac to grant read permissions |
| `ForbiddenByRbac` on write | Service Principal has no write access | Contact Isaac to grant write permissions |
| `Invalid name: APP_ENV` | Underscore in secret name | Use hyphens - `APP-ENV` |
| `ChainedTokenCredential failed` | Not logged in via `az login` | Run the Service Principal login command |
| `CONFIGURATION ERROR - APP CANNOT START` | Required secret missing | Add to `.env.local` or Key Vault |

---

## 11. Quick Reference

### Login command

```bash
az login --service-principal \
  --username 0fdbe924-73c9-4f30-95d2-206140eea111 \
  --password <CLIENT_SECRET> \
  --tenant 501c5854-0570-4876-8793-fa427b522557
```

### Vault details

```text
Vault name : kv-hzb-c2-config
Vault URL  : https://kv-hzb-c2-config.vault.azure.net/
Resource   : GAS-COHORT-2
Location   : germanywestcentral
```

### Useful commands

```bash
az keyvault secret list --vault-name kv-hzb-c2-config --output table
az keyvault secret show --vault-name kv-hzb-c2-config --name "SECRET-NAME" --query value
az keyvault secret set --vault-name kv-hzb-c2-config --name "SECRET-NAME" --value "value"
```

### Key files

```text
src/config/azureKeyVault.js - Key Vault connection and getSecret function
src/config/index.js - Central config loader used by the app
src/config/envValidator.js - Required/optional variable definitions and validation
docs/key-vault-guide.md - This file
```
