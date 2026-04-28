import React, { useEffect, useState } from 'react';
import appConfig from '../config/appConfig';
import { getSecret } from '../config/azureKeyVault';

export default function ConfigDisplay() {
  const [secrets, setSecrets] = useState({
    apiUrl: appConfig.apiUrl,
    env: appConfig.env,
    sampleKey: appConfig.sampleKey
  });

  useEffect(() => {
    async function fetchSecrets() {
      const apiUrl = await getSecret('API_BASE_URL');
      const env = await getSecret('APP_ENV');
      const sampleKey = await getSecret('SAMPLE_KEY');
      setSecrets({ apiUrl, env, sampleKey });
    }
    fetchSecrets();
  }, []);

  return (
    <div>
      <h2>ConfigDisplay Component</h2>
      <p>Environment: {secrets.env}</p>
      <p>API URL: {secrets.apiUrl}</p>
      <p>Sample Key: {secrets.sampleKey}</p>
      <p>App Name: {appConfig.appName}</p>
      <p>Analytics Enabled: {appConfig.analyticsEnabled.toString()}</p>
    </div>
  );
}
