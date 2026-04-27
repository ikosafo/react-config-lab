## Azure Key Authentication Flow 

## TASK ONE (1)
# (A) Research on how a service principal and Azure access servises 
A service principal is a security identity used by applications, services, or automation tools to access specific Azure resources. It allows you to grant permissions to an application without using a user account, providing a more secure and scalable way to manage access to Azure services.

# (B)  required credentials
To access Azure services using a service principal, you typically need the following credentials:
1. **Client ID**: This is a unique identifier for the service principal. It is used to identify the application or service that is trying to access Azure resources.
2. **Tenant ID**: This is the identifier for the Azure Active Directory (AAD) tenant where the service principal is registered. It helps to specify the directory context for authentication.
3. **Client Secret**: This is a secret key associated with the service principal. It is used for authentication purposes, allowing the application or service to prove its identity when requesting access to Azure resources.

# (C)  simple explanation

# what is a service principal?
A service principal is an identity created for use with applications, hosted services, and automated tools to access Azure resources. It allows you to grant specific permissions to an application without needing to use a user account, providing a secure way to manage access to Azure services.

# Why use service principals instead of normal user 
Using a service principal instead of a normal user account provides several advantages: 
1. **Security**: Service principals can be granted only the permissions they need, reducing the risk of unauthorized access. User accounts often have broader permissions, which can lead to security vulnerabilities if compromised.
2. **Automation**: Service principals are ideal for automated processes and applications that need to access Azure resources without human intervention. User accounts are not suitable for this purpose as they require interactive login.
3. **Scalability**: Service principals can be easily created and managed for multiple applications and services, allowing for better organization and control over access to Azure resources. User accounts can become cumbersome to manage as the number of applications and services increases.


# (D) Authentication Flow 
The authentication flow for accessing Azure services using a service principal typically follows these steps:
1. The application or service sends a request to Microsoft Entra (formally Azure Active Directory (AAD)) with the service principal's Client ID, Tenant ID, and Client Secret.
2. Microsoft Entra validates the credentials and, if successful, issues an access token.
3. The application or service uses the access token to authenticate with the desired Azure service (e.g., Azure Key Vault).
4. The Azure service validates the access token and grants access to the requested resources if the token is valid and has the necessary permissions.

# Flow Diagram 
App -----> Microsoft Entra (formally Azure Active Directory (ADD)) -----> Key Vault 

- App: holds Services Principal credentail
- Microsoft Entra (formally Azure Active Directory (AAD)): validates credentials and issues access token
- Key Vault: validates access token and grants access to secrets if the token is valid and has necessary permissions.


# Draw a simple flow showing: (App - Azure Active Directory - Key Vault)

