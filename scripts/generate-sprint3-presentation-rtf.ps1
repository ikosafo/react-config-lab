param(
  [string]$OutputPath = "docs/Sprint-3-Config-Deployment-Presentation.rtf"
)

$ErrorActionPreference = "Stop"

function Escape-Rtf {
  param([string]$Text)
  if ($null -eq $Text) {
    return ""
  }
  return ($Text -replace '\\', '\\' -replace '\{', '\{' -replace '\}', '\}')
}

function Add-Line {
  param(
    [System.Text.StringBuilder]$Builder,
    [string]$Text = "",
    [string]$Prefix = "",
    [string]$Suffix = "\par"
  )
  [void]$Builder.AppendLine("$Prefix$(Escape-Rtf $Text)$Suffix")
}

function Add-Title {
  param([System.Text.StringBuilder]$Builder, [string]$Text)
  Add-Line $Builder $Text "\pard\qc\b\fs36\cf1 " "\b0\cf0\fs22\par"
}

function Add-Subtitle {
  param([System.Text.StringBuilder]$Builder, [string]$Text)
  Add-Line $Builder $Text "\pard\qc\fs24\cf2 " "\cf0\fs22\par"
}

function Add-Heading1 {
  param([System.Text.StringBuilder]$Builder, [string]$Text)
  [void]$Builder.AppendLine("\pard\pagebb\sa120")
  Add-Line $Builder $Text "\pard\b\fs28\cf1 " "\b0\cf0\fs22\par"
}

function Add-Heading2 {
  param([System.Text.StringBuilder]$Builder, [string]$Text)
  Add-Line $Builder $Text "\pard\sb140\b\fs24\cf3 " "\b0\cf0\fs22\par"
}

function Add-Body {
  param([System.Text.StringBuilder]$Builder, [string]$Text)
  Add-Line $Builder $Text "\pard\sa100\fs22 " "\par"
}

function Add-Bullet {
  param([System.Text.StringBuilder]$Builder, [string]$Text)
  Add-Line $Builder "- $Text" "\pard\li360\sa80\fs22 " "\par"
}

function Add-Code {
  param([System.Text.StringBuilder]$Builder, [string]$Text)
  Add-Line $Builder $Text "\pard\li360\sa80\f1\fs19\cf4 " "\f0\cf0\fs22\par"
}

function Add-Table {
  param(
    [System.Text.StringBuilder]$Builder,
    [string[]]$Headers,
    [object[]]$Rows
  )

  $cellWidth = 3000
  [void]$Builder.AppendLine("\pard\sa100")
  [void]$Builder.Append("\trowd\trgaph108")
  for ($i = 1; $i -le $Headers.Count; $i++) {
    [void]$Builder.Append("\cellx$($cellWidth * $i)")
  }
  [void]$Builder.AppendLine()
  foreach ($header in $Headers) {
    [void]$Builder.Append("\intbl\b\cf1 $(Escape-Rtf $header)\b0\cf0\cell ")
  }
  [void]$Builder.AppendLine("\row")

  foreach ($row in $Rows) {
    [void]$Builder.Append("\trowd\trgaph108")
    for ($i = 1; $i -le $Headers.Count; $i++) {
      [void]$Builder.Append("\cellx$($cellWidth * $i)")
    }
    [void]$Builder.AppendLine()
    foreach ($cell in $row) {
      [void]$Builder.Append("\intbl $(Escape-Rtf ([string]$cell))\cell ")
    }
    [void]$Builder.AppendLine("\row")
  }
  [void]$Builder.AppendLine("\pard\sa160\par")
}

$rtf = [System.Text.StringBuilder]::new()
[void]$rtf.AppendLine("{\rtf1\ansi\deff0")
[void]$rtf.AppendLine("{\fonttbl{\f0 Aptos;}{\f1 Consolas;}}")
[void]$rtf.AppendLine("{\colortbl;\red31\green78\blue121;\red71\green85\blue105;\red51\green65\blue85;\red31\green41\blue55;}")
[void]$rtf.AppendLine("\paperw12240\paperh15840\margl900\margr900\margt900\margb900")

Add-Title $rtf "Sprint 3: Automation of Configuration Deployment"
Add-Subtitle $rtf "Presentation and Testing Evidence Document"
Add-Subtitle $rtf "Project: React Config Lab"
Add-Subtitle $rtf "Target Azure Key Vault: kv-hzb-c2-config"
Add-Body $rtf ""

