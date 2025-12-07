import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Starting FinanceInsight AI...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  const errorMsg = "Could not find root element to mount to";
  console.error(errorMsg);
  throw new Error(errorMsg);
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("FinanceInsight AI mounted successfully.");
} catch (error) {
  console.error("Failed to mount application:", error);
}