// src/api/axiosConfig.js
import axios from 'axios';

// Set the base URL for your Django backend
axios.defaults.baseURL = 'http://127.0.0.1:8000';

// IMPORTANT: Send credentials (like session cookies) with requests
// This is necessary for SessionAuthentication to work across domains (localhost:3000 -> localhost:8000)
// Requires CORS_ALLOW_CREDENTIALS = True in Django settings.py
axios.defaults.withCredentials = true;

// You might also want to set headers like CSRF token here if needed,
// but SessionAuthentication often handles this via cookies if set up correctly.

export default axios;
