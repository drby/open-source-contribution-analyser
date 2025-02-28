import { Repository } from '../github/types/types';
import { RecentSearch } from './index';

// Max number of recent searches to store
const MAX_RECENT_SEARCHES = 5;
const STORAGE_KEY = 'recent_searches';

/**
 * Get recent searches from localStorage
 * @returns Array of recent searches
 */
export function getRecentSearches(): RecentSearch[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn('Failed to load recent searches:', error);
    return [];
  }
}

/**
 * Save a search to recent searches
 * @param owner Repository owner
 * @param repo Repository name
 * @param repository Repository data
 */
export function saveRecentSearch(owner: string, repo: string, repository: Repository): void {
  try {
    const searches = getRecentSearches();

    // Create new search entry
    const newSearch: RecentSearch = {
      id: `${owner}/${repo}`,
      owner,
      repo,
      timestamp: Date.now(),
      repository
    };

    // Remove any existing entry for the same repo
    const filtered = searches.filter(search => search.id !== newSearch.id);

    // Add new search at the beginning
    const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.warn('Failed to save recent search:', error);
  }
}

/**
 * Remove a search from recent searches
 * @param id Search ID to remove
 */
export function removeRecentSearch(id: string): void {
  try {
    const searches = getRecentSearches();
    const updated = searches.filter(search => search.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.warn('Failed to remove recent search:', error);
  }
}

/**
 * Clear all recent searches
 */
export function clearRecentSearches(): void {
  localStorage.removeItem(STORAGE_KEY);

  window.dispatchEvent(new Event('storage'));
}