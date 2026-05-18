# Task 2 - Prepare Local Environment for Azure Access

## Goal

Make sure developers can authenticate to Azure from their local machines and confirm access to the `kv-hzb-c2-config` Key Vault.

## Current status

- Azure CLI is already installed on this machine.
- Detected version: `2.84.0`
- Live sign-in and vault access verification are still pending because `az login` was not approved from this session.

## Where to run the commands

Run all commands from:

- Windows Terminal
- PowerShell
- VS Code integrated terminal

The VS Code terminal is recommended so the commands run from the project folder.

## Recommended project-local Azure CLI setup

In this environment, Azure CLI could not write to the default profile folder at `C:\Users\Rachel\.azure`. To avoid that, use a project-local Azure config folder before running Azure commands:

```powershell
$env:AZURE_CONFIG_DIR = "$PWD\\.azure"
```

This keeps Azure CLI session files inside the project folder and avoids local permission issues.

## Login steps

1. Open a terminal in the project root.
2. Set the Azure config directory:

```powershell
$env:AZURE_CONFIG_DIR = "$PWD\\.azure"
```

3. Log in:

```powershell
az login
```

If browser-based login does not open correctly, use device code login instead:

```powershell
az login --use-device-code
```

If your Azure account has tenant access but no subscription, allow tenant-only login:

```powershell
az login --allow-no-subscriptions
```

## Verify login

After login succeeds, run:

```powershell
az account show
```

Expected result:

- Your Azure account details are returned as JSON
- No `Please run 'az login' to setup account.` error appears

## Confirm access to Key Vault

Check the vault metadata:

```powershell
az keyvault show --name kv-hzb-c2-config
```

Optional secret access check:

```powershell
az keyvault secret list --vault-name kv-hzb-c2-config --maxresults 5
```

Expected result:

- The vault information is returned successfully
- If secret listing is allowed, secret metadata is returned

## Common errors and fixes

### 1. Permission denied for `.azure` profile files

Example:

```text
Permission denied: 'C:\\Users\\Rachel\\.azure\\commandIndex.json'
```

Fix:

```powershell
$env:AZURE_CONFIG_DIR = "$PWD\\.azure"
```

Then rerun the Azure CLI command.

### 2. Not logged in

Example:

```text
Please run 'az login' to setup account.
```

Fix:

```powershell
az login
```

Or:

```powershell
az login --use-device-code
```

### 3. Browser sign-in does not open

Fix:

Use:

```powershell
az login --use-device-code
```

Then follow the code prompt in the browser.

### 4. No subscription found

Fix:

Run:

```powershell
az account list --output table
```

If needed, set the correct subscription:

```powershell
az account set --subscription "<subscription-name-or-id>"
```

If your account is expected to work without a subscription, use:

```powershell
az login --allow-no-subscriptions
```

This can still be enough for tenant-scoped operations if the account or app has been granted access to the Key Vault.

### 5. Service principal login fails with "Application with identifier ... was not found"

Cause:

- `az login --service-principal --username ...` expects the Application (client) ID
- A display name such as `hzb-c2-kv-sp` usually will not work unless it is also the real app ID
- The tenant ID must match the Entra ID tenant where the app registration exists

Fix:

Use the real client ID:

```powershell
az login --service-principal --tenant "<tenant-id>" --username "<client-id-guid>" --password "<client-secret>"
```

If the app still is not found, confirm with the project owner:

- The correct tenant ID
- The Application (client) ID
- That the service principal exists in that tenant
- That the service principal has access to `kv-hzb-c2-config`

### 6. Access denied to Key Vault

Possible causes:

- The signed-in account does not have Key Vault access
- The wrong Azure tenant or subscription is selected
- RBAC or access policies are not configured yet

Fix:

- Confirm the correct tenant and subscription with `az account show`
- Ask the project owner to grant access to `kv-hzb-c2-config`
- Retry `az keyvault show --name kv-hzb-c2-config`

## Verification checklist

- Azure CLI installed
- `AZURE_CONFIG_DIR` set when needed
- `az login` completed
- `az account show` returns account details
- `az keyvault show --name kv-hzb-c2-config` succeeds

## Notes for this workspace

- Azure CLI installation was confirmed locally with `az version`
- The default Azure CLI profile path caused a permission error
- A project-local `.azure/` folder is now ignored by git for safe local use
