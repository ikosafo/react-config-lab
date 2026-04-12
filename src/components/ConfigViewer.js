import React from "react";
import config from "../config/appConfig";
import {getSecret} from "../config/azureKeyVault";

function ConfigViewer() {

  // if (!isDevelopment) {
  //   return null;   
  // }

  return (
    <div>

      <h3>Current Configuration</h3>

      <pre>
        {JSON.stringify(config, null, 2)}
      </pre>

    </div>
  );

}

export default ConfigViewer;