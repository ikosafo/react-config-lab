import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { loadConfig } from "./config";

const root = ReactDOM.createRoot(document.getElementById("root"));

async function bootstrap() {
  await loadConfig(); // ensure central config is resolved first

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap().catch((error) => {
  console.error("App bootstrap failed:", error);

  root.render(
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h2>Configuration Error</h2>
      <p>The app cannot start because required configuration is missing.</p>
      <pre style={{ whiteSpace: "pre-wrap" }}>{String(error?.message || error)}</pre>
    </div>
  );
});

reportWebVitals();