import axios, { AxiosError } from 'axios';
import config from '../../config';

// Create axios instance
const api = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.application/vnd.github.v3',
  },
});

let token: string | null = null;

// Initialize from environment if available
const envToken = config.github.token;

if (envToken) {
  setToken(envToken);
}

// Add request interceptor to include token if available
api.interceptors.request.use((config) => {
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `token ${token}`;
  }
  return config;
});

/**
 * Set the GitHub Personal Access Token
 */
export function setToken(newToken: string): void {
  token = newToken;
}

/**
 * Handle API errors
 */
export function handleError(error: any): void {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === 403 &&
        axiosError.response?.headers['x-ratelimit-remaining'] === '0') {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    } else if (axiosError.response?.status === 404) {
      throw new Error('Repository not found. Please check the owner and repository name.');
    } else if (axiosError.response?.status === 401) {
      throw new Error('Invalid GitHub token. Please check your access token.');
    } else {
      throw new Error(`GitHub API error: ${axiosError.message}`);
    }
  } else {
    throw new Error(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export default api;
