import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { initI18n } from './i18n/index.js';

// Load the visitor's saved language (English by default) before the first
// render, so a translated page never flashes English on reload.
initI18n().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
