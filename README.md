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

## Configuration Guide

This guide helps you set up environment variables for the React Config Lab in 5 minutes.

### Main Environment Variables

| Variable | What it does | Required? |
|----------|--------------|-----------|
| `REACT_APP_ENV` | Sets the current environment (development/staging/production) | Yes |
| `REACT_APP_API_URL` | Backend API endpoint URL for data fetching | Yes |
| `REACT_APP_APP_NAME` | Display name shown in the app header | No (defaults to "React Config Lab") |
| `REACT_APP_LOG_LEVEL` | Console logging level (debug/info/warn/error) | No (defaults to "info") |
| `REACT_APP_ENABLE_ANALYTICS` | Toggle analytics tracking on/off | No (defaults to false) |

### Setting Up Your Own .env.local

1. Copy the template file: `cp .env.example .env.local`
2. Edit `.env.local` with your personal settings (e.g., local API URL)
3. Restart your dev server: `npm start`

Example `.env.local`:
```
REACT_APP_ENV=development
REACT_APP_API_URL=http://localhost:5000
REACT_APP_APP_NAME=React Config Lab (Local)
REACT_APP_LOG_LEVEL=debug
REACT_APP_ENABLE_ANALYTICS=false
```

### Quick Way to See Current Config in Dev

Open your browser's developer console (F12) when running `npm start`. You'll see a collapsed group "appConfig is in development mode" showing all current config values.

### Important Tip

Never commit real secrets or personal config to git! `.env.local` is ignored by git, while `.env.example` contains safe template values for others to copy.
