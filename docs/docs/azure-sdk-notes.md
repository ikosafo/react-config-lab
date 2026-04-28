# Azure SDK Notes

## @azure/identity

This package is responsible for authentication.

It allows the application to:
- Authenticate using Service Principal
- Authenticate using Azure CLI login
- Generate access tokens

It provides credential classes like:
- DefaultAzureCredential
- ClientSecretCredential

---

## @azure/keyvault-secrets

This package allows the app to:
- Connect to Azure Key Vault
- Retrieve secrets
- Set secrets
- Delete secrets

It provides:
- SecretClient class
