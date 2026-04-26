# Azure Key Vault Guide

## Purpose

This guide explains how to set up and use Azure Key Vault in this project.

It covers:
- How to log into Azure
- How to access Key Vault
- How to add secrets
- How the app reads secrets
- How fallback works

## Project Architecture

This project uses a server-side Key Vault pattern:

1. React app requests config from `http://localhost:5000/api/config`
2. `server.js` reads config from local env first
3. If values are missing, `server.js` reads missing values from Azure Key Vault
4. React central config loader in `src/config/index.js` applies/validates config

Key files:
- `server.js`
- `src/services/keyVault.js`
- `src/config/index.js`

## 1) Log Into Azure

Use one of these methods.

### Option A: Interactive login (developer machine)

```bash
az login
az account show
```

If you have multiple subscriptions:

```bash
az account list --output table
az account set --subscription "<subscription-id-or-name>"
```

### Option B: Service Principal login (automation/CI)

```bash
az login --service-principal \
  --username "<client-id>" \
  --password "<client-secret>" \
  --tenant "<tenant-id>"
```

## 2) Access Key Vault

Check that the vault exists and you can read it:

```bash
az keyvault show --name "kv-hzb-c2-config"
```

List current secrets:

```bash
az keyvault secret list --vault-name "kv-hzb-c2-config" --output table
```

## 3) Add/Update Secrets

This project expects these secret names:
- `react-app-api-url`
- `react-app-app-name`
- `react-app-log-level`

Set values:

```bash
az keyvault secret set --vault-name "kv-hzb-c2-config" --name "react-app-api-url" --value "http://localhost:3001/api"
az keyvault secret set --vault-name "kv-hzb-c2-config" --name "react-app-app-name" --value "React Config Lab"
az keyvault secret set --vault-name "kv-hzb-c2-config" --name "react-app-log-level" --value "debug"
```

Verify values exist:

```bash
az keyvault secret show --vault-name "kv-hzb-c2-config" --name "react-app-api-url" --query value -o tsv
```

## 4) How the App Reads Secrets

### Backend flow

`server.js` loads env files in this order:
1. `.env`
2. `.env.development`
3. `.env.local`
4. `env.local`

Then for each config value:
1. Use local env value if present (`REACT_APP_*`)
2. If missing, query Key Vault for matching secret
3. Apply final defaults where needed

Backend exposes resolved config at:
- `GET /api/config`

### Frontend flow

`src/services/keyVault.js` calls `GET /api/config`.

`src/config/index.js` is the central config entrypoint and:
- Loads central config once
- Uses env-first + Key Vault fallback result from backend
- Validates required values
- Exports one config object for all app consumers

## 5) Fallback Behavior

Resolution order for migrated values:

1. Local env value (`REACT_APP_*`)
2. Key Vault secret (only if local is missing)
3. Default value (where defined)

Current required vs optional:

Required:
- `REACT_APP_ENV`
- `REACT_APP_API_URL`

Optional:
- `REACT_APP_APP_NAME` (default: `React Config Lab`)
- `REACT_APP_LOG_LEVEL` (default: `info`)
- `REACT_APP_ENABLE_ANALYTICS` (default: `false`)

If required values are still missing after fallback, app startup is blocked with a clear configuration error.

## 6) Local Setup Example

Create either `.env.local` or `env.local`:

```env
REACT_APP_ENV=development
REACT_APP_CONFIG_API_URL=http://localhost:5000/api/config
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_APP_NAME=React Config Lab (Local)
REACT_APP_LOG_LEVEL=debug
REACT_APP_ENABLE_ANALYTICS=false

AZURE_TENANT_ID=<tenant-id>
AZURE_CLIENT_ID=<client-id>
AZURE_CLIENT_SECRET=<client-secret>
AZURE_KEYVAULT_URL=https://kv-hzb-c2-config.vault.azure.net/
```

Start app:

```bash
npm start
```

Check resolved config quickly:

```bash
# PowerShell
Invoke-WebRequest -UseBasicParsing http://localhost:5000/api/config | Select-Object -ExpandProperty Content
```

## 7) Troubleshooting

### Empty values in UI

- Verify `GET /api/config` returns JSON with non-empty fields
- Verify secret names are exactly:
  - `react-app-api-url`
  - `react-app-app-name`
  - `react-app-log-level`
- Verify Key Vault access permissions for your identity/service principal

### App blocked at startup with configuration error

- Set required values:
  - `REACT_APP_ENV`
  - `REACT_APP_API_URL` (or set Key Vault secret `react-app-api-url`)

### Cannot access Key Vault

- Confirm Azure login and subscription context
- Confirm vault name and URL
- Confirm role assignment includes secret read permissions
