param(
  [string]$VaultName = "kv-hzb-c2-config",
  [string]$SecretName = "API-BASE-URL",
  [string]$Version = ""
)

# Lists every secret currently stored in the Key Vault.
Write-Host "Listing secrets in vault: $VaultName"
az keyvault secret list --vault-name $VaultName --output table

# Shows one secret's metadata and value so you can confirm deployment worked.
Write-Host "Showing secret: $SecretName"
az keyvault secret show --name $SecretName --vault-name $VaultName --output table

# Lists versions created by repeated deployments of the same secret.
Write-Host "Listing versions for secret: $SecretName"
az keyvault secret list-versions --name $SecretName --vault-name $VaultName --output table

# If a version id is supplied, retrieve that specific version.
if ($Version -ne "") {
  Write-Host "Showing version $Version for secret: $SecretName"
  az keyvault secret show --name $SecretName --version $Version --vault-name $VaultName --output table
}
