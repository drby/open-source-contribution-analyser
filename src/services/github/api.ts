import api from './githubClient';
import { setToken } from './githubClient';
import { clearCache } from './cache/cacheService';
import { getRepository, getRateLimit } from './endpoints/repositories';
import { getContributors, getContributorsWithDetails } from './endpoints/contributors';
import { getUserDetails } from './endpoints/users';

async function get(path: string, config?: any) {
  return api.get(path, config);
}

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
