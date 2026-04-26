# Task 6 + Task 7 + Task 8 + Task 9 - Key Vault, Fallback, Central Config, and Validation Guide

## Overview

Task 6 uses a secure server-side pattern for configuration, Task 7 adds env-first fallback behavior, and Task 8 centralizes all config loading in one module.

1. The React app starts a local config request to `http://localhost:5000/api/config`
2. `server.js` reads Azure Key Vault using a Service Principal from `.env.local`
3. `src/config/index.js` loads the returned config and logs where each value came from

## Required Secrets Validation (Task 9)

Sprint 1 classification:

Required variables:

- `REACT_APP_ENV`
- `REACT_APP_API_URL`

Optional variables:

- `REACT_APP_APP_NAME` (default: `React Config Lab`)
- `REACT_APP_LOG_LEVEL` (default: `info`)
- `REACT_APP_ENABLE_ANALYTICS` (default: `false`)

Enforcement behavior:

1. Validation runs inside [src/config/index.js](../src/config/index.js) after fallback resolution.
2. If required values are missing, app bootstrap throws a validation error.
3. Startup is blocked and [src/index.js](../src/index.js) renders a configuration error screen instead of the app.

Helpful error message examples:

- `REACT_APP_ENV`: Environment identifier is required and must be explicitly set.
- `REACT_APP_API_URL`: API base URL is required. Set `REACT_APP_API_URL` locally or Key Vault secret `react-app-api-url`.

## Centralized Config (Task 8)

All runtime configuration is now managed in one place:

- [src/config/index.js](../src/config/index.js)

What it does:

1. Initializes config from local env values
2. Loads remote config from the backend proxy
3. Applies fallback/override logic for missing values
4. Exports a single config object and loader (`loadConfig`)

Compatibility note:

- [src/config/appConfig.js](../src/config/appConfig.js) is a shim that re-exports from `src/config/index.js` for older imports.

## Fallback Behavior (Task 7)

Resolution order is now:

1. Read local env values from `.env.development` and `.env.local` (or `env.local` if present)
2. If a value is missing, fetch that value from Azure Key Vault
3. If still unavailable, use hardcoded defaults (`""` for API/app name and `"info"` for log level)

Value precedence for each migrated variable:

1. `REACT_APP_*` local env value (first priority)
2. Key Vault secret value (only when local env value is missing)
3. Default value in code

Fallback outcome matrix:

| Scenario | API URL | App Name | Log Level |
|---|---|---|---|
| `.env.local` present with values | from local env | from local env | from local env |
| `.env.local` missing, `.env.development` present | from `.env.development` | from `.env.development` | from `.env.development` |
| Local env value missing, Key Vault reachable | from Key Vault | from Key Vault | from Key Vault |
| Local env missing and Key Vault unavailable | empty string | empty string | `info` |

This behavior is implemented in:

- [server.js](../server.js) for backend config resolution
- [src/config/index.js](../src/config/index.js) for frontend central config resolution and source logging

## Migrated Values

Three configuration values are sourced from Azure Key Vault:

- `REACT_APP_API_URL` → `react-app-api-url`
- `REACT_APP_APP_NAME` → `react-app-app-name`
- `REACT_APP_LOG_LEVEL` → `react-app-log-level`

## Files Involved

- [server.js](../server.js) - backend Key Vault proxy
- [src/services/keyVault.js](../src/services/keyVault.js) - browser client for the config API
- [src/config/index.js](../src/config/index.js) - centralized config loader and exported config object
- [src/config/appConfig.js](../src/config/appConfig.js) - compatibility shim for old imports
- [.env.local](../.env.local) - local server credentials and fallback app values

## Local Setup

### 1. Ensure `.env.local` exists

It must contain the backend Azure credentials and the local config API URL.

Required keys:

```bash
REACT_APP_ENV=development
AZURE_TENANT_ID=...
AZURE_CLIENT_ID=...
AZURE_CLIENT_SECRET=...
AZURE_KEYVAULT_URL=https://kv-hzb-c2-config.vault.azure.net/
REACT_APP_CONFIG_API_URL=http://localhost:5000/api/config
```

### 2. Ensure the Key Vault secrets exist

```bash
az keyvault secret set --vault-name "kv-hzb-c2-config" --name "react-app-api-url" --value "http://localhost:3001/api"
az keyvault secret set --vault-name "kv-hzb-c2-config" --name "react-app-app-name" --value "React Config Lab"
az keyvault secret set --vault-name "kv-hzb-c2-config" --name "react-app-log-level" --value "debug"
```

### 3. Start the app

```bash
npm start
```

This starts:
- the Key Vault proxy on `http://localhost:5000`
- the React app on `http://localhost:3000`

## What Success Looks Like

You should see both of these in the console:

```text
Key Vault proxy server running on http://localhost:5000
✅ TASK 6: Configuration Loaded - Value Sources
```

The configuration log should show the three migrated variables and mark them as coming from Azure Key Vault when the proxy is working.

## Scenario Tests

### Scenario A: `.env.local` present

Status: verified.

Observed config response:

```json
{"apiUrl":"http://localhost:3001/api","appName":"React Config Lab (Dev)","logLevel":"debug","analyticsEnabled":false}
```

### Scenario B: `.env.local` absent

Status: ready to verify with this command sequence:

```powershell
Rename-Item .env.local .env.local.bak
npm start
# verify app loads and /api/config still returns JSON
Rename-Item .env.local.bak .env.local
```

Expected result:

- App still starts
- Values fall back to `.env.development` first
- Missing values are then attempted from Key Vault
- If Key Vault is unavailable, app continues with defaults

## Verification Checklist

- `server.js` starts on port 5000
- `/api/config` returns JSON
- `src/config/index.js` is the single config entrypoint
- Required config validation blocks startup when critical values are missing
- The React app loads without errors
- The console shows the central config summary
- The three migrated values appear in the dashboard
- The app falls back to local env values if the backend proxy is unavailable

## Troubleshooting

### App does not start

Check that:
- `.env.local` exists
- the Azure values are present in `.env.local`
- `server.js` can authenticate with the Service Principal

### Config values do not load

Check that:
- the Key Vault secrets use hyphenated names
- the Service Principal has access to `kv-hzb-c2-config`
- `http://localhost:5000/api/config` returns JSON

### Console only shows fallback values

That means the proxy could not reach Key Vault or could not authenticate. The app should still run with local fallback values.

If values are empty while `.env.local` is missing, verify `.env.development` contains `REACT_APP_API_URL`, `REACT_APP_APP_NAME`, and `REACT_APP_LOG_LEVEL`.

## Summary

Task 6 is complete and documented in this file as the single source of truth for setup and verification.
