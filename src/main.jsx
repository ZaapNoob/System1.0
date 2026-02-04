// Import the core React library
// Needed to create and manage React components
import React from 'react';

// Import ReactDOM, which connects React to the browser DOM
import ReactDOM from 'react-dom/client';

// Import the root App component
// This is the main component of your application
import App from './App.jsx';

// Import ModalProvider to manage modals across the app
import { ModalProvider } from './components/modal/ModalProvider';

// Find the HTML element with id="root"
// This is where the React app will be mounted
const rootElement = document.getElementById('root');

// Create a React root and render the app into it
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {/* Wrap the whole app with ModalProvider so modals work anywhere */}
    <ModalProvider>
      <App />
    </ModalProvider>
  </React.StrictMode>
);
