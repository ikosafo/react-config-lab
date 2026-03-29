# Environment Variable Audit

## Task 1 Results

The project reads environment variables only in `src/config/appConfig.js` through `process.env`. Other files import the config object instead of reading `process.env` directly.

| Variable | Read In | Used By | Access Pattern | Purpose |
| --- | --- | --- | --- | --- |
| `REACT_APP_ENV` | `src/config/appConfig.js` | `src/components/EnvironmentBanner.js` | Through config file | Selects the environment label/color shown in the banner. |
| `REACT_APP_API_URL` | `src/config/appConfig.js` | `src/services/apiService.js` | Through config file | Sets the Axios `baseURL` for API requests. |
| `REACT_APP_APP_NAME` | `src/config/appConfig.js` | `src/components/ConfigViewer.js`, `src/config/envValidator.js` | Through config file | Stores the app name and is treated as required config. |
| `REACT_APP_LOG_LEVEL` | `src/config/appConfig.js` | `src/utils/logger.js`, `src/config/envValidator.js` | Through config file | Controls which log messages are printed. |
| `REACT_APP_ENABLE_ANALYTICS` | `src/config/appConfig.js` | `src/components/ConfigViewer.js` | Through config file | Converts `"true"` to a boolean flag for analytics enablement. |

## Notes

- Direct `process.env` reads found: `src/config/appConfig.js`
- No `import.meta.env` usage was found.
- `src/config/envValidator.js` exists but is not currently called from app startup.

## Task 3 Override Check

This project uses `react-scripts` (Create React App), and `.env.local` has higher priority than the shared environment-specific files used here.

Test setup:

- `.env.development` sets `REACT_APP_API_URL=https://dev-default.example.local`
- `.env.local` sets `REACT_APP_API_URL=https://local-override.example.local`

Observed result:

- With both files present, `REACT_APP_API_URL` resolves to `https://local-override.example.local`
- When `.env.local` is renamed/removed, `REACT_APP_API_URL` resolves to `https://dev-default.example.local`
- In production-mode loading with `.env.local` present, `REACT_APP_API_URL` also resolves to `https://local-override.example.local`
- In production-mode loading without `.env.local`, `REACT_APP_API_URL` resolves to `https://prod-default.example.com`

Conclusion:

- `.env.local` wins over `.env.development` for local development.
- `.env.local` also wins over `.env.production` when it exists.
- `.env.production` becomes the default for production only when `.env.local` is absent.
