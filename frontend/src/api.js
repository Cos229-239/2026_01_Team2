import axios from 'axios';

// Grab the environment variable
const rawApiBase = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

// Clean it up(in case the are any trailing chars) and append the current API version
// This single variable controls the versioning for the entire frontend
export const API_BASE_URL = `${rawApiBase.replace(/\/$/, "")}/api/v1`;
// Dedicated variable for asset endpoint
export const ASSET_BASE_URL = `${API_BASE_URL}/assets`;
// Create a custom Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    // You can also add global headers here later, like auth tokens!
});

export default api;
