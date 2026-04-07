### Installing azure SDk 

#  Installed packages 
- @azure/identity
- @azure/keyvault-secrets

the packages were installed with 
``
npm install @azure/identity @azure/keyvault-secrets
``
After installing the packages the ``Package.json`` filw was updated with the dependancies:
``@azure/identity``: ^4.13.1"
``@azure/keyvault-secret`` : "^4.10.0",

This can be seen on line 7 & 8 on our `` {}package.json`` file 


#  what @ azure/identity does 
The `@azure/identity` package provides a set of credential classes that can be used to authenticate and acquire access tokens for Azure services. It simplifies the process of authenticating applications and services with Azure Active Directory (AAD) by offering various authentication methods, such as service principals, managed identities, and interactive login (Azure CLI login).

- handles lonin to azure 
- support Services Principal authentication 
- support Azure CLI-based authtication for local development 


# what does @ azure/keyvault-secrets does
The `@azure/keyvault-secrets` package is a client library for interacting with Azure Key Vault's secrets management capabilities. It allows you to securely store and manage sensitive information such as API keys, passwords, certificates, and other secrets in Azure Key Vault. The package provides methods to create, retrieve, update, and delete secrets, as well as to list all secrets in a vault. It also integrates with Microsodt Entra (formally Azure Active Directory) for authentication and access control.

- retrieves secrets from vault 
- stores secrets in key vault
- manage secrets version 

This library is designed to work with Azure Identity credentials, so authenticatio and secret access can be handled securely with Microsoft Entra ID (formally Azure Active Directory)

## Usage context 
In our project, we use `@azure/identity` to authenticate our application with Azure Active Directory (AAD) using a service principal. This allows us to securely obtain access tokens that can be used to interact with Azure services.
We then use `@azure/keyvault-secrets` to access Azure Key Vault, where we store sensitive information such as API keys and connection strings. By using these two packages together, we can ensure that our application can securely authenticate with Azure and manage secrets without exposing sensitive information in our codebase or configuration files.

# How they work togethers 
@ azure/identity authenticates the application 
An access token is obtained 
@azure/keyvault-secrets  uses the token to communicate with Key Vault
Secrets are retrieved securely  

## List of secrets created 
- API_BASE_URL
- APP_ENV
- SAMPLE KEY 

