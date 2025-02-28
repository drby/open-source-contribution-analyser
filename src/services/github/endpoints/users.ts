import api from '../githubClient';
import { User } from '../types/types';
import { getCachedData, setCachedData } from '../cache/cacheService';

/**
 * Get detailed user information
 */
export async function getUserDetails(username: string): Promise<User> {
  const cacheKey = `user:${username}`;
  const cachedData = getCachedData<User>(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await api.get(`/users/${username}`);
    const userData = {
      name: response.data.name,
      company: response.data.company,
      location: response.data.location,
    };
    setCachedData(cacheKey, userData);
    return userData;
  } catch (error) {
    console.warn(`Error fetching details for user ${username}:`, error);
    return { name: null, company: null, location: null };
  }
}
