# Azure CLI Setup

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

1. "az: command not found"
   → Azure CLI is not installed.

2. "You do not have authorization"
   → Access policy not configured in Key Vault.

3. Wrong subscription selected
   → Run:
     az account set --subscription "<subscription-name>"
