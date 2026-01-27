// Import the core React library
// Needed to create and manage React components
import React from 'react';

// Import ReactDOM, which connects React to the browser DOM
import ReactDOM from 'react-dom/client';

// Import the root App component
// This is the main component of your application
import App from './App.jsx';

// Find the HTML element with id="root"
// This is where the React app will be mounted
const rootElement = document.getElementById('root');

// Create a React root and render the app into it
ReactDOM.createRoot(rootElement).render(

  // React.StrictMode is a development-only wrapper
  // It helps detect bugs, unsafe lifecycle methods,
  // and other potential issues early
  <React.StrictMode>

    {/* Render the App component */}
    <App />

  </React.StrictMode>
);
