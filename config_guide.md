## Configuration Guide
 
# Main environment Variable  
- `REACT_APP_ENV`: Specifies the current environment (e.g., development, staging, production).  
- `REACT_APP_API_URL`: The base URL for API requests.
- `REACT_APP_APP_NAME`: The name of the application, used for display purposes.
- `REACT_APP_LOG_LEVEL`: The logging level for the application (e.g., debug, info, warn, error).
- `REACT_APP_ENABLE_ANALYTICS`: A boolean flag to enable or disable analytics tracking.
 
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