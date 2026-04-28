# Azure Key Vault Authentication Flow

## 1. What is a Service Principal?

A Service Principal is a special identity created in Azure Active Directory (Azure AD) 
that allows applications to securely authenticate and access Azure services.

It is NOT a human user.
It represents an application.

---

## 2. Why Do We Use a Service Principal Instead of a Normal User?

We use a Service Principal because:

- Applications should not depend on a human login
- It is more secure
- It allows controlled permissions
- It works in production environments
- It prevents password sharing

If we used a normal user account:
- The app would break if the password changes
- It would be less secure
- It would violate best practices

---

## 3. Required Credentials

To authenticate using a Service Principal, we need:

- Client ID
- Client Secret
- Tenant ID

These are generated when the Service Principal is created.

---

## 4. Authentication Flow

App → Azure Active Directory → Key Vault

Step 1:
The application sends its Client ID, Client Secret, and Tenant ID to Azure AD.

Step 2:
Azure AD verifies the credentials.

Step 3:
Azure AD returns an access token.

Step 4:
The app uses that access token to request secrets from Azure Key Vault.

Step 5:
Key Vault validates the token and returns the secret.

