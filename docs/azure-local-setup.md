# Task 2 - Local Azure Environment Setup

## Goal

The goal of this task is to make sure developers can authenticate to Azure from their local machine and confirm that they can access the Key Vault used by the project.

The Key Vault for this project is:

```text
kv-hzb-c2-config
```

## Where To Run Commands

Run the commands from a terminal. Recommended options are:

```text
VS Code terminal
PowerShell
Command Prompt
Git Bash
```

The project path used during development is:

```text
C:\Users\azame\Desktop\react-config-lab
```

## Step 1 - Install Azure CLI

Install Azure CLI if it is not already installed.

After installation, confirm it works:

```powershell
az --version
```

If the command is not found, close and reopen the terminal. If it still fails, confirm Azure CLI was installed and added to the system PATH.

## Step 2 - Log In To Azure

Run:

```powershell
az login
```

This opens a browser login page. Sign in with the Azure account that has access to the Key Vault.

## Step 3 - Verify Login

Run:

```powershell
az account show
```

This should show the current subscription, tenant, and signed-in account.

## Step 4 - Confirm Key Vault Access

Run:

```powershell
az keyvault show --name kv-hzb-c2-config
```

If access is configured correctly, Azure CLI returns information about the Key Vault.

To list secret names:

```powershell
az keyvault secret list --vault-name kv-hzb-c2-config --query "[].name"
```

To show one test secret:

```powershell
az keyvault secret show --vault-name kv-hzb-c2-config --name api-base-url
```

Do not paste real secret values into documentation or commit them to Git.

## Common Errors

### az is not recognized

Cause:

```text
Azure CLI is not installed or the terminal was opened before the PATH was updated.
```

Fix:

```text
Install Azure CLI, then restart the terminal.
```

### Please run az login

Cause:

```text
Azure CLI is not authenticated.
```

Fix:

```powershell
az login
```

### Subscription or tenant is wrong

Cause:

```text
The Azure account is signed in, but the active subscription is not the one containing the Key Vault.
```

Fix:

```powershell
az account list --output table
az account set --subscription "<subscription-id-or-name>"
```

### Forbidden or access denied

Cause:

```text
The signed-in user or Service Principal does not have permission to read the Key Vault or its secrets.
```

Fix:

```text
Ask an Azure administrator to grant the correct Key Vault permissions.
```

### Invalid client secret

Cause:

```text
The value in AZURE_CLIENT_SECRET is not the actual client secret value, or the secret expired.
```

Fix:

```text
Create a new client secret in Microsoft Entra ID App registrations and copy the Value, not the Secret ID.
```

## Local Environment Variables

The local `.env` file should contain:

```env
AZURE_TENANT_ID=<tenant-id>
AZURE_CLIENT_ID=<client-id>
AZURE_CLIENT_SECRET=<client-secret-value>
```

Do not commit `.env` to Git.
