import api, { handleError } from '../githubClient';
import { Repository } from '../types/types';
import { getCachedData, setCachedData } from '../cache/cacheService';

/**
 * Get repository information
 */
export async function getRepository(owner: string, repo: string): Promise<Repository> {
  const cacheKey = `repo:${owner}/${repo}`;
  const cachedData = getCachedData<Repository>(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await api.get(`/repos/${owner}/${repo}`);
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

/**
 * Get rate limit information
 */
export async function getRateLimit(): Promise<{ limit: number; remaining: number; reset: Date }> {
  const cacheKey = 'rate_limit';
  const cachedData = getCachedData<{ limit: number; remaining: number; reset: Date }>(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await api.get('/rate_limit');
    const { rate } = response.data;

    const result = {
      limit: rate.limit,
      remaining: rate.remaining,
      reset: new Date(rate.reset * 1000),
    };

    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    handleError(error);
    throw error;
  }
}