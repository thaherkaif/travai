import React from 'react';
import ReactDOM from 'react-dom/client'; // Import react-dom/client
import App from './App'; // Your main App component
import './index.css'; // Global styles (optional)

const rootElement = document.getElementById('root'); // Find the root div in index.html
const root = ReactDOM.createRoot(rootElement); // Create root using React 18+ API
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
