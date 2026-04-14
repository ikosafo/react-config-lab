# Task 1 - Azure Key Vault Authentication Flow

## Goal

The goal of this task is to understand how the application can securely access Azure Key Vault and retrieve secrets without hard-coding sensitive values in the source code.

In this project, Azure Key Vault access is handled using a Service Principal. The application uses the Service Principal credentials to authenticate with Microsoft Entra ID, formerly known as Azure Active Directory. After authentication, the application receives a token that allows it to request secrets from Azure Key Vault.

## What Is A Service Principal?

A Service Principal is an identity created for an application, automation script, or service in Microsoft Entra ID. It works like an application account rather than a human user account.

For this project, the Service Principal is:

```text
hzb-c2-kv-sp
```

The Service Principal allows the project code to authenticate to Azure and access the Key Vault named:

```text
kv-hzb-c2-config
```

## Why Use A Service Principal Instead Of A Normal User?

A normal user account belongs to a person. That makes it a poor choice for application authentication because it can be affected by password changes, multi-factor authentication requirements, account lockouts, role changes, or the user leaving the organization.

A Service Principal is better for application access because:

- It is designed for apps and automation.
- It can be granted only the permissions needed for one resource.
- It does not depend on a personal user account.
- Its credentials can be rotated without changing a human user's account.
- Access can be audited and controlled in Azure.

## Required Credentials

The application needs these values to authenticate with Azure:

| Credential | Purpose |
|---|---|
| Tenant ID | Identifies the Microsoft Entra tenant where the app registration exists. |
| Client ID | Identifies the registered application or Service Principal. |
| Client Secret | Proves the application is allowed to authenticate as the Service Principal. |

In this project, the non-secret identifiers are:

```text
Tenant ID: 501c5854-0570-4876-8793-fa427b522557
Client ID: 0fdbe924-73c9-4f30-95d2-206140eea111
```

The Client Secret value must not be committed to Git or written in documentation. It should stay in a local `.env` file or another secure secret store.

## Authentication Flow

The application does not send the Client Secret directly to Key Vault as a password for Key Vault. Instead, it uses the Client ID, Client Secret, and Tenant ID to authenticate with Microsoft Entra ID.

After Microsoft Entra ID verifies the Service Principal, it returns an access token. The application then sends that token to Azure Key Vault when requesting a secret.

## Simple Flow

```text
App -> Microsoft Entra ID -> Azure Key Vault
```

## Detailed Flow

```text
1. App reads AZURE_TENANT_ID, AZURE_CLIENT_ID, and AZURE_CLIENT_SECRET.
2. App creates a ClientSecretCredential object.
3. ClientSecretCredential authenticates with Microsoft Entra ID.
4. Microsoft Entra ID returns an access token.
5. App creates a SecretClient for the Key Vault URL.
6. App calls SecretClient.getSecret(secretName).
7. Azure Key Vault checks the token and permissions.
8. Azure Key Vault returns the requested secret value.
```

## Project Files

The Key Vault connection module is:

```text
src/config/azureKeyVault.js
```

The test script is:

```text
scripts/testAzureKeyVault.js
```

The Key Vault URL used by the project is:

```text
https://kv-hzb-c2-config.vault.azure.net/
```
