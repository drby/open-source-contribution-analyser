import { Repository } from '../github/types/types';
import { Bookmark } from './index';

// Max number of bookmarks to store
const MAX_BOOKMARKS = 5;
const STORAGE_KEY = 'bookmarks';

/**
 * Get bookmarks from localStorage
 * @returns Array of bookmarks
 */
export function getBookmarks(): Bookmark[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn('Failed to load bookmarks:', error);
    return [];
  }
}

/**
 * Save a bookmark to bookmarks
 * @param owner Repository owner
 * @param repo Repository name
 * @param repository Repository data
 */
export function saveBookmark(owner: string, repo: string, repository: Repository): void {
  try {
    const bookmarks = getBookmarks();

    // Create new bookmark entry
    const newBookmark: Bookmark = {
      id: `${owner}/${repo}`,
      owner,
      repo,
      timestamp: Date.now(),
      repository
    };

    // Remove any existing entry for the same repo
    const filtered = bookmarks.filter(bookmark => bookmark.id !== newBookmark.id);

    // Add new bookmark at the beginning
    const updated = [newBookmark, ...filtered].slice(0, MAX_BOOKMARKS);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.warn('Failed to save bookmark:', error);
  }
}

/**
 * Remove a bookmark from bookmarks
 * @param id Bookmark ID to remove
 */
export function removeBookmark(id: string): void {
  try {
    const bookmarks = getBookmarks();
    const updated = bookmarks.filter(bookmark => bookmark.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.warn('Failed to remove bookmark:', error);
  }
}

/**
 * Clear all bookmarks
 */
export function clearBookmarks(): void {
  localStorage.removeItem(STORAGE_KEY);

  window.dispatchEvent(new Event('storage'));
}