Add-Heading1 $rtf "Purpose"
Add-Body $rtf "This document explains how Sprint 3 was implemented and how each task can be tested. It is written for presentation use, so each section states the goal, the simple reason behind it, the test steps, and the expected result."

Add-Heading1 $rtf "Executive Summary"
Add-Bullet $rtf "A GitHub Actions workflow deploys configuration to Azure Key Vault on approved push events."
Add-Bullet $rtf "Pull requests run validation only and do not deploy secrets."
Add-Bullet $rtf "Dummy configuration is used for safe pull request testing."
Add-Bullet $rtf "JSON validation prevents invalid or incomplete configuration from being deployed."
Add-Bullet $rtf "Azure CLI commands and a helper script verify stored secrets and versions."

Add-Heading1 $rtf "Implementation Evidence"
$evidenceRows = @(
  @("Workflow file", "Done", ".github/workflows/deploy-config.yml"),
  @("Push branches", "Done", "rachel-branch, main, develop"),
  @("Pull request validation", "Done", "pull_request trigger configured"),
  @("Checkout repository", "Done", "actions/checkout@v4"),
  @("Install jq", "Done", "sudo apt-get install -y jq"),
  @("Azure login", "Done", "az login --service-principal"),
  @("PR safety", "Done", "Azure login and deploy run only on push"),
  @("Real config", "Done", "config/secrets.json"),
  @("Dummy config", "Done", "config/test-secrets.json"),
  @("JSON validation", "Done", "jq syntax and required-key checks"),
  @("Key Vault upload", "Done", "az keyvault secret set"),
  @("Verification", "Done", "az keyvault secret list and helper script")
)
Add-Table $rtf @("Area", "Status", "Evidence") $evidenceRows

