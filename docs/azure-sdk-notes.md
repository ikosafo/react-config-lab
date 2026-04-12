# Azure SDK Notes
## Task 3

## Installed packages

- `@azure/identity`
- `@azure/keyvault-secrets`

These packages were installed with:

```bash
npm install @azure/identity @azure/keyvault-secrets
```

## What `@azure/identity` does

`@azure/identity` provides authentication support for Azure SDK clients. It supplies a collection of credential classes to acquire access tokens from Azure Active Directory, including:

- `DefaultAzureCredential` for local development and deployed apps using environment variables, managed identity, Visual Studio credentials, or Azure CLI credentials.
- `ClientSecretCredential` for service principal authentication.
- `ManagedIdentityCredential` for Azure resources with managed identities.
- `InteractiveBrowserCredential` and other credentials for user sign-in.

In this project, `@azure/identity` will be used to authenticate the React app or backend code against Azure Key Vault securely.

## What `@azure/keyvault-secrets` does

`@azure/keyvault-secrets` provides a client library for working with Azure Key Vault secrets. It enables applications to:

- retrieve secrets from Key Vault
- store and update secrets
- delete secrets
- list secret properties and versions

The library is designed to work with Azure Identity credentials, so authentication and secret access can be handled securely with  Microsoft Entra ID formerly known as Azure AD.

## Usage context

Together, these libraries let the project authenticate to Azure and access secrets stored in Azure Key Vault, enabling secure configuration management and secret retrieval.

 ### commands

 - for secret names `az keyvault secret list --vault-name "kv-hzb-c2-config" --output table`

## List of Secrets Created


Name                Id                                                                   ContentType    Enabled    Expires
------------------  -------------------------------------------------------------------  -------------  ---------  ---------
api-base-url        https://kv-hzb-c2-config.vault.azure.net/secrets/api-base-url                       True
app-env             https://kv-hzb-c2-config.vault.azure.net/secrets/app-env                            True
react-app-api-url   https://kv-hzb-c2-config.vault.azure.net/secrets/react-app-api-url                  True
react-app-app-name  https://kv-hzb-c2-config.vault.azure.net/secrets/react-app-app-name                 True
react-app-env       https://kv-hzb-c2-config.vault.azure.net/secrets/react-app-env                      True
sample-key          https://kv-hzb-c2-config.vault.azure.net/secrets/sample-key                         True
