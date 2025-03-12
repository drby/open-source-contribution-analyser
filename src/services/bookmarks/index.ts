import { Repository } from '../github/types/types';

// Re-export everything from the service
export * from './bookmarks';

// Export the types
export interface Bookmark {
  id: string;
  owner: string;
  repo: string;
  timestamp: number;
  repository: Repository;
}
