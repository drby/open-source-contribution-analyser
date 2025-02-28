import { Repository } from '../github/types/types';

// Re-export everything from the service
export * from './recentSearches';

// Export the types
export interface RecentSearch {
  id: string;
  owner: string;
  repo: string;
  timestamp: number;
  repository: Repository;
}