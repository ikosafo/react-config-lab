// Backward compatibility shim.
// Task 8 centralizes all configuration loading in src/config/index.js.
export { loadConfig as loadAppConfig } from "./index";
export { default } from "./index";
