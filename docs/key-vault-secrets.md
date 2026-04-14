# Task 5 - Initial Key Vault Secrets

## Goal

The goal of this task is to move important configuration values into Azure Key Vault.

The Key Vault used for this project is:

```text
kv-hzb-c2-config
```

## Secrets Created

The following secrets were created and tested:

| Secret name | Purpose | Test result |
|---|---|---|
| `api-base-url` | Stores the API base URL used by the app. | Successfully fetched from Key Vault. |
| `app-env` | Stores the current application environment. | Successfully fetched from Key Vault. |
| `sample-key` | Test secret used to confirm Key Vault access. | Successfully fetched from Key Vault. |

## Verified Output

The secrets were tested using:

```powershell
node scripts\testAzureKeyVault.js
```

The successful terminal output was:

```text
Secret "api-base-url" value: http://localhost:4000
Secret "app-env" value: staging
Secret "sample-key" value: hello-from-keyvault
```

## Naming Notes

The original task examples used names like:

```text
API_BASE_URL
APP_ENV
SAMPLE_KEY
```

Azure Key Vault secret names commonly use hyphens instead of underscores, so this project uses:

```text
api-base-url
app-env
sample-key
```

Recommended mapping:

| Local config meaning | Key Vault secret name |
|---|---|
| API base URL | `api-base-url` |
| App environment | `app-env` |
| Sample test secret | `sample-key` |

## Security Notes

Do not document real Service Principal secret values in Markdown files.

Do not commit `.env` files to Git.

If a Client Secret value is accidentally pasted into chat, documentation, or a repository, rotate it in Azure Portal by creating a new client secret and disabling the old one.

## Azure Portal Steps Used

To create the secrets manually:

```text
1. Open the Azure Portal.
2. Go to Key Vaults.
3. Open kv-hzb-c2-config.
4. Go to Secrets.
5. Select Generate/Import.
6. Add each secret name and value.
7. Save each secret.
8. Test the secrets with scripts/testAzureKeyVault.js.
```
