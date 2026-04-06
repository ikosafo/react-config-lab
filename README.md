# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## 🔧 Configuration Guide

This project uses environment variables to manage configuration across development and production environments.

Environment variables allow us to change behavior (like API URLs or feature flags) without modifying the source code.

---

### 📦 Environment Files

The project supports the following environment files:

- `.env.local` → Your personal local overrides (not committed)
- `.env.development` → Team defaults for development
- `.env.production` → Defaults used during production build
- `.env.example` → Safe template for new developers

Environment loading priority (highest to lowest):

.env.local  
.env.development  
.env.production  

---

### 🔑 Main Environment Variables

| Variable | Required | Description |
|----------|----------|------------|
| REACT_APP_API_URL | Yes | Base URL used for all API requests |
| REACT_APP_ENV | Yes | Current runtime environment (e.g., development, production) |
| REACT_APP_APP_NAME | No | Display name of the application |
| REACT_APP_LOG_LEVEL | No | Logging level (debug, info, warn, error) |
| REACT_APP_ENABLE_ANALYTICS | No | Enable or disable analytics (true/false) |

---

### 🛠 Setting Up Your Local Environment

1. Copy the example file:

Mac/Linux: cp .env.example .env.local

Or manually duplicate `.env.example` and rename it to: .env.local


2. Edit `.env.local` and adjust values for your machine.

---

### 🚨 Required Variables

The following variables are required for the app to start:

- REACT_APP_API_URL  
- REACT_APP_ENV  

If any required variable is missing, the app will throw an error during startup.

Example error:

❌ Missing required environment variable: REACT_APP_API_URL  
Please add it to your .env.local file.

---

### 🔍 Viewing Loaded Configuration (Development Only)

When running: npm start


Open the browser developer console.

You will see:

🔧 Loaded App Config

This displays all currently loaded configuration values.

Note:
- This log appears only in development.
- It does not appear in production builds.

---

### 🔐 Important

- Never commit `.env.local`
- Never commit real API keys or secrets
- Only commit `.env.example` with safe placeholder values



