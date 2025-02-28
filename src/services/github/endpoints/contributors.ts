import api, { handleError } from '../githubClient';
import { Contributor } from '../types/types';
import { getCachedData, setCachedData } from '../cache/cacheService';
import { getUserDetails } from './users';

/**
 * Get repository contributors with pagination
 * Limits to the top 30 contributors
 */
export async function getContributors(owner: string, repo: string): Promise<Contributor[]> {
  const cacheKey = `contributors:${owner}/${repo}`;
  const cachedData = getCachedData<Contributor[]>(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await api.get(`/repos/${owner}/${repo}/contributors`, {
      params: {
        per_page: 30,
      },
    });
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

/**
 * Get full contributor details
 */
export async function getContributorsWithDetails(owner: string, repo: string): Promise<Contributor[]> {
  const cacheKey = `contributors_with_details:${owner}/${repo}`;
  const cachedData = getCachedData<Contributor[]>(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const contributors = await getContributors(owner, repo);

    const contributorsWithDetails = await Promise.all(
      contributors.map(async (contributor) => {
        try {
          const userDetails = await getUserDetails(contributor.login);

          return {
            ...contributor,
            name: userDetails.name,
            company: userDetails.company,
            location: userDetails.location
          } as Contributor;
        } catch (error) {
          return contributor;
        }
      })
    );

    setCachedData(cacheKey, contributorsWithDetails);
    return contributorsWithDetails;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