$tasks = @(
  @{
    Title = "Task 1: GitHub Actions Workflow for Config Deployment"
    Goal = "Automatically upload configuration values to Azure Key Vault when code is pushed to an approved branch."
    Rationale = "Instead of manually copying secrets into Azure, the workflow does it the same way every time. This reduces mistakes and makes deployment repeatable."
    Tests = @("git add .", "git commit -m `"test config deployment workflow`"", "git push origin rachel-branch")
    Expected = @("GitHub Actions starts the workflow automatically.", "The run includes checkout, jq install, Azure login, JSON validation, deployment, and verification steps.", "Azure Key Vault contains secrets such as API-BASE-URL, APP-ENV, and SAMPLE-KEY.")
  },
  @{
    Title = "Task 2: Debug and Stabilize the Workflow"
    Goal = "Make workflow failures clear and make successful runs easy to understand."
    Rationale = "When a pipeline fails, the logs should quickly show what happened. Clear messages save time during debugging."
    Tests = @("Push a small change to rachel-branch, main, or develop.", "Open GitHub Actions and inspect the latest workflow run.", "Check the debug step for branch and event type.")
    Expected = @("Branch: rachel-branch", "Event: push", "PR runs skip Azure login, deployment, and Key Vault verification.")
  },
  @{
    Title = "Task 3: Pipeline Validation with Dummy Configuration"
    Goal = "Allow safe pull request testing without using or deploying real secrets."
    Rationale = "A pull request is a review stage. It should prove the pipeline works, but it should not change production-like secrets."
    Tests = @("git checkout -b feature/config-test", "git add config/test-secrets.json", "git commit -m `"test pull request dummy config`"", "git push -u origin feature/config-test", "Create a pull request into rachel-branch, main, or develop.")
    Expected = @("Event: pull_request", "Validating test config: config/test-secrets.json", "No real secrets are deployed during the pull request run.")
  },
  @{
    Title = "Task 4: JSON Configuration Validation"
    Goal = "Stop invalid or incomplete JSON files before deployment."
    Rationale = "If the config file is broken, the safest behavior is to fail early before Azure Key Vault is changed."
    Tests = @("Run a local JSON parse check.", "On a test branch, temporarily add a trailing comma to config/test-secrets.json and open a pull request.", "Then remove a required key such as SAMPLE_KEY and confirm the workflow fails again.")
    Expected = @("Invalid JSON fails in the Validate JSON config step.", "Missing API_BASE_URL, APP_ENV, or SAMPLE_KEY also fails validation.", "Fix the file before merging.")
  },
  @{
    Title = "Task 5: Simulate Pull Request and Full Pipeline Execution"
    Goal = "Prove the full workflow from feature branch to pull request validation to deployment after merge."
    Rationale = "This shows the normal team workflow: validate safely before merge, then deploy real configuration only after accepted code reaches an approved branch."
    Tests = @("Create a feature branch and make a small config change.", "Push the branch and open a pull request.", "Confirm the PR validates test-secrets.json and skips deployment.", "Merge the PR.", "Confirm the post-merge push run deploys secrets from secrets.json.")
    Expected = @("Before merge: validation only.", "After merge: Azure login, deployment, and Key Vault verification run.")
  },
  @{
    Title = "Task 6: Verify and Manage Secrets with Azure CLI"
    Goal = "Confirm secrets exist in Azure Key Vault and check their versions from the command line."
    Rationale = "The Azure CLI gives direct proof that the deployment worked, without relying only on GitHub logs or the Azure Portal."
    Tests = @("az keyvault secret list --vault-name kv-hzb-c2-config --output table", "az keyvault secret show --name API-BASE-URL --vault-name kv-hzb-c2-config --query value", "az keyvault secret list-versions --name API-BASE-URL --vault-name kv-hzb-c2-config --output table")
    Expected = @("The secret list includes values uploaded from config/secrets.json.", "The displayed secret value matches the config file.", "Repeated deployments create multiple versions.")
  }
)

foreach ($task in $tasks) {
  Add-Heading1 $rtf $task.Title
  Add-Heading2 $rtf "Goal"
  Add-Body $rtf $task.Goal
  Add-Heading2 $rtf "Simple rationale"
  Add-Body $rtf $task.Rationale
  Add-Heading2 $rtf "How to test"
  foreach ($test in $task.Tests) {
    if ($test -match "^(git|az|node)") {
      Add-Code $rtf $test
    }
    else {
      Add-Bullet $rtf $test
    }
  }
  Add-Heading2 $rtf "Expected result"
  foreach ($expected in $task.Expected) {
    Add-Bullet $rtf $expected
  }
}

Add-Heading1 $rtf "Presentation Talking Points"
$talkRows = @(
  @("Why GitHub Actions?", "It automates deployment so the process is consistent."),
  @("Why dummy config?", "It lets PRs test the pipeline safely without deploying real values."),
  @("Why JSON validation?", "It blocks broken config before Azure is changed."),
  @("Why push-only deployment?", "Only accepted code on approved branches should update Key Vault."),
  @("Why Azure CLI verification?", "It proves the result directly from Azure Key Vault.")
)
Add-Table $rtf @("Question", "Simple answer") $talkRows

Add-Heading1 $rtf "Final Acceptance Checklist"
$checkRows = @(
  @("Workflow exists", ".github/workflows/deploy-config.yml is present"),
  @("Push trigger works", "Push to rachel-branch, main, or develop starts deployment"),
  @("PR trigger works", "Opening a PR starts validation"),
  @("PR uses dummy config", "Logs show config/test-secrets.json"),
  @("PR does not deploy", "Azure login and deployment are skipped"),
  @("Push uses real config", "Logs show config/secrets.json"),
  @("Validation works", "Bad JSON or missing required keys fail the run"),
  @("Azure login works", "Service Principal authenticates successfully"),
  @("Secrets deploy", "Secrets appear in kv-hzb-c2-config"),
  @("Versioning works", "Azure CLI shows versions for updated secrets")
)
Add-Table $rtf @("Check", "Pass condition") $checkRows

Add-Heading1 $rtf "Local Verification Already Completed"
Add-Code $rtf "Both JSON files are valid"
Add-Code $rtf "Test Suites: 1 passed, 1 total"
Add-Code $rtf "Tests: 1 passed, 1 total"
Add-Body $rtf "Remaining real-world proof must be completed in GitHub Actions and Azure because it depends on repository secrets, workflow events, and actual Key Vault access."

[void]$rtf.AppendLine("}")

$resolvedOutput = [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $OutputPath))
$outputDir = Split-Path -Parent $resolvedOutput
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
[System.IO.File]::WriteAllText($resolvedOutput, $rtf.ToString(), [System.Text.Encoding]::ASCII)

Write-Host "Created Word-compatible RTF document:"
Write-Host $resolvedOutput
