# Azure Key Vault Authentication Flow
# task 1
## a. Service Principal and Azure access

A Service Principal is an identity created for use with applications, hosted services, and automated tools to access Azure resources. It represents an application or service, not a human user.

When an app needs to access Azure resources, it uses a Service Principal to authenticate and receive permissions. This allows apps to sign in with their own credentials and access only the resources they are authorized for.

## b. Required credentials

To authenticate a Service Principal with Azure Active Directory, the application typically needs:

- **Client ID**: The unique application ID for the Service Principal.
- **Client Secret**: A password or secret value used to prove the app's identity.
- **Tenant ID**: The ID for the Azure Active Directory tenant where the Service Principal is registered.

## c. Simple explanation

### What is a Service Principal?

A Service Principal is an Azure AD identity for an application or service. It allows the application to authenticate and request access to Azure resources securely.

### Why use a Service Principal instead of a normal user?

- A Service Principal is intended for apps and automated workflows, not human users.
- It follows the principle of least privilege: the app gets only the permissions it needs.
- It avoids storing or using a real user account password.
- It can be managed independently of any user's lifecycle, which improves security and scalability.

## d. Authentication flow

1. App uses Service Principal credentials (Client ID, Client Secret, Tenant ID).
2. App authenticates with Azure Active Directory.
3. Azure AD returns a token.
4. App uses the token to request secrets from Azure Key Vault.


### Flow diagram

App → Microsoft Entra ID → Key Vault

- App: holds Service Principal credentials.
- Microsoft Entra ID: validates crentials and issues an access token.
- Key Vault: accepts the token and returns secrets if access is permitted.

 NOTE: Azure AD is now called Microsoft Entra ID


## Task 2 – Prepare local environment for Azure access

### Goal
Make sure developers can authenticate to Azure from their local machines.

### Steps

#### a. Install Azure CLI (if not already installed)
- **Where to run**: System terminal or VS Code integrated terminal (PowerShell or Command Prompt on Windows).
- **Command**: `winget install -e --id Microsoft.AzureCLI` (recommended for Windows).
- for mac os `brew install azure-cli` 
- **Alternative**: Download MSI from https://aka.ms/installazurecliwindowsx64 and run installer.
- **Verify installation**: Run `az version` in terminal.

#### b. Run az login
- **Where to run**: VS Code integrated terminal or system terminal.
- **Command**: az.cmd login --service-principal \
  --username "PASTE_CLIENT_ID_HERE" \
  --password "PASTE_SECRET_VALUE_HERE" \
  --tenant "PASTE_TENANT_ID_HERE"
`
- **What it does**: This automatically logs you into your Azure account

#### c. Verify login was successful
- **Command**: `az account show`
- **Expected output**: JSON with subscription details, user info, etc.
- **Where to run**: Same terminal as login.

#### d. Confirm access to the Key Vault: kv-hzb-c2-config
- **Command**: az keyvault show --name "YOUR_KEY_VAULT_NAME"
- **Expected output**: JSON with Key Vault details if access granted.
- **Where to run**: Same terminal.

### Common errors and fixes

- **Error**: `'az' is not recognized as an internal or external command`
  - **Cause**: Azure CLI not installed or PATH not updated.
  - **Fix**: Install Azure CLI using WinGet or MSI. Restart terminal. If still fails, run `$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")` in PowerShell to refresh PATH.

- **Error**: `az login` fails with exit code 127
  - **Cause**: Command not found (CLI not installed).
  - **Fix**: Install Azure CLI first.

- **Error**: Login fails or browser doesn't open
  - **Cause**: Network issues, browser problems, or account issues.
  - **Fix**: Ensure internet connection. Try `az login --use-device-code` for device code flow if browser login fails.

- **Error**: `az account show` shows no subscription or wrong one
  - **Cause**: Logged in with wrong account or no default subscription.
  - **Fix**: Run `az account list` to see available subscriptions, then `az account set --subscription <subscription-id>` to set default.

- **Error**: Access denied to Key Vault
  - **Cause**: User lacks permissions on the Key Vault.
  - **Fix**: Ensure user has Key Vault Reader or Contributor role. Check with Azure admin to grant access via Access Policies in Key Vault.

- **Error**: Key Vault not found
  - **Cause**: Wrong name, wrong subscription, or Key Vault doesn't exist.
  - **Fix**: Verify Key Vault name and subscription. Run `az keyvault list` to see available Key Vaults.

### Notes
- All commands should be run in a terminal with Azure CLI installed.
- VS Code integrated terminal is recommended for consistency with development environment.
- Ensure you have appropriate Azure permissions before attempting access.