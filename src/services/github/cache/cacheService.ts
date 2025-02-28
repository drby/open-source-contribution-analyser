interface CacheData {
    timestamp: number;
    data: any;
  }

  // Cache expiration time (30 minutes in milliseconds)
  const CACHE_EXPIRATION = 30 * 60 * 1000;

  // Module state
  let cache: Record<string, CacheData> = {};

  // Initialize cache
  loadCacheFromStorage();

  /**
   * Save the cache to localStorage
   */
  function saveCacheToStorage(): void {
    try {
      localStorage.setItem('github_api_cache', JSON.stringify(cache));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }

  /**
   * Load the cache from localStorage
   */
  function loadCacheFromStorage(): void {
    try {
      const cachedData = localStorage.getItem('github_api_cache');
      if (cachedData) {
        cache = JSON.parse(cachedData);

        // Clean expired cache entries
        cleanExpiredCache();
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
      cache = {};
    }
  }

  /**
   * Clean expired cache entries
   */
  function cleanExpiredCache(): void {
    const now = Date.now();
    let hasExpired = false;

    Object.keys(cache).forEach(key => {
      if (now - cache[key].timestamp > CACHE_EXPIRATION) {
        delete cache[key];
        hasExpired = true;
      }
    });

    if (hasExpired) {
      saveCacheToStorage();
    }
  }

  /**
   * Get data from cache if available and not expired
   */
  export function getCachedData<T>(key: string): T | null {
    cleanExpiredCache();

    if (cache[key]) {
      return cache[key].data as T;
    }

    return null;
  }

  /**
   * Save data to cache
   */
  export function setCachedData(key: string, data: any): void {
    cache[key] = {
      timestamp: Date.now(),
      data
    };

    saveCacheToStorage();
  }

  /**
   * Clear the entire cache
   */
  export function clearCache(): void {
    cache = {};
    localStorage.removeItem('github_api_cache');
  }