https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&dark=auto#R%3Cmxfile%3E%3Cdiagram%20name%3D%22Page-1%22%20id%3D%22qTT9dXHfm9gQT6IH5JRi%22%3E7Vhbb9owGP01PBLlQm6P4dZV3TRU2k7bCzKJSdw6ceaYAv31s2MbkpJNrKXVpI6HYB9%2F8eWc830J9JxRvr2goMy%2BkATinm0m254z7tm2F1r8KoCdBPxgIIGUokRC1gGYoyeoQFOha5TAqhXICMEMlW0wJkUBY9bCAKVk0w5bEdxetQQpPALmMcDH6DeUsEyigWse8E8QpZle2TLVSA50sAKqDCRk04CcSc8ZUUKYbOXbEcSCO82LvG%2F6m9H9xigs2Ck3zIeXS7LEc%2B%2FpfjNesnt0cZv1O2ZRUMV2mgO%2B81I0UV6TNcxYjnnX4s1HSBnibEUYpQXHGCkb6GewhHhGKsQQEaNLwhjJeQAWA0MQP6SUrItkRDCh9VrOqv7wkHqxqCqlqCZHgO6s0BYmOoT3M8aEGyJxdnuKuBUqI0EgpSCvjAIyBfZjEGeQH286q2MWcxIjgPu2Gfoc9II%2BKMuKEQr7oTMwqsdUMvEI8FoxoQB%2BPLhtsKUIv4Akh4zueEjW9IQ2y%2BZgoD2mphmorsoS29cWVvZN91MfFOYNJfJfCG6fInhD4L1rhQIJqDLBvJRDSR7ziSDt8EKOkkTMONT%2BybepqBGGzEtbfotpxalNw%2FNFWxBii%2FkLwuJMrXUeIewOHay2Dvu6o4RwtDBnF8I5RQidcUfWbyhUElSwenfusOeOu5RZkYKp0mrZjcRBObf4FKMlv4KnNYXiTLzeFgwxfsJpJLBFFDP0CBdjRPkeCN3VmXEuTSwrMALvWBenrYvjPkuQwDJM%2F42kcf9VaSoYr6mU5gruFndgjVl1XjmcsEOLsKWF57xXsfL%2BF6s%2FFSvXfK9i5Z8iBD8da%2Ft%2FkyEG5yWIRcSG0yn4ZZQ8QP3EL0ghSF8hjJ9BpytWv0Lsle5g38NMZVprw97PNdED%2FarOQf4KYVphua3n0ePitVEe4YBx0WiKQDPIS8V3NJvpBTnTck058iIXdKRj2DaB3%2FbAwH6rZAw%2BkgeCV3ngx%2B31hN8RjW4u70RjfHk9Gd18vf7OI0AuGCiWVSnvOJ9VOgqG47afogPfcNt2sd6qZIQfyS6vKhlXE%2B4L8y66%2FXzzvqXDcwfP7fCC6sG7hx%2Bx9VjjnwBn8gs%3D%3C%2Fdiagram%3E%3C%2Fmxfile%3E

```plaintext
App
  |
Azure Active Directory (AAD)
   |
Key Vault
```
In this flow, the application (App) authenticates with Azure Active Directory (AAD) using a service principal. Once authenticated, the application can access the Key Vault to retrieve secrets, keys, or certificates as needed.
 The AAD acts as the authentication and authorization layer, ensuring that only authorized applications can access the Key Vault.


## Preparing Local Environment for Azure Access 

# Install Azure CLI (if not already installed)
- **Where to run** : System terminal or VS Code Integration terminal (Powershell or Command Prompt on Windows)  
- **Command** : winget install -e- --id Microsoft.AzureCLI (recommended for windows).
- for mac OS 'brew install azure-cli'
- **verify installation** : run "az version" in terminal 
 
## Where Commands Are Run

All Azure CLI commands are run in:

- VS Code Terminal

OR

- System Terminal
 
---
 
## Login Command
 
az login
 
---
 
## Verify Login
 
az account show
 
---
 
## Verify Key Vault Access
 
az keyvault show --name kv-hzb-c2-config
 
---
 
## Common Errors
 
1.- **Error**: "az: command not found"
   **Cause** Azure CLI is not installed.
    **Solution**: Install Azure CLI using the appropriate method for your operating system (e.g., winget for Windows, Homebrew for macOS) and ensure it is added to your system's PATH.

    **Error**: Login ,fails or browser doesn't opens 
    **Cause**: This can occur due to various reasons, such as network issues, browser configuration problems, or issues with the Azure CLI installation.    
    **Solution**:Ensure there is internet connection and try `az login --use-device-code`

2. **Error**: "You do not have authorization"
   **Cause** Access policy not configured in Key Vault.
    **Solution**: Ensure that the service principal or user account has the necessary permissions to access the Key Vault. This can be done by configuring the access policies in the Azure portal or using Azure CLI.
 
3. **Error** Key Vault not found 
   **Cause** wrong name, subscription or key vault doesnt exist 
    **Solution**: Verify that the Key Vault name is correct and that you are in the correct Azure subscription. You can switch subscriptions using the command `az account set --subscription "<subscription-name>"`.

### Key notes
- All commands should be run in a terminal with Azure CLI installed
- VS Code intergrated terminal is recommended for consistency with development environment. 
- Ensure you have the correct permissions and access policies set up in Azure Key Vault for successful authentication and access.   
