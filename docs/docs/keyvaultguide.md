# Azure Key Vault Integration Guide

## Login to Azure
Run in terminal:
az login

## Access Key Vault
Name: kv-hzb-c2-config

## Adding Secrets
Go to:
Azure Portal → Key Vault → Secrets → + Generate/Import

Add:
- API-BASE-URL
- APP-ENV
- SAMPLE-KEY

## How the App Reads Secrets

1. Checks .env.local first
2. If not found → fetches from Azure Key Vault
3. If required secret missing → app throws error

## Fallback Behavior

With .env.local → uses local values  
Without .env.local → uses Key Vault  
If both missing → app stops with error
