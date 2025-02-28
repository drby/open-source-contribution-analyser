import api from './githubClient';
import { setToken } from './githubClient';
import { clearCache } from './cache/cacheService';
import { getRepository, getRateLimit } from './endpoints/repositories';
import { getContributors, getContributorsWithDetails } from './endpoints/contributors';
import { getUserDetails } from './endpoints/users';

/**
 * Make a direct GET request to the GitHub API
 * This is a helper for more custom requests
 */
async function get(path: string, config?: any) {
  return api.get(path, config);
}

// Export an object with the same interface as the previous class
// to maintain compatibility with existing code
export const githubApi = {
  setToken,
  getRateLimit,
  getRepository,
  getContributors,
  getUserDetails,
  getContributorsWithDetails,
  get,
  clearCache
};