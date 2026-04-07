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

# How to use our config guide
This guide provides instructions on how to set up and use environment variables in a React application. It covers the main environment variables, how to create and configure the `.env.local` file, and how to view the configuration in development mode.


# Main environment Variables 

| Variable | What it does | Required |
|----------|--------------|----------|
|- `REACT_APP_ENV`| Specifies the current environment ('development', 'staging', 'production') |Yes|  
|- `REACT_APP_API_URL`| The base URL for API requests | Yes|
|- `REACT_APP_APP_NAME`| The name of the application, used for display purposes |No  |
|- `REACT_APP_LOG_LEVEL`| The logging level for the application (e.g., debug, info, warn, error) |NO|
|- `REACT_APP_ENABLE_ANALYTICS`| A boolean flag to enable or disable analytics tracking |True/False|

# Setup Instruction (.env.local)
1. Open the root directory of your React project in a code editor or terminal.
2. Create a new file named `.env.local` in the root directory of your project.
3. Add the following environment variables to the `.env.local` file, replacing the values with your own configuration:

```env
# Environment variable to specify the current environment (e.g., development, staging, production)
REACT_APP_ENV=development
# API URL for development environment
REACT_APP_API_URL=http://localhost:3000/api
# Application name
REACT_APP_APP_NAME=My React App
# Logging level (e.g., debug, info, warn, error)
REACT_APP_LOG_LEVEL=debug
# Enable analytics tracking (true or false)
REACT_APP_ENABLE_ANALYTICS=true
```
4. Save the `.env.local` file. The environment variables defined in this file will now be available in your React application through `process.env`.

# Environment Files
.env.local
.env.development
.env.production

# viewing config in development 
In development mode, you can view the configuration by checking the console output. The `appConfig` object is logged to the console when the application is running in development mode. To view it:
1. Start your React application using `npm start` or `yarn start`.
2. Open the browser's developer tools (usually by pressing F12 or right-clicking and selecting "Inspect").
3. Navigate to the "Console" tab in the developer tools.

# Important Notes
- Do not commit the `.env.local` file to version control, as it may contain sensitive information. Use `.env.development` and `.env.production` for environment-specific configurations that can be committed.
- Ensure that the environment variables are correctly defined in the `.env` files and that they are prefixed with `REACT_APP_` to be accessible in the React application.
- Missing required variables will throw an error 
- The configuration is loaded at build time, so changes to the `.env` files will require restarting the development server to take effect.
