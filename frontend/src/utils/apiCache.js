// Simple in-memory cache for API responses
class ApiCache {
  constructor(maxAge = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.maxAge = maxAge;
  }

  // Generate cache key from URL and parameters
  generateKey(url, params = {}) {
    const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
    return `${url}?${sortedParams}`;
  }

  // Get cached response if valid
  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const { data, timestamp } = cached;
    const now = Date.now();

    // Check if cache is still valid
    if (now - timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return data;
  }

  // Store response in cache
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });

    // Simple cleanup - remove old entries when cache gets too large
    if (this.cache.size > 50) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  // Clear specific cache entry
  delete(key) {
    this.cache.delete(key);
  }

  // Clear all cache
  clear() {
    this.cache.clear();
  }
}

// Create a singleton cache instance
const apiCache = new ApiCache();

// Enhanced axios wrapper with caching
export const cachedAxiosGet = async (url, params = {}, useCache = true) => {
  const cacheKey = apiCache.generateKey(url, params);
  
  // Try to get from cache first
  if (useCache) {
    const cachedResponse = apiCache.get(cacheKey);
    if (cachedResponse) {
      console.log(`Cache hit for: ${cacheKey}`);
      return { data: cachedResponse };
    }
  }

  try {
    // Import axios dynamically to avoid circular imports
    const axios = (await import('axios')).default;
    
    // Make the actual API call
    const response = await axios.get(url, { params });
    
    // Cache the response data
    if (useCache && response.data) {
      apiCache.set(cacheKey, response.data);
      console.log(`Cached response for: ${cacheKey}`);
    }
    
    return response;
  } catch (error) {
    console.error(`API call failed for: ${cacheKey}`, error);
    throw error;
  }
};

// Utility functions for common Open Library API calls
export const OpenLibraryAPI = {
  // Search books with caching
  searchBooks: (query, limit = 10, fields = null) => {
    const params = { q: query, limit };
    if (fields) params.fields = fields;
    return cachedAxiosGet('https://openlibrary.org/search.json', params);
  },

  // Search by subject with caching
  searchBySubject: (subject, limit = 1) => {
    return cachedAxiosGet('https://openlibrary.org/search.json', {
      q: `subject:${subject}`,
      limit
    });
  },

  // Search by author with caching
  searchByAuthor: (author, limit = 10) => {
    return cachedAxiosGet('https://openlibrary.org/search.json', {
      author,
      limit
    });
  },

  // Search by author and year with caching
  searchByAuthorAndYear: (author, year) => {
    return cachedAxiosGet('https://openlibrary.org/search.json', {
      author,
      published_in: year,
      limit: 1
    });
  },

  // Search by author and subject with caching
  searchByAuthorAndSubject: (author, subject) => {
    return cachedAxiosGet('https://openlibrary.org/search.json', {
      author,
      subject,
      limit: 1
    });
  }
};

// Cache management utilities
export const CacheUtils = {
  // Clear all cache
  clearAll: () => apiCache.clear(),
  
  // Clear specific URL pattern
  clearPattern: (pattern) => {
    for (const key of apiCache.cache.keys()) {
      if (key.includes(pattern)) {
        apiCache.delete(key);
      }
    }
  },
  
  // Get cache stats
  getStats: () => ({
    size: apiCache.cache.size,
    keys: Array.from(apiCache.cache.keys())
  })
};

export default { cachedAxiosGet, OpenLibraryAPI, CacheUtils };