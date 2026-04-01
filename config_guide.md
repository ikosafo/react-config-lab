## How to use our config

This guide helps you understand the config quickly and make your own local settings.

### Main Environment Variables

| Variable | What it does | Required? |
|----------|--------------|-----------|
| `REACT_APP_ENV` | Sets the current app environment (`development`, `staging`, `production`) | Yes |
| `REACT_APP_API_URL` | URL for the backend API the app talks to | Yes |
| `REACT_APP_APP_NAME` | App display name shown in the UI | No (defaults to `React Config Lab`) |
| `REACT_APP_LOG_LEVEL` | Logging verbosity for the app | No (defaults to `info`) |
| `REACT_APP_ENABLE_ANALYTICS` | Turns analytics tracking on when `true` | No (defaults to `false`) |

### How to make your own `.env.local`

1. Copy the example file:
   - macOS / Linux: `cp .env.example .env.local`
   - Windows PowerShell: `Copy-Item .env.example .env.local`
   - Windows CMD: `copy .env.example .env.local`
2. Edit `.env.local` and set your own values.
3. Restart the dev server: `npm start`

Example `.env.local`:

```env
REACT_APP_ENV=development
REACT_APP_API_URL=http://localhost:5000
REACT_APP_APP_NAME=React Config Lab (Local)
REACT_APP_LOG_LEVEL=debug
REACT_APP_ENABLE_ANALYTICS=false
```

### Quick way to see the current config in dev

Run `npm start`, open the browser developer console (F12), and look for the config log from `src/config/appConfig.js`.

If required variables are missing, the app shows a browser-visible configuration error screen instead of crashing silently.

### One important tip

Do not commit real secrets or private values to git. Use `.env.local` for local overrides, and keep `.env.example` as a safe template that others can copy.
 



## Alternatively,

 Task 5: Spot which variables are really important (required)

From searching the entire codebase for REACT_APP variables, the following environment variables are used:

- REACT_APP_ENV (used in src/config/appConfig.js)
- REACT_APP_API_URL (used in src/config/appConfig.js)
- REACT_APP_APP_NAME (used in src/config/appConfig.js)
- REACT_APP_LOG_LEVEL (used in src/config/appConfig.js)
- REACT_APP_ENABLE_ANALYTICS (used in src/config/appConfig.js)

All are read directly in the config file, not through other files.

Decisions on required vs optional:

- REACT_APP_ENV: Required. The app uses this to determine the environment for conditional logging and behavior. If missing in development mode, the app should throw an error to prevent silent misconfigurations. Helpful error message: "Environment variable REACT_APP_ENV is required. Please set it in your .env file (e.g., 'development', 'staging', or 'production')."

- REACT_APP_API_URL: Required. This is the base URL for API calls, essential for the app's functionality. If missing in development mode, throw error: "API URL is required. Please set REACT_APP_API_URL in your .env file (e.g., 'http://localhost:3001/api')."

- REACT_APP_APP_NAME: Optional. This is just a display name; the app can fallback to a default like "React Config Lab" if not set. No error needed.

- REACT_APP_LOG_LEVEL: Optional. Controls logging verbosity; can default to "info" if not set. No error needed.

- REACT_APP_ENABLE_ANALYTICS: Optional. A boolean flag for analytics; can default to false if not set. No error needed.


To implement the required checks, add validation in src/config/appConfig.js after defining the config object, e.g.:

if (process.env.NODE_ENV === "development") {
  if (!process.env.REACT_APP_ENV) {
    throw new Error("Environment variable REACT_APP_ENV is required. Please set it in your .env file (e.g., 'development', 'staging', or 'production').");
  }
  if (!process.env.REACT_APP_API_URL) {
    throw new Error("API URL is required. Please set REACT_APP_API_URL in your .env file (e.g., 'http://localhost:3001/api').");
  }
}

This ensures the app fails loudly in dev if critical config is missing, while allowing optional variables to have safe defaults.

Task 6: Write a short "How to use our config" guide

# Configuration Guide for React Config Lab

## Overview
This app uses environment variables for configuration, loaded from .env files. This keeps sensitive data out of the codebase and allows different settings per environment.

