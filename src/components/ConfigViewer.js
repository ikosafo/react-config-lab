import React from "react";

function ConfigViewer({ config }) {
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
