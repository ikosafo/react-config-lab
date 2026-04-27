# Sprint 3 - Automation of Configuration Deployment

## Goal

Automate deployment of configuration values to Azure Key Vault whenever code is pushed to deployment branches.

## What Was Implemented

This sprint adds a GitHub Actions workflow that:

1. Validates the JSON configuration file on every push and pull request.
2. Deploys secrets to Azure Key Vault on push events.
3. Uses Service Principal authentication from GitHub Secrets.

## Files Used

- Workflow: `/.github/workflows/deploy-config.yml`
- Config source JSON: `/src/config/keyvault-secrets.json`

## Workflow Triggers

The workflow runs when:

- Code is pushed to `Florence-branch` or `develop`
- A pull request targets `Florence-branch` or `develop`

Behavior by event:

- `pull_request`: runs validation only
- `push`: runs validation, then deploys secrets to Key Vault

## Required GitHub Secrets

Add these in GitHub Repository Settings:

1. `AZURE_CLIENT_ID`
2. `AZURE_CLIENT_SECRET`
3. `AZURE_TENANT_ID`
4. `AZURE_KEYVAULT_NAME` (optional if defaulting to `kv-hzb-c2-config`)
5. `AZURE_SUBSCRIPTION_ID` (optional)

Path:

`Settings -> Secrets and variables -> Actions`

## Deployment Logic

### 1) Validation Job (`validate-config`)

- Checks out repository
- Installs `jq`
- Confirms the JSON file exists
- Confirms JSON is valid and has object shape (`{ "key": "value" }`)

### 2) Deployment Job (`deploy-to-keyvault`)

- Runs only on `push`
- Waits for validation job to pass
- Logs into Azure using Service Principal
- Optionally sets Azure subscription
- Reads each key from JSON
- Creates or updates each secret in Key Vault
- Skips keys whose value is `null`

If `AZURE_KEYVAULT_NAME` is not set, the workflow defaults to:

`kv-hzb-c2-config`

## Expected Secret Names

Current JSON is expected to include:

- `react-app-api-url`
- `react-app-app-name`
- `react-app-log-level`

## How To Verify Success

### GitHub Actions

1. Open Actions tab in GitHub
2. Open workflow run `Deploy Config To Azure Key Vault`
3. Confirm status is `Success`
4. Confirm both jobs passed:
   - `Validate Config JSON`
   - `Deploy Secrets To Azure Key Vault` (push only)

### Azure Key Vault

Run:

```powershell
$vault='kv-hzb-c2-config'
$names=@('react-app-api-url','react-app-app-name','react-app-log-level')
foreach($n in $names){
  $v = az keyvault secret show --vault-name $vault --name $n --query value -o tsv
  if($LASTEXITCODE -ne 0){
    Write-Host "MISSING: $n"
  } else {
    Write-Host ("FOUND: {0}={1}" -f $n,$v)
  }
}
```

Expected output: all three secrets show as `FOUND`.

## Troubleshooting

### Deploy job fails immediately

- Check `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, and `AZURE_TENANT_ID` values.
- Confirm Service Principal has Key Vault secret set permissions.

### Validation fails

- Confirm `/src/config/keyvault-secrets.json` exists.
- Confirm file contains valid JSON object syntax.

### Secrets not updating

- Confirm target vault name is correct.
- Confirm keys in JSON match expected secret names.

## Outcome

Configuration deployment is automated and repeatable through GitHub Actions, reducing manual secret update steps and improving release consistency.