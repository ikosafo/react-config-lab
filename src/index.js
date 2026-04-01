import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { validateConfig } from './config/envValidator';

const root = ReactDOM.createRoot(document.getElementById('root'));

const renderApp = () => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

const renderConfigError = (message) => {
  root.render(
    <React.StrictMode>
      <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#c00' }}>Configuration Error</h1>
        <p style={{ fontSize: 16, lineHeight: 1.6 }}>
          {message}
        </p>
        <p style={{ color: '#555' }}>
          Please set the missing environment variables and restart the app.
        </p>
      </div>
    </React.StrictMode>
  );
};

try {
  validateConfig();
  renderApp();
} catch (error) {
  console.error(error);
  renderConfigError(error.message);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

 