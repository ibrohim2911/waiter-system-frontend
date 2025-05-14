// src/App.js
import React from 'react';
import InventoryList from './components/InventoryList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Waiter System Frontend</h1>
        {/* Add a link to your Django login page if you don't have a React login form */}
        <p>
          Ensure you are logged in via the{' '}
          <a
            href="http://127.0.0.1:8000/admin/" // Or your custom login URL
            target="_blank"
            rel="noopener noreferrer"
          >
            Django Admin or Login Page
          </a>{' '}
          first.
        </p>
      </header>
      <main>
        <InventoryList />
        {/* You can add more components here later (e.g., for Orders, User Profile, Adding Items) */}
      </main>
    </div>
  );
}

export default App;
