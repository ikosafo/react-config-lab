# Sprint 3 Testing Guide - Config Deployment

This guide explains how to test each Sprint 3 task in simple terms.

The main idea of this sprint is:

- Pull requests should only check the config safely.
- Pushes to approved branches should upload the real config to Azure Key Vault.
- Broken JSON should stop the pipeline before anything is deployed.

Target Key Vault:

```text
kv-hzb-c2-config
```

Main workflow:

```text
.github/workflows/deploy-config.yml
```

Real config file:

```text
config/secrets.json
```

Dummy test config file:

```text
config/test-secrets.json
```

## Current Codebase Check

The Sprint 3 files are present.

| Item | Status | Where to check |
| --- | --- | --- |
| GitHub Actions workflow exists | Done | `.github/workflows/deploy-config.yml` |
| Push trigger exists | Done | `push` branches: `rachel-branch`, `main`, `develop` |
| Pull request trigger exists | Done | `pull_request` branches: `rachel-branch`, `main`, `develop` |
| Repository checkout step exists | Done | `Checkout repository` step |
| `jq` install step exists | Done | `Install jq` step |
| Azure Service Principal login exists | Done | `Login to Azure` step |
| PR runs skip Azure login and deployment | Done | Azure/deploy steps use `if: github.event_name == 'push'` |
| Real config exists | Done | `config/secrets.json` |
| Dummy config exists | Done | `config/test-secrets.json` |
| JSON validation exists | Done | `Validate JSON config` step |
| Required key validation exists | Done | Checks `API_BASE_URL`, `APP_ENV`, `SAMPLE_KEY` |
| Key Vault upload exists | Done | `az keyvault secret set` |
| Key Vault verification exists | Done | `az keyvault secret list` |
| Local Azure verification script exists | Done | `scripts/verify-keyvault-secrets.ps1` |

Important note: GitHub Actions and Azure Key Vault cannot be fully proven from local files alone. The final proof is a real workflow run in GitHub and a real secret check in Azure.

## Before You Test

### 1. Add GitHub Actions Secrets

Go to:

```text
GitHub repository > Settings > Secrets and variables > Actions > New repository secret
```

Add these three secrets:

```text
AZURE_CLIENT_ID
AZURE_CLIENT_SECRET
AZURE_TENANT_ID
```

Why this matters:

The workflow needs these values to log in to Azure. They should not be written directly inside code because they are private credentials.

### 2. Confirm the Service Principal Has Key Vault Permission

The Azure Service Principal must be allowed to set and list secrets in:

```text
kv-hzb-c2-config
```

Why this matters:

Even if login works, deployment will fail if the Service Principal does not have permission to write secrets.

### 3. Confirm Azure CLI Works Locally

Run:

```powershell
az login
az keyvault secret list --vault-name kv-hzb-c2-config --output table
```

Expected result:

You should see a table of secrets, or an empty table if no secrets exist yet.

If this fails:

- You may not be logged in.
- You may be in the wrong Azure tenant.
- Your account may not have access to the Key Vault.

## Task 1 - Test GitHub Actions Config Deployment

### What This Task Proves

This proves that GitHub can automatically deploy configuration to Azure Key Vault after code is pushed.

### What to Check in the Code

Open:

```text
.github/workflows/deploy-config.yml
```

Confirm it has:

- `on: push`
- branches `main`, `develop`, and your working branch, currently `rachel-branch`
- `actions/checkout@v4`
- `sudo apt-get install -y jq`
- `az login --service-principal`
- `az keyvault secret set`

### How to Test

Make a small safe change, for example update a comment in a documentation file.

Then run:

```powershell
git add .
git commit -m "test config deployment workflow"
git push origin rachel-branch
```

If you are testing `main` or `develop`, push to that branch instead.

### What Success Looks Like

In GitHub:

```text
Actions > Deploy Config to Azure Key Vault > latest run
```

The workflow should show green check marks.

The logs should show:

```text
Checkout repository
Install jq
Print debug info
Login to Azure
Validate JSON config
Deploy secrets to Key Vault
Verify secrets in Key Vault
```

In Azure:

Run:

```powershell
az keyvault secret list --vault-name kv-hzb-c2-config --output table
```