## Main Variables and What They Do
- `REACT_APP_ENV`: Sets the app environment (development, staging, production). Controls logging and behavior.
- `REACT_APP_API_URL`: Base URL for API calls (e.g., http://localhost:3001/api).
- `REACT_APP_APP_NAME`: Display name for the app (e.g., "React Config Lab").
- `REACT_APP_LOG_LEVEL`: Logging verbosity (debug, info, warn, error).
- `REACT_APP_ENABLE_ANALYTICS`: Enables/disables analytics features (true/false).

## How to Make Your Own .env.local
1. Copy `.env.example` to `.env.local` in the project root.
2. Update the values for your local setup (e.g., change API URL to your local server).
3. Never commit `.env.local` to version control—it's for personal use only.

## Quick Way to See Current Config in Dev
- Run `npm start` to start the app in development mode.
- The config object will be logged to the browser console (under a collapsed group) and displayed on the page (after the environment banner).
- This only happens in dev mode for security.

## Important Tip
Never commit real secrets, API keys, or production URLs to version control. Use `.env.local` for personal overrides, and keep `.env.example` with fake/safe values as a template.






## This explains in detail, the code in the "appConfig.js"

- central config file because all variables are declared or read here, and then exported 
- to be used in other files. This way we have a single source of truth for all our config values, 
- and we can easily manage them in one place. We can also add logic to handle different environments, 
- such as development, staging, and production, by checking the value of the environment variable and
-  adjusting the config accordingly. This makes our app more flexible and easier to maintain as it grows.  

- central config file, we can use this variable to conditionally log the config values, without worrying about accidentally exposing sensitive information in production.
//This is a common practice in React applications to ensure that sensitive information is not exposed in production environments while still allowing developers to access configuration details during development.

- with NODE the env.local does not work but the env.development does work, so we will set the environment variable in the env.development file to "staging" for testing purposes. This way, we can see how the app behaves when it's not in development mode and ensure that config values are not logged to the console in that case. It's important to test both scenarios to confirm that our conditional logging is working as intended and that sensitive information is protected in production environments.

- so we changed the NODE_ENV to REACT_APP_ENV in the .env files, and set it to "staging" in the .env.development file, and "production" in the .env.local file. This way, we can test both scenarios and ensure that our conditional logging is working correctly. When we run the app in development mode, we should see the config values logged to the console, but when we run it in production mode, we should see a message indicating that config values are not logged. This helps us confirm that our approach to handling configuration and logging is effective and secure across different environments.

- NODE_ENV is a special environment variable that is automatically set by React to either "development" or "production" depending on how the app is being run. However, in this case, we want to use a custom environment variable called REACT_APP_ENV to determine the current environment, so we will set that variable in our .env files instead of relying on NODE_ENV. This allows us to have more control over the environment settings and ensures that our conditional logging works as intended based on the value of REACT_APP_ENV rather than NODE_ENV.


- then we define our appConfig object as before, but now we can safely log it to the console if the app is in development mode.

- By using the isDevelopment variable, we can conditionally log the appConfig object to the console without worrying about accidentally exposing sensitive information in production. This way, developers can easily see the configuration values when they're developing the app, but those values won't be logged in production environments, helping to keep sensitive information secure.

- We check if the app is in development mode using the isDevelopment variable we defined earlier.

- If it is true, we log the appConfig object to the console using console.groupCollapsed to group the log messages together and make it easier to read. We also include a message indicating that the appConfig is in development mode for clarity. 

- If the app is in development mode, we log the current configuration values to the console. This can be very helpful for debugging and verifying that the correct environment variables are being loaded. We use console.groupCollapsed to group these log messages together, making it easier to expand and view them in the browser's developer tools without cluttering the console when they are not needed.

- Finally, we use console.groupEnd to close the group of log messages.

- This way, we can easily see the configuration values when we're developing the app, but we won't accidentally expose them in production. It's a good practice to use environment variables and conditional logging like this to keep sensitive information secure while still providing developers with the necessary tools to debug and develop the application effectively.

- If the app is not in development mode, we log a message to the console indicating that the app is in production mode and that config values are not logged. This helps to clarify the behavior of the application and ensures that developers are aware of the environment they are working in, while also maintaining security by not exposing sensitive information in production environments.
 
 - Finally, we export the appConfig object as the default export of this module, so it can be imported and used in other parts of our application as needed.
 

 
 