import { useState, useEffect } from 'react';
import { githubApi } from '../services/github/api';


export const useGitHubToken = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('REACT_APP_GITHUB_TOKEN'));
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    limit: number;
    remaining: number;
    reset: Date;
  } | null>(null);

  // Set the token in the API service whenever it changes
  useEffect(() => {
    if (token) {
      githubApi.setToken(token);
      validateToken();
    } else {
      setIsTokenValid(false);
      setRateLimitInfo(null);
    }
  }, [token]);

  // Validate the token and get rate limit info
  const validateToken = async () => {
    try {
      const response = await githubApi.get('/rate_limit');
      const { rate } = response.data;

      const rateLimit = {
        limit: rate.limit,
        remaining: rate.remaining,
        reset: new Date(rate.reset * 1000),
      };

      setRateLimitInfo(rateLimit);
      setIsTokenValid(true);
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      setIsTokenValid(false);
      return false;
    }
  };

  // Update the token
  const updateToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('REACT_APP_GITHUB_TOKEN', newToken);
  };

  return {
    token,
    isTokenValid,
    rateLimitInfo,
    updateToken,
    validateToken,
  };
};
