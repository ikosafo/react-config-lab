param(
  [string]$OutputPath = "docs/Sprint-3-Config-Deployment-Presentation.docx"
)

$ErrorActionPreference = "Stop"

function Escape-XmlText {
  param([string]$Text)
  if ($null -eq $Text) {
    return ""
  }
  return [System.Security.SecurityElement]::Escape($Text)
}

function New-Paragraph {
  param(
    [string]$Text,
    [string]$Style = "",
    [bool]$Bold = $false,
    [string]$Color = "",
    [string]$Size = "",
    [string]$Align = "",
    [bool]$PageBreakBefore = $false
  )

  $pPr = ""
  if ($Style -ne "" -or $Align -ne "" -or $PageBreakBefore) {
    $styleXml = if ($Style -ne "") { "<w:pStyle w:val=`"$Style`"/>" } else { "" }
    $alignXml = if ($Align -ne "") { "<w:jc w:val=`"$Align`"/>" } else { "" }
    $pageBreakXml = if ($PageBreakBefore) { "<w:pageBreakBefore/>" } else { "" }
    $pPr = "<w:pPr>$styleXml$alignXml$pageBreakXml</w:pPr>"
  }

  $rPr = ""
  if ($Bold -or $Color -ne "" -or $Size -ne "") {
    $boldXml = if ($Bold) { "<w:b/>" } else { "" }
    $colorXml = if ($Color -ne "") { "<w:color w:val=`"$Color`"/>" } else { "" }
    $sizeXml = if ($Size -ne "") { "<w:sz w:val=`"$Size`"/><w:szCs w:val=`"$Size`"/>" } else { "" }
    $rPr = "<w:rPr>$boldXml$colorXml$sizeXml</w:rPr>"
  }

  $safeText = Escape-XmlText $Text
  return "<w:p>$pPr<w:r>$rPr<w:t xml:space=`"preserve`">$safeText</w:t></w:r></w:p>"
}

function New-Bullet {
  param([string]$Text)
  $safeText = Escape-XmlText $Text
  return "<w:p><w:pPr><w:pStyle w:val=`"BulletList`"/></w:pPr><w:r><w:t xml:space=`"preserve`">$safeText</w:t></w:r></w:p>"
}

function New-Code {
  param([string]$Text)
  $safeText = Escape-XmlText $Text
  return "<w:p><w:pPr><w:pStyle w:val=`"CodeBlock`"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii=`"Consolas`" w:hAnsi=`"Consolas`"/><w:sz w:val=`"19`"/><w:color w:val=`"1F2937`"/></w:rPr><w:t xml:space=`"preserve`">$safeText</w:t></w:r></w:p>"
}

function New-Table {
  param(
    [string[]]$Headers,
    [object[]]$Rows
  )

  $xml = "<w:tbl><w:tblPr><w:tblStyle w:val=`"PresentationTable`"/><w:tblW w:w=`"0`" w:type=`"auto`"/><w:tblLook w:val=`"04A0`" w:firstRow=`"1`" w:lastRow=`"0`" w:firstColumn=`"0`" w:lastColumn=`"0`" w:noHBand=`"0`" w:noVBand=`"1`"/></w:tblPr><w:tblGrid>"
  foreach ($h in $Headers) {
    $xml += "<w:gridCol w:w=`"3200`"/>"
  }
  $xml += "</w:tblGrid>"

  $xml += "<w:tr>"
  foreach ($h in $Headers) {
    $safe = Escape-XmlText $h
    $xml += "<w:tc><w:tcPr><w:shd w:fill=`"1F4E79`"/><w:tcW w:w=`"3200`" w:type=`"dxa`"/></w:tcPr><w:p><w:r><w:rPr><w:b/><w:color w:val=`"FFFFFF`"/></w:rPr><w:t>$safe</w:t></w:r></w:p></w:tc>"
  }
  $xml += "</w:tr>"

  foreach ($row in $Rows) {
    $xml += "<w:tr>"
    foreach ($cell in $row) {
      $safe = Escape-XmlText ([string]$cell)
      $xml += "<w:tc><w:tcPr><w:tcW w:w=`"3200`" w:type=`"dxa`"/></w:tcPr><w:p><w:r><w:t xml:space=`"preserve`">$safe</w:t></w:r></w:p></w:tc>"
    }
    $xml += "</w:tr>"
  }

  $xml += "</w:tbl>"
  return $xml
}

$body = New-Object System.Collections.Generic.List[string]

$body.Add((New-Paragraph "Sprint 3: Automation of Configuration Deployment" "Title" $true "1F4E79" "44" "center"))
$body.Add((New-Paragraph "Presentation and Testing Evidence Document" "Subtitle" $false "475569" "26" "center"))
$body.Add((New-Paragraph "Project: React Config Lab" "" $true "1F2937" "24" "center"))
$body.Add((New-Paragraph "Target Azure Key Vault: kv-hzb-c2-config" "" $false "1F2937" "22" "center"))
$body.Add((New-Paragraph ""))
$body.Add((New-Paragraph "Purpose" "Heading1"))
$body.Add((New-Paragraph "This document explains how Sprint 3 was implemented and how each task can be tested. It is written for presentation use, so each section states the goal, the simple reason behind it, the test steps, and the expected result."))
$body.Add((New-Paragraph ""))

$body.Add((New-Paragraph "Executive Summary" "Heading1"))
$body.Add((New-Bullet "A GitHub Actions workflow deploys configuration to Azure Key Vault on approved push events."))
$body.Add((New-Bullet "Pull requests run validation only and do not deploy secrets."))
$body.Add((New-Bullet "Dummy configuration is used for safe pull request testing."))
$body.Add((New-Bullet "JSON validation prevents invalid or incomplete configuration from being deployed."))
$body.Add((New-Bullet "Azure CLI commands and a helper script verify stored secrets and versions."))

$body.Add((New-Paragraph "Implementation Evidence" "Heading1" $false "" "" "" $true))
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
$body.Add((New-Table @("Area", "Status", "Evidence") $evidenceRows))

$body.Add((New-Paragraph "Task 1: GitHub Actions Workflow for Config Deployment" "Heading1" $false "" "" "" $true))
$body.Add((New-Paragraph "Goal" "Heading2"))
$body.Add((New-Paragraph "Automatically upload configuration values to Azure Key Vault when code is pushed to an approved branch."))
$body.Add((New-Paragraph "Simple rationale" "Heading2"))
$body.Add((New-Paragraph "Instead of manually copying secrets into Azure, the workflow does it the same way every time. This reduces mistakes and makes deployment repeatable."))
$body.Add((New-Paragraph "How to test" "Heading2"))
$body.Add((New-Code "git add ."))
$body.Add((New-Code "git commit -m `"test config deployment workflow`""))
$body.Add((New-Code "git push origin rachel-branch"))
$body.Add((New-Paragraph "Expected result" "Heading2"))
$body.Add((New-Bullet "GitHub Actions starts the workflow automatically."))
$body.Add((New-Bullet "The run includes checkout, jq install, Azure login, JSON validation, deployment, and verification steps."))
$body.Add((New-Bullet "Azure Key Vault contains secrets such as API-BASE-URL, APP-ENV, and SAMPLE-KEY."))

$body.Add((New-Paragraph "Task 2: Debug and Stabilize the Workflow" "Heading1" $false "" "" "" $true))
$body.Add((New-Paragraph "Goal" "Heading2"))
$body.Add((New-Paragraph "Make workflow failures clear and make successful runs easy to understand."))
$body.Add((New-Paragraph "Simple rationale" "Heading2"))
$body.Add((New-Paragraph "When a pipeline fails, the logs should quickly show what happened. Clear messages save time during debugging."))
$body.Add((New-Paragraph "How to test" "Heading2"))
$body.Add((New-Bullet "Push a small change to rachel-branch, main, or develop."))
$body.Add((New-Bullet "Open GitHub Actions and inspect the latest workflow run."))
$body.Add((New-Bullet "Check the debug step for branch and event type."))
$body.Add((New-Paragraph "Expected result" "Heading2"))
$body.Add((New-Code "Branch: rachel-branch"))
$body.Add((New-Code "Event: push"))
$body.Add((New-Bullet "The validation step prints which config file is being checked."))
$body.Add((New-Bullet "PR runs skip Azure login, deployment, and Key Vault verification."))

$body.Add((New-Paragraph "Task 3: Pipeline Validation with Dummy Configuration" "Heading1" $false "" "" "" $true))
$body.Add((New-Paragraph "Goal" "Heading2"))
$body.Add((New-Paragraph "Allow safe pull request testing without using or deploying real secrets."))
$body.Add((New-Paragraph "Simple rationale" "Heading2"))
$body.Add((New-Paragraph "A pull request is a review stage. It should prove the pipeline works, but it should not change production-like secrets."))
$body.Add((New-Paragraph "How to test" "Heading2"))
$body.Add((New-Code "git checkout -b feature/config-test"))
$body.Add((New-Code "git add config/test-secrets.json"))
$body.Add((New-Code "git commit -m `"test pull request dummy config`""))
$body.Add((New-Code "git push -u origin feature/config-test"))
$body.Add((New-Paragraph "Then create a pull request into rachel-branch, main, or develop."))
$body.Add((New-Paragraph "Expected result" "Heading2"))
$body.Add((New-Code "Event: pull_request"))
$body.Add((New-Code "Validating test config: config/test-secrets.json"))
$body.Add((New-Bullet "No real secrets are deployed during the pull request run."))

$body.Add((New-Paragraph "Task 4: JSON Configuration Validation" "Heading1" $false "" "" "" $true))
$body.Add((New-Paragraph "Goal" "Heading2"))
$body.Add((New-Paragraph "Stop invalid or incomplete JSON files before deployment."))
$body.Add((New-Paragraph "Simple rationale" "Heading2"))
$body.Add((New-Paragraph "If the config file is broken, the safest behavior is to fail early before Azure Key Vault is changed."))
$body.Add((New-Paragraph "How to test locally" "Heading2"))
$body.Add((New-Code "node -e `"JSON.parse(require('fs').readFileSync('config/secrets.json','utf8')); JSON.parse(require('fs').readFileSync('config/test-secrets.json','utf8')); console.log('Both JSON files are valid')`""))
$body.Add((New-Paragraph "How to test in GitHub Actions" "Heading2"))
$body.Add((New-Bullet "On a test branch, temporarily add a trailing comma to config/test-secrets.json and open a pull request."))
$body.Add((New-Bullet "Then remove a required key such as SAMPLE_KEY and confirm the workflow fails again."))
$body.Add((New-Paragraph "Expected result" "Heading2"))
$body.Add((New-Bullet "Invalid JSON fails in the Validate JSON config step."))
$body.Add((New-Bullet "Missing API_BASE_URL, APP_ENV, or SAMPLE_KEY also fails validation."))
$body.Add((New-Bullet "Fix the file before merging."))

$body.Add((New-Paragraph "Task 5: Simulate Pull Request and Full Pipeline Execution" "Heading1" $false "" "" "" $true))
$body.Add((New-Paragraph "Goal" "Heading2"))
$body.Add((New-Paragraph "Prove the full workflow from feature branch to pull request validation to deployment after merge."))
$body.Add((New-Paragraph "Simple rationale" "Heading2"))
$body.Add((New-Paragraph "This shows the normal team workflow: validate safely before merge, then deploy real configuration only after accepted code reaches an approved branch."))
$body.Add((New-Paragraph "How to test" "Heading2"))
$body.Add((New-Bullet "Create a feature branch and make a small config change."))
$body.Add((New-Bullet "Push the branch and open a pull request."))
$body.Add((New-Bullet "Confirm the PR validates test-secrets.json and skips deployment."))
$body.Add((New-Bullet "Merge the PR."))
$body.Add((New-Bullet "Confirm the post-merge push run deploys secrets from secrets.json."))
$body.Add((New-Paragraph "Expected result" "Heading2"))
$body.Add((New-Bullet "Before merge: validation only."))
$body.Add((New-Bullet "After merge: Azure login, deployment, and Key Vault verification run."))

$body.Add((New-Paragraph "Task 6: Verify and Manage Secrets with Azure CLI" "Heading1" $false "" "" "" $true))
$body.Add((New-Paragraph "Goal" "Heading2"))
$body.Add((New-Paragraph "Confirm secrets exist in Azure Key Vault and check their versions from the command line."))
$body.Add((New-Paragraph "Simple rationale" "Heading2"))
$body.Add((New-Paragraph "The Azure CLI gives direct proof that the deployment worked, without relying only on GitHub logs or the Azure Portal."))
$body.Add((New-Paragraph "Commands to run" "Heading2"))
$body.Add((New-Code "az keyvault secret list --vault-name kv-hzb-c2-config --output table"))
$body.Add((New-Code "az keyvault secret show --name API-BASE-URL --vault-name kv-hzb-c2-config --query value"))
$body.Add((New-Code "az keyvault secret list-versions --name API-BASE-URL --vault-name kv-hzb-c2-config --output table"))
$body.Add((New-Code "az keyvault secret show --name API-BASE-URL --version <version-id> --vault-name kv-hzb-c2-config --query value"))
$body.Add((New-Paragraph "Expected result" "Heading2"))
$body.Add((New-Bullet "The secret list includes values uploaded from config/secrets.json."))
$body.Add((New-Bullet "The displayed secret value matches the config file."))
$body.Add((New-Bullet "Repeated deployments create multiple versions."))

$body.Add((New-Paragraph "Presentation Talking Points" "Heading1" $false "" "" "" $true))
$talkRows = @(
  @("Why GitHub Actions?", "It automates deployment so the process is consistent."),
  @("Why dummy config?", "It lets PRs test the pipeline safely without deploying real values."),
  @("Why JSON validation?", "It blocks broken config before Azure is changed."),
  @("Why push-only deployment?", "Only accepted code on approved branches should update Key Vault."),
  @("Why Azure CLI verification?", "It proves the result directly from Azure Key Vault.")
)
$body.Add((New-Table @("Question", "Simple answer") $talkRows))

$body.Add((New-Paragraph "Final Acceptance Checklist" "Heading1" $false "" "" "" $true))
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
$body.Add((New-Table @("Check", "Pass condition") $checkRows))

$body.Add((New-Paragraph "Local Verification Already Completed" "Heading1" $false "" "" "" $true))
$body.Add((New-Code "Both JSON files are valid"))
$body.Add((New-Code "Test Suites: 1 passed, 1 total"))
$body.Add((New-Code "Tests: 1 passed, 1 total"))
$body.Add((New-Paragraph "Remaining real-world proof must be completed in GitHub Actions and Azure because it depends on repository secrets, workflow events, and actual Key Vault access."))

$documentXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 wp14">
  <w:body>
    $($body -join "`n")
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="900" w:right="900" w:bottom="900" w:left="900" w:header="720" w:footer="720" w:gutter="0"/>
      <w:cols w:space="720"/>
      <w:docGrid w:linePitch="360"/>
    </w:sectPr>
  </w:body>
</w:document>
"@

$stylesXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:qFormat/>
    <w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/><w:sz w:val="22"/><w:color w:val="111827"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:basedOn w:val="Normal"/>
    <w:qFormat/>
    <w:pPr><w:spacing w:after="260"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="44"/><w:color w:val="1F4E79"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Subtitle">
    <w:name w:val="Subtitle"/>
    <w:basedOn w:val="Normal"/>
    <w:qFormat/>
    <w:pPr><w:spacing w:after="260"/></w:pPr>
    <w:rPr><w:sz w:val="26"/><w:color w:val="475569"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="Heading 1"/>
    <w:basedOn w:val="Normal"/>
    <w:next w:val="Normal"/>
    <w:qFormat/>
    <w:pPr><w:spacing w:before="240" w:after="140"/><w:keepNext/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="32"/><w:color w:val="1F4E79"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="Heading 2"/>
    <w:basedOn w:val="Normal"/>
    <w:next w:val="Normal"/>
    <w:qFormat/>
    <w:pPr><w:spacing w:before="180" w:after="80"/><w:keepNext/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="25"/><w:color w:val="334155"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="BulletList">
    <w:name w:val="Bullet List"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr><w:ind w:left="360" w:hanging="180"/></w:pPr>
    <w:rPr><w:sz w:val="22"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="CodeBlock">
    <w:name w:val="Code Block"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr><w:spacing w:before="80" w:after="80"/><w:shd w:fill="F3F4F6"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/><w:sz w:val="19"/><w:color w:val="1F2937"/></w:rPr>
  </w:style>
  <w:style w:type="table" w:styleId="PresentationTable">
    <w:name w:val="Presentation Table"/>
    <w:tblPr><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/><w:left w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/><w:right w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/></w:tblBorders><w:tblCellMar><w:top w:w="100" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tblCellMar></w:tblPr>
  </w:style>
</w:styles>
"@

$contentTypesXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>
"@

$relsXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>
"@

$documentRelsXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>
"@

$created = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$coreXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Sprint 3 Automation of Configuration Deployment</dc:title>
  <dc:subject>Testing guide and presentation evidence</dc:subject>
  <dc:creator>Codex</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">$created</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">$created</dcterms:modified>
</cp:coreProperties>
"@

$appXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Codex</Application>
  <DocSecurity>0</DocSecurity>
  <ScaleCrop>false</ScaleCrop>
  <Company>React Config Lab</Company>
  <LinksUpToDate>false</LinksUpToDate>
  <SharedDoc>false</SharedDoc>
  <HyperlinksChanged>false</HyperlinksChanged>
  <AppVersion>16.0000</AppVersion>
</Properties>
"@

$resolvedOutput = [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $OutputPath))
$outputDir = Split-Path -Parent $resolvedOutput
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("sprint3-docx-" + [System.Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $tempRoot | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $tempRoot "_rels") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $tempRoot "word") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $tempRoot "word/_rels") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $tempRoot "docProps") | Out-Null

[System.IO.File]::WriteAllText((Join-Path $tempRoot "[Content_Types].xml"), $contentTypesXml, [System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText((Join-Path $tempRoot "_rels/.rels"), $relsXml, [System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText((Join-Path $tempRoot "word/document.xml"), $documentXml, [System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText((Join-Path $tempRoot "word/styles.xml"), $stylesXml, [System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText((Join-Path $tempRoot "word/_rels/document.xml.rels"), $documentRelsXml, [System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText((Join-Path $tempRoot "docProps/core.xml"), $coreXml, [System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText((Join-Path $tempRoot "docProps/app.xml"), $appXml, [System.Text.UTF8Encoding]::new($false))

if (Test-Path $resolvedOutput) {
  Remove-Item -LiteralPath $resolvedOutput -Force
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::Open($resolvedOutput, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  $files = Get-ChildItem -LiteralPath $tempRoot -File -Recurse
  foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($tempRoot.Length).TrimStart("\", "/").Replace("\", "/")
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $file.FullName, $relativePath) | Out-Null
  }
}
finally {
  $archive.Dispose()
}
Remove-Item -LiteralPath $tempRoot -Recurse -Force

Write-Host "Created Word document:"
Write-Host $resolvedOutput
