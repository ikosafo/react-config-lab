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
