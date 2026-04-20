import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import configPromise, { isDevelopment } from "./config";

const root = ReactDOM.createRoot(document.getElementById("root"));

configPromise
  .then(config => {
    root.render(
      <React.StrictMode>
        <App config={config} isDevelopment={isDevelopment} />
      </React.StrictMode>
    );
  })
  .catch(error => {
    console.error("Failed to load application configuration.", error);

    root.render(
      <React.StrictMode>
        <div style={{ padding: 24, fontFamily: "sans-serif" }}>
          <h1>Configuration Error</h1>
          <pre style={{ whiteSpace: "pre-wrap" }}>{error.message}</pre>
        </div>
      </React.StrictMode>
    );
  });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
