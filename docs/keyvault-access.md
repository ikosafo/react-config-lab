# Accessing Azure Key Vault Secrets

How to read secret names and values from the `kv-hzb-c2-config` Key Vault using the Azure CLI.

## Prerequisites

- Azure CLI installed (`az --version` to verify)
- Logged in: `az login`
- The **Key Vault Secrets User** role (or higher) on the vault

## Vault name

```
kv-hzb-c2-config
```

Saving it as a shell variable saves typing:

```bash
VAULT=kv-hzb-c2-config
```

## List all secret names

```bash
az keyvault secret list --vault-name "$VAULT" --query "[].name" -o tsv
```

Returns one name per line, e.g.:

```
API-BASE-URL
REACT-APP-API-URL
REACT-APP-ENV
REACT-APP-LOG-LEVEL
SAMPLE-KEY
```

## Show one secret's value

```bash
az keyvault secret show --vault-name "$VAULT" --name REACT-APP-API-URL --query value -o tsv
```

Replace `REACT-APP-API-URL` with the name you want. The names are **case-sensitive** — copy them exactly from the list output.

## List all secrets with their values

```bash
VAULT=kv-hzb-c2-config
az keyvault secret list --vault-name "$VAULT" --query "[].name" -o tsv | \
while read -r name; do
  value=$(az keyvault secret show --vault-name "$VAULT" --name "$name" --query value -o tsv)
  echo "$name = $value"
done
```

Output:

```
REACT-APP-ENV = development
REACT-APP-API-URL = http://localhost:5000/api
...
```

## Important gotchas

### Names use dashes, not underscores

Azure Key Vault secret names may only contain letters, numbers, and dashes. Underscores are **not allowed**.

Example error from using an underscore:

```bash
$ az keyvault secret show --vault-name kv-hzb-c2-config --name REACT_APP_API_URL ...
(BadParameter) The request URI contains an invalid name: REACT_APP_API_URL
```

Fix: use dashes — `REACT-APP-API-URL`.

When the deploy pipeline reads keys from `src/config/keyvault-secrets.json` and uploads them to Key Vault, any underscores in the JSON keys must be converted to dashes (or the upload will fail with the same `BadParameter` error).

### Names are case-sensitive

`REACT-APP-API-URL` and `react-app-api-url` are treated as different secrets. Always copy the name from the `secret list` output.

### Don't paste secret values into shared screens or chats

The `secret show` and loop commands print values in plaintext. Run them locally; never share the output.

## Common errors

| Error | Cause | Fix |
|---|---|---|
| `(Forbidden)` | Your account lacks read permission on the vault | Ask the subscription owner to grant Key Vault Secrets User role |
| `(BadParameter) The request URI contains an invalid name` | Underscores or other illegal characters in the name | Use only letters, numbers, and dashes |
| `(SecretNotFound)` | The name doesn't exist (often a typo or case mismatch) | Copy the exact name from `secret list` output |
| `Please run 'az login' to setup account` | Not logged in | Run `az login` |

## Other useful commands

Delete a secret (irreversible — be sure first):

```bash
az keyvault secret delete --vault-name "$VAULT" --name TEST
```

Show metadata (version, expiration, etc.) without the value:

```bash
az keyvault secret show --vault-name "$VAULT" --name REACT-APP-API-URL
```

List secret versions (Key Vault keeps every previous value):

```bash
az keyvault secret list-versions --vault-name "$VAULT" --name REACT-APP-API-URL
```
