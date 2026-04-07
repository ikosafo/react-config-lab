
import React from "react";
 
function App({ config }) {
  return (
    <div style={{ padding: "20px" }}>
      <h1>React App Config</h1>
      <pre>{JSON.stringify(config, null, 2)}</pre>
    </div>
  );
}
 
export default App;