You should see secrets such as:

```text
API-BASE-URL
APP-ENV
SAMPLE-KEY
```

The JSON keys use underscores, but Azure Key Vault secret names use hyphens. For example:

```text
API_BASE_URL becomes API-BASE-URL
```

## Task 2 - Test Debugging and Stability

### What This Task Proves

This proves that the workflow gives useful logs and fails clearly when something is wrong.

### How to Test the Normal Case

Push a small change:

```powershell
git add .
git commit -m "test workflow logs"
git push origin rachel-branch
```

Open the GitHub Actions run.

### What Success Looks Like

The `Print debug info` step should show:

```text
Branch: rachel-branch
Event: push
```

The validation step should show:

```text
Validating real config: config/secrets.json
JSON syntax and required keys are valid.
```

The deployment step should show each secret being uploaded.

### How to Test Safe PR Behavior

Create a pull request from a feature branch into `rachel-branch`, `main`, or `develop`.

In the PR workflow logs, confirm:

```text
Event: pull_request
Validating test config: config/test-secrets.json
```

Also confirm these steps are skipped:

```text
Login to Azure
Deploy secrets to Key Vault
Verify secrets in Key Vault
```

Why this matters:

Pull requests are for checking code before merge. They should not deploy real secrets.

### Common Failures and Meaning

| Error | Meaning | Fix |
| --- | --- | --- |
| Missing GitHub secret: `AZURE_CLIENT_ID` | GitHub secret is not configured | Add it in repository Actions secrets |
| Azure login failed | Credentials are wrong or expired | Recreate/check the Service Principal secret |
| Key Vault not found | Vault name is wrong | Confirm `kv-hzb-c2-config` exists |
| Forbidden or permission denied | Service Principal lacks access | Grant Key Vault secret permissions |
| `jq: command not found` | `jq` did not install | Check the `Install jq` step |

## Task 3 - Test Dummy Configuration on Pull Requests

### What This Task Proves

This proves that pull requests use fake values instead of real values.

### How to Test

Create a branch:

```powershell
git checkout -b feature/config-test
```

Make a small change to:

```text
config/test-secrets.json
```

For example, change:

```json
"SAMPLE_KEY": "dummy"
```

to:

```json
"SAMPLE_KEY": "dummy-pr-test"
```

Commit and push:

```powershell
git add config/test-secrets.json
git commit -m "test pull request dummy config"
git push -u origin feature/config-test
```

Create a pull request into `rachel-branch`, `main`, or `develop`.

### What Success Looks Like

The PR workflow should run.

The logs should say:

```text
Validating test config: config/test-secrets.json
```

The workflow should not upload anything to Key Vault.

Why this matters:

You can safely test the pipeline without touching real secrets.

## Task 4 - Test JSON Configuration Validation

### What This Task Proves

This proves that broken config files are caught before deployment.

The workflow checks two things:

- The file must be valid JSON.
- Required keys must exist: `API_BASE_URL`, `APP_ENV`, `SAMPLE_KEY`.

### Local Quick Test

From the project root, run:

```powershell
node -e "JSON.parse(require('fs').readFileSync('config/secrets.json','utf8')); JSON.parse(require('fs').readFileSync('config/test-secrets.json','utf8')); console.log('Both JSON files are valid')"
```

Expected result:

```text
Both JSON files are valid
```

This only checks JSON syntax locally. GitHub Actions also checks required keys using `jq`.

### Test Invalid JSON

On a test branch only, temporarily break `config/test-secrets.json`.

Example:

```json
{
  "API_BASE_URL": "https://test-api.example.com",
  "APP_ENV": "test",
  "SAMPLE_KEY": "dummy",
}
```

The trailing comma after `"dummy"` makes the JSON invalid.

Commit and push the branch, then open a PR.

Expected result:

The workflow fails in:

```text
Validate JSON config
```

Why this matters:

Invalid JSON should fail before it can be deployed.

After the test, fix the JSON before merging.

### Test Missing Required Key

On a test branch only, remove one required key from `config/test-secrets.json`.

For example, remove:

```json
"SAMPLE_KEY": "dummy"
```

