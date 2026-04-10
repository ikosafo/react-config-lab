# Azure Key Vault Authentication Flow

**GAS Project — Configuration Team | Sprint 2, Task 1**

---

## 1. What is Azure Key Vault?

Azure Key Vault is a cloud-based secure storage service provided by Microsoft Azure. It stores sensitive values — such as API keys, passwords, connection strings, and configuration secrets — in a protected, audited environment.

Without Key Vault, sensitive values typically sit in `.env` files on individual developers' machines. This creates several risks:

- Files can be accidentally committed to GitHub
- Different developers may have different or outdated values
- There is no central audit trail of who accessed what and when

Key Vault solves these problems by centralising secrets in one secure location. The application fetches secrets at runtime rather than storing them in files.

> **Project Key Vault:** `kv-hzb-c2-config`  
> **Vault URL:** `https://kv-hzb-c2-config.vault.azure.net/`

---

## 2. What is a Service Principal?

A Service Principal is a non-human identity created specifically for an application or automated process to use when accessing Azure resources.

Think of it like a building security badge system. Every person gets a badge tied to their name and photo. But a robot or automated system that also needs access gets a separate machine badge — not a human one. That machine badge is the Service Principal.

### Why Use a Service Principal Instead of a Normal User?

| Normal User Account | Service Principal |
|---|---|
| Tied to a real person | Belongs to the app — not any individual |
| Person leaving = access disruption | App identity persists regardless of team changes |
| Often has broad permissions | Can be granted only the permissions it needs |
| Requires human login / MFA | Authenticates automatically — no human needed |

The core security principle at work here is called **least privilege** — an application should have access to only exactly what it needs, nothing more.

> **This project's Service Principal:** `hzb-c2-kv-sp`

---

## 3. The Three Required Credentials

For the application to authenticate with Azure using the Service Principal, it needs three pieces of information:

| Credential | What It Is | Analogy |
|---|---|---|
| **Tenant ID** | Identifies which Azure organisation your app belongs to | Like a country code before a phone number |
| **Client ID** | Unique identifier for your Service Principal | Like a username — identifies who is connecting |
| **Client Secret** | The credential that proves your app is who it claims | Like a password — must be kept secure at all times |

> The Client Secret is the most sensitive piece. If it is exposed, anyone can impersonate the application. It must **never** be stored in code or committed to a repository.

---

## 4. What is Azure Active Directory (Azure AD)?

Azure Active Directory is Microsoft's identity and access management system. It acts as the gatekeeper in front of all Azure services — nothing gets through without being verified by Azure AD first.

When the application presents its Service Principal credentials, Azure AD either:
- Issues a short-lived access token (if credentials are valid and permissions are confirmed), or
- Returns an authentication error (if credentials are wrong or permissions are missing)

The access token is temporary — it expires after a short period, after which the SDK automatically requests a new one. This is handled invisibly by the Azure SDK.

---

## 5. The Authentication Flow

The following describes what happens every time the application needs to retrieve a secret from Key Vault:

```
Step 1: Application starts up
        ↓
Step 2: App presents credentials to Azure Active Directory
        (Client ID + Client Secret + Tenant ID)
        ↓
Step 3: Azure AD verifies the credentials
        ↓
Step 4: Azure AD issues a short-lived access token
        ↓
Step 5: App requests a secret from Key Vault by name
        ↓
Step 6: Key Vault verifies the token and checks permissions
        ↓
Step 7: Key Vault returns the secret value
        ↓
Step 8: App uses the value ✅
```

### Visual Flow

```
App (presents: Client ID + Client Secret + Tenant ID)
  ↓
Azure Active Directory (verifies → issues access token)
  ↓
Azure Key Vault (checks token → returns secret value)
  ↓
App uses the value ✅
```

---

## 6. Key Security Principles

### Never store secrets in code or files
The Client Secret, API keys, and any other sensitive values must never appear in JavaScript files, README files, or documentation. If a secret is accidentally exposed, it must be rotated (reset) in the Azure Portal immediately.

### Use environment variables for the credentials themselves
The three credentials the app needs to connect to Key Vault are stored as environment variables — not in the Key Vault itself (that would be circular).

### Access is audited
Every time the application reads a secret from Key Vault, the event is logged in Azure. This means there is a full audit trail of when secrets were accessed, by which identity, and from where.

### Least privilege
The Service Principal `hzb-c2-kv-sp` should only have read access to the specific Key Vault secrets the application needs. It should not have permission to create, modify, or delete secrets unless explicitly required.

---

## 7. Glossary

| Term | Meaning |
|---|---|
| **Azure** | Microsoft's cloud computing platform |
| **Azure AD** | Microsoft's identity and access management system — the gatekeeper for all Azure services |
| **Azure Key Vault** | A cloud service for securely storing and retrieving secrets, keys, and certificates |
| **Service Principal** | A non-human identity used by applications to authenticate with Azure |
| **Client ID** | The unique identifier for a Service Principal (like a username) |
| **Client Secret** | The credential that proves a Service Principal's identity (like a password) |
| **Tenant ID** | The unique identifier for an Azure organisation or directory |
| **Access Token** | A short-lived credential issued by Azure AD after successful authentication |
| **Least Privilege** | Security principle: grant only the minimum permissions needed, nothing more |
| **Secret Rotation** | The process of replacing an exposed or expired secret with a new one |
