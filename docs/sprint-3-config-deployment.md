# Sprint 3 - Automation of Configuration Deployment

**Project:** React Config Lab  
**Sprint Goal:** Automate configuration deployment to Azure Key Vault using GitHub Actions.

---

## Overview

Sprint 3 focused on moving configuration deployment from a manual Azure CLI process into an automated CI/CD workflow.

The workflow now validates JSON configuration files, uses dummy configuration during pull requests, and deploys real configuration values to Azure Key Vault only when code is pushed to approved branches.

Target Key Vault:

```text
kv-hzb-c2-config
```

Main workflow file:

```text
.github/workflows/deploy-config.yml
```

---

## Task 1 - GitHub Actions Workflow for Config Deployment

A GitHub Actions workflow was created to automate configuration deployment.

Workflow path:

```text
.github/workflows/deploy-config.yml
```

The workflow runs on:

- Push to `main`
- Push to `develop`
- Push to `rachel-branch`
- Pull request into `main`
- Pull request into `develop`
- Pull request into `rachel-branch`

The workflow includes steps to:

- Check out the repository
- Install `jq`
- Print debug information
- Authenticate to Azure using a Service Principal
- Validate JSON configuration
- Upload secrets to Azure Key Vault
- Verify deployed secrets

Azure credentials are stored securely in GitHub Actions secrets:

```text
AZURE_CLIENT_ID
AZURE_CLIENT_SECRET
AZURE_TENANT_ID
```

The Azure login step uses these secrets during push deployments.

---

## Task 2 - Debug and Stabilize the Workflow

The workflow was improved with clear logs and safer execution.

Debug logs show:

```text
Branch: <branch-name>
Event: <event-name>
```

The workflow also uses:

```bash
set -euo pipefail
```

This helps the workflow fail early when:

- A command fails
- A required variable is missing
- A pipeline command fails

The Azure login step also checks for missing GitHub secrets and prints a clear error if one is not configured.

Pull request runs do not deploy secrets. Azure login, deployment, and Key Vault verification only run on `push` events.

---

## Task 3 - Pipeline Validation Using Dummy Configuration

A dummy configuration file was added for safe pull request testing:

```text
config/test-secrets.json
```

It contains the required dummy values:

```json
{
  "API_BASE_URL": "https://test-api.example.com",
  "APP_ENV": "test",
  "SAMPLE_KEY": "dummy"
}
```

The workflow chooses the config file based on the event type:

- Pull request: `config/test-secrets.json`
- Push: `config/secrets.json`

This means pull requests can validate the pipeline without deploying real configuration values.

---

## Task 4 - JSON Configuration Validation

The workflow validates both JSON syntax and required keys.

Configuration files:

```text
config/secrets.json
config/test-secrets.json
```

Syntax validation is done with:

```bash
jq . "$CONFIG_FILE"
```

Required-key validation is done with:

```bash
jq -e '.API_BASE_URL and .APP_ENV and .SAMPLE_KEY' "$CONFIG_FILE" > /dev/null
```

The workflow fails if:

- The JSON file is invalid
- `API_BASE_URL` is missing
- `APP_ENV` is missing
- `SAMPLE_KEY` is missing

---

## Task 5 - Pull Request and Full Pipeline Simulation

The expected pipeline behavior is:

1. Create a feature branch:

```bash
git checkout -b feature/config-test
```

2. Make a small config change.

3. Push the branch:

```bash
git push -u origin feature/config-test
```

4. Create a pull request into `main`, `develop`, or `rachel-branch`.

5. Confirm the workflow runs in GitHub Actions.

For pull requests, the workflow should show:

```text
Event: pull_request
Validating test config: config/test-secrets.json
JSON syntax and required keys are valid.
```

After the pull request is merged, a push workflow runs again and deploys the real configuration from:

```text
config/secrets.json
```

---

## Task 6 - Verify and Manage Secrets Using Azure CLI

A helper script was added for Azure CLI verification:

```text
scripts/verify-keyvault-secrets.ps1
```

Run it from the project root:

```powershell
.\scripts\verify-keyvault-secrets.ps1
```

The script performs these checks:

- Lists all secrets in the vault
- Shows one selected secret
- Lists versions for that secret
- Optionally retrieves a specific version

Default vault:

```text
kv-hzb-c2-config
```

Default secret:

```text
API-BASE-URL
```

Example verification output confirmed that the vault contains:

```text
API-BASE-URL
APP-ENV
SAMPLE-KEY
REACT-APP-API-URL
REACT-APP-ENV
REACT-APP-LOG-LEVEL
REACT-APP-ENABLE-ANALYTICS
react-app-app-name
```

The `API-BASE-URL` secret value was confirmed as:

```text
http://localhost:3000/api
```

Multiple versions were listed for `API-BASE-URL`, confirming that Azure Key Vault versioning is active.

---

## Important Naming Note

Azure Key Vault secret names do not allow underscores.

The workflow keeps JSON keys readable, then converts underscores to hyphens during upload.

Examples:

```text
API_BASE_URL -> API-BASE-URL
APP_ENV -> APP-ENV
SAMPLE_KEY -> SAMPLE-KEY
```

This allows the JSON files to satisfy the Sprint 3 naming requirement while still uploading valid Azure Key Vault secret names.

---

## Final Result

Sprint 3 is implemented with:

- Automated GitHub Actions workflow
- Push-based deployment to Azure Key Vault
- Pull request validation using dummy config
- JSON syntax validation
- Required-key validation
- Clear debug logs
- Safe PR behavior with no secret deployment
- Azure CLI verification script

The workflow is ready to validate configuration changes in pull requests and deploy real configuration values after merge or push to the approved branches.