Commit, push, and open/update the PR.

Expected result:

The workflow fails during required-key validation.

After the test, put the key back before merging.

## Task 5 - Test Pull Request to Full Deployment Flow

### What This Task Proves

This proves the full path:

```text
feature branch -> pull request validation -> merge -> push deployment
```

### How to Test

Create a branch:

```powershell
git checkout -b feature/config-test
```

Make a small safe change:

```powershell
git add config/test-secrets.json
git commit -m "test config pipeline"
git push -u origin feature/config-test
```

Create a pull request into:

```text
rachel-branch
```

or:

```text
main
develop
```

### What Success Looks Like Before Merge

The PR workflow should:

- Run automatically.
- Validate `config/test-secrets.json`.
- Skip Azure login.
- Skip Key Vault deployment.

### What Success Looks Like After Merge

After the PR is merged, GitHub creates a push event on the target branch.

The push workflow should:

- Validate `config/secrets.json`.
- Log in to Azure.
- Deploy secrets to `kv-hzb-c2-config`.
- List secrets from the vault.

Then verify locally:

```powershell
az keyvault secret list --vault-name kv-hzb-c2-config --output table
```

## Task 6 - Test Azure CLI Secret Verification

### What This Task Proves

This proves that secrets really exist in Azure Key Vault and can be managed outside the Azure Portal.

### List All Secrets

```powershell
az keyvault secret list --vault-name kv-hzb-c2-config --output table
```

Expected result:

You should see secret names such as:

```text
API-BASE-URL
APP-ENV
SAMPLE-KEY
```

### View One Secret

Use the Azure-safe name with hyphens:

```powershell
az keyvault secret show --name API-BASE-URL --vault-name kv-hzb-c2-config --query value
```

Expected result:

It should match the value from:

```text
config/secrets.json
```

### Check Secret Versions

```powershell
az keyvault secret list-versions --name API-BASE-URL --vault-name kv-hzb-c2-config --output table
```

Expected result:

You should see one or more versions.

Why this matters:

Every time `az keyvault secret set` updates a secret, Azure Key Vault creates a new version.

### Retrieve a Specific Version

Copy a version id from the version list, then run:

```powershell
az keyvault secret show --name API-BASE-URL --version <version-id> --vault-name kv-hzb-c2-config --query value
```

Expected result:

Azure returns the value stored for that exact version.

### Use the Helper Script

From the project root:

```powershell
.\scripts\verify-keyvault-secrets.ps1
```

To check a different secret:

```powershell
.\scripts\verify-keyvault-secrets.ps1 -SecretName APP-ENV
```

To check a specific version:

```powershell
.\scripts\verify-keyvault-secrets.ps1 -SecretName API-BASE-URL -Version <version-id>
```

## Final Sprint 3 Acceptance Checklist

Use this as your final sign-off list.

| Check | Pass condition |
| --- | --- |
| Workflow exists | `.github/workflows/deploy-config.yml` is in the repo |
| Push trigger works | Pushing to `rachel-branch`, `main`, or `develop` starts the workflow |
| PR trigger works | Opening a PR into `rachel-branch`, `main`, or `develop` starts validation |
| PR uses dummy config | PR log says `config/test-secrets.json` |
| PR does not deploy | Azure login and deployment steps are skipped in PR runs |
| Push uses real config | Push log says `config/secrets.json` |
| JSON validation works | Bad JSON makes the workflow fail |
| Required key validation works | Missing `API_BASE_URL`, `APP_ENV`, or `SAMPLE_KEY` makes the workflow fail |
| Azure login works | Push run logs in using the Service Principal |
| Secrets deploy | Push run uploads secrets to `kv-hzb-c2-config` |
| Azure CLI verification works | `az keyvault secret list` shows the uploaded secrets |
| Versioning works | `az keyvault secret list-versions` shows versions for updated secrets |

## Local Checks Already Run

These checks were run locally:

```text
Both JSON files are valid
```

React test result:

```text
Test Suites: 1 passed, 1 total
Tests: 1 passed, 1 total
```

The remaining checks must be completed in GitHub Actions and Azure because they depend on real repository secrets, real workflow events, and real Key Vault access.
