# Azure SDK Notes

**GAS Project — Configuration Team | Sprint 2, Task 3**

---

## 1. Overview

To enable the application to communicate with Azure Key Vault, two packages from the official Azure SDK for JavaScript were installed:

```bash
npm install @azure/identity @azure/keyvault-secrets
```

Each package has a distinct responsibility. They work together but are kept separate so that the authentication layer can be swapped out independently of the vault communication layer if needed.

---

## 2. @azure/identity

> **Purpose:** Authentication — proving the app's identity to Azure Active Directory  
> **Key export used:** `DefaultAzureCredential`

### What It Does

This package handles the authentication layer — the part where the application proves its identity to Azure AD before it can access any Azure resource including Key Vault.

It provides a credential object that the rest of the SDK uses automatically. You do not manually manage tokens or authentication handshakes — the package handles all of that invisibly.

### DefaultAzureCredential — The Smart Credential

The most important export is `DefaultAzureCredential`. It does not lock you into one authentication method — instead it tries a chain of methods automatically, in order, until one succeeds:

| # | Method | How It Works | Best For |
|---|---|---|---|
| 1 | Environment variables | Looks for `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID` | Production / CI-CD |
| 2 | Workload Identity | For apps running inside Azure (AKS etc.) | Cloud-hosted apps |
| 3 | Managed Identity | For apps running on Azure VMs or App Services | Azure-hosted services |
| 4 | Azure CLI | Uses your active `az login` session | **Local development ✅** |
| 5 | VS Code | Uses Azure extension login in VS Code | Local development |
| 6 | PowerShell | Uses Az module login | Windows environments |

This chain means the exact same code works both on a developer's laptop (using `az login`) and in production (using environment variables) — without any code changes.

> **In this project:**  
> Local development → `DefaultAzureCredential` uses the `az login` session  
> Production → `DefaultAzureCredential` uses `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID`

### How It Is Used In This Project

```javascript
const { DefaultAzureCredential } = require('@azure/identity');

// Creates a credential object — tries az login first in local dev
const credential = new DefaultAzureCredential();
```

This credential object is then passed to the `SecretClient`. It does not fetch a token immediately — it fetches one lazily, only when an actual request to Azure is made.

---

## 3. @azure/keyvault-secrets

> **Purpose:** Communication — connecting to Key Vault and retrieving secret values  
> **Key export used:** `SecretClient`

### What It Does

Once the application has a valid credential, this package handles the actual communication with the Key Vault service. It provides a client that can connect to a specific vault and perform operations on secrets stored there.

In this project, the primary operation is reading secrets by name. Creating, updating, and deleting secrets is done by administrators through the Azure Portal or CLI.

### SecretClient

The key export is `SecretClient`. It takes two arguments — the vault URL and a credential object:

```javascript
const { SecretClient } = require('@azure/keyvault-secrets');

const secretClient = new SecretClient(
  'https://kv-hzb-c2-config.vault.azure.net/',
  credential
);

// Fetch a secret by name
const secret = await secretClient.getSecret('APP-ENV');
console.log(secret.value); // the actual secret value
```

### The getSecret Method

The primary method used is `getSecret(secretName)`. It is asynchronous and returns a promise. The returned object contains several properties:

| Property | Description |
|---|---|
| `secret.name` | The name of the secret as stored in Key Vault |
| `secret.value` | The actual secret value — this is what the app uses |
| `secret.properties.version` | The version identifier of this secret |
| `secret.properties.enabled` | Whether this secret version is active |
| `secret.properties.expiresOn` | Expiry date if one was set |

---

## 4. How The Two Packages Work Together

```javascript
// Step 1: @azure/identity — prove who we are
const { DefaultAzureCredential } = require('@azure/identity');
const credential = new DefaultAzureCredential();

// Step 2: @azure/keyvault-secrets — connect to the vault
const { SecretClient } = require('@azure/keyvault-secrets');
const client = new SecretClient(
  'https://kv-hzb-c2-config.vault.azure.net/',
  credential
);

// Step 3: fetch a secret
const secret = await client.getSecret('APP-ENV');
console.log(secret.value); // "development"
```

The relationship is straightforward:
- `@azure/identity` produces a credential
- `@azure/keyvault-secrets` consumes it

Neither package does the other's job, and both are required for the full flow to work.

---

## 5. Important Note — Secret Naming Rules

Azure Key Vault **does not allow underscores** in secret names. Only letters, numbers, and hyphens are permitted.

| Wrong ❌ | Correct ✅ |
|---|---|
| `APP_ENV` | `APP-ENV` |
| `API_BASE_URL` | `API-BASE-URL` |
| `REACT_APP_API_URL` | `REACT-APP-API-URL` |

Using underscores will result in: `The request URI contains an invalid name`

---

## 6. Confirming Installation

After running `npm install`, both packages appear in `package.json`:

```json
"dependencies": {
  "@azure/identity": "^4.x.x",
  "@azure/keyvault-secrets": "^4.x.x",
  ...
}
```

The `^` prefix means npm will automatically install patch and minor updates but not breaking major version changes.
