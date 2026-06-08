# Azure SDK Notes

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

The library is designed to work with Azure Identity credentials, so authentication and secret access can be handled securely with Azure AD.

## Usage context

Together, these libraries let the project authenticate to Azure and access secrets stored in Azure Key Vault, enabling secure configuration management and secret retrieval.

## listing all secretes in the key vault run 
`az.cmd keyvault secret list --vault-name "name" --output table` 

##TASK 5
# Match REACT_APP_ENV
az.cmd keyvault secret set --vault-name "name" --name "react-app-env" --value "value"

# Match REACT_APP_API_URL
az.cmd keyvault secret set --vault-name "name" --name "react-app-api-url" --value "value"

# Match REACT_APP_APP_NAME
az.cmd keyvault secret set --vault-name "name" --name "react-app-app-name" --value "value"

# replace "name" and "value with the name of your keyvault and value of the secrete respectively