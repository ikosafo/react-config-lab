const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { ClientSecretCredential, DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, ".env.development"), override: true });
dotenv.config({ path: path.resolve(__dirname, ".env.local"), override: true });
dotenv.config({ path: path.resolve(__dirname, "env.local"), override: true });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const tenantId = process.env.AZURE_TENANT_ID;
const clientId = process.env.AZURE_CLIENT_ID;
const clientSecret = process.env.AZURE_CLIENT_SECRET;
const vaultUrl = process.env.AZURE_KEYVAULT_URL || "https://kv-hzb-c2-config.vault.azure.net/";

let secretClient = null;
let configCache = null;
let configPromise = null;

function createSecretClient() {
  if (secretClient) return secretClient;

  let credential;

  if (tenantId && clientId && clientSecret) {
    credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    console.log("Using ClientSecretCredential for Key Vault access.");
  } else {
    // Useful for local testing when .env.local is missing but az login exists.
    credential = new DefaultAzureCredential();
    console.log("Using DefaultAzureCredential for Key Vault access.");
  }

  secretClient = new SecretClient(vaultUrl, credential);
  return secretClient;
}

async function readSecret(secretName) {
  const client = createSecretClient();
  const secret = await client.getSecret(secretName);
  return secret.value || "";
}

async function loadConfigFromKeyVault() {
  if (configCache) return configCache;
  if (configPromise) return configPromise;

  configPromise = (async () => {
    const resolvedConfig = {
      // Task 7 fallback order: .env first, then Key Vault for missing values.
      apiUrl: process.env.REACT_APP_API_URL || "",
      appName: process.env.REACT_APP_APP_NAME || "",
      logLevel: process.env.REACT_APP_LOG_LEVEL || "",
      analyticsEnabled: process.env.REACT_APP_ENABLE_ANALYTICS === "true",
    };

    const missingSecrets = [];
    if (!resolvedConfig.apiUrl) {
      missingSecrets.push({ key: "apiUrl", secretName: "react-app-api-url" });
    }
    if (!resolvedConfig.appName) {
      missingSecrets.push({ key: "appName", secretName: "react-app-app-name" });
    }
    if (!resolvedConfig.logLevel) {
      missingSecrets.push({ key: "logLevel", secretName: "react-app-log-level" });
    }

    for (const item of missingSecrets) {
      try {
        const secretValue = await readSecret(item.secretName);
        if (secretValue) {
          resolvedConfig[item.key] = secretValue;
        }
      } catch (error) {
        console.warn(`Key Vault read failed for ${item.secretName}: ${error.message}`);
      }
    }

    if (!resolvedConfig.logLevel) {
      resolvedConfig.logLevel = "info";
    }

    configCache = resolvedConfig;
    return configCache;
  })();

  return configPromise;
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/config", async (req, res) => {
  try {
    const config = await loadConfigFromKeyVault();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Key Vault proxy server running on http://localhost:${port}`);
});