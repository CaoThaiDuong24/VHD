// Cache service for WordPress data with proper browser/server handling

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum number of cache entries
}

class CacheService {
  protected cache: Map<string, CacheEntry<any>> = new Map()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes default
  private maxSize = 100

  constructor(options: CacheOptions = {}) {
    this.defaultTTL = options.ttl || this.defaultTTL
    this.maxSize = options.maxSize || this.maxSize
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTTL)
    
    // Check if cache is full
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt
    })
    
    console.log(`💾 Cached: ${key} (TTL: ${ttl || this.defaultTTL}ms)`)
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    const now = Date.now()
    
    if (now > entry.expiresAt) {
      this.cache.delete(key)
      console.log(`🗑️ Expired cache entry: ${key}`)
      return null
    }

    console.log(`🎯 Cache hit: ${key}`)
    return entry.data as T
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return false
    }

    const now = Date.now()
    
    if (now > entry.expiresAt) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key)
    if (deleted) {
      console.log(`🗑️ Deleted cache entry: ${key}`)
    }
    return deleted
  }

  clear(): void {
    this.cache.clear()
    console.log('🧹 Cleared all cache entries')
  }

  clearCache(prefix: string): void {
    let cleared = 0
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key)
        cleared++
      }
    }
    if (cleared > 0) {
      console.log(`🧹 Cleared ${cleared} cache entries with prefix: ${prefix}`)
    }
  }

  cleanup(): void {
    const now = Date.now()
    let cleaned = 0
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
        cleaned++
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} expired cache entries`)
    }
  }

  getStats(): {
    size: number
    maxSize: number
    defaultTTL: number
    hitRate?: number
  } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      defaultTTL: this.defaultTTL
    }
  }

  getEntries(): Array<{ key: string; timestamp: number; expiresAt: number; isExpired: boolean }> {
    const now = Date.now()
    return Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      timestamp: entry.timestamp,
      expiresAt: entry.expiresAt,
      isExpired: now > entry.expiresAt
    }))
  }
}

// WordPress-specific cache service
class WordPressCacheService extends CacheService {
  constructor() {
    super({
      ttl: 10 * 60 * 1000, // 10 minutes for WordPress data
      maxSize: 200
    })
  }

  // Cache WordPress posts
  cachePosts(posts: any[], lastModified?: string): void {
    const cacheKey = this.getPostsCacheKey(lastModified)
    this.set(cacheKey, {
      posts,
      lastModified: lastModified || new Date().toISOString(),
      count: posts.length
    })
  }

  // Get cached posts
  getCachedPosts(lastModified?: string): { posts: any[]; lastModified: string; count: number } | null {
    const cacheKey = this.getPostsCacheKey(lastModified)
    return this.get(cacheKey)
  }

  // Cache single post
  cachePost(postId: number, post: any): void {
    this.set(`wp-post-${postId}`, post)
  }

  // Get cached post
  getCachedPost(postId: number): any | null {
    return this.get(`wp-post-${postId}`)
  }

  // Cache WordPress connection status
  cacheConnectionStatus(status: any): void {
    this.set('wp-connection-status', status, 2 * 60 * 1000) // 2 minutes for connection status
  }

  // Get cached connection status
  getCachedConnectionStatus(): any | null {
    return this.get('wp-connection-status')
  }

  // Cache categories and tags
  cacheCategories(categories: any[]): void {
    this.set('wp-categories', categories, 30 * 60 * 1000) // 30 minutes for categories
  }

  getCachedCategories(): any[] | null {
    return this.get('wp-categories')
  }

  cacheTags(tags: any[]): void {
    this.set('wp-tags', tags, 30 * 60 * 1000) // 30 minutes for tags
  }

  getCachedTags(): any[] | null {
    return this.get('wp-tags')
  }

  // Private helper methods
  private getPostsCacheKey(lastModified?: string): string {
    return `wp-posts-${lastModified || 'all'}`
  }

  // Invalidate related caches when posts change
  invalidatePostsCaches(): void {
    const entries = this.getEntries()
    entries.forEach(entry => {
      if (entry.key.startsWith('wp-posts-')) {
        this.delete(entry.key)
      }
    })
    console.log('🔄 Invalidated WordPress posts caches')
  }
}

// Browser-safe localStorage cache service
class LocalStorageCacheService {
  private prefix = 'wp-cache-'
  private isBrowser = typeof window !== 'undefined'

  // Set data in localStorage with expiration
  set(key: string, data: any, ttl: number = 10 * 60 * 1000): void {
    if (!this.isBrowser) return // Skip on server-side

    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl
      }
      
      localStorage.setItem(this.prefix + key, JSON.stringify(cacheData))
      console.log(`💾 Stored in localStorage: ${key}`)
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  // Get data from localStorage
  get<T>(key: string): T | null {
    if (!this.isBrowser) return null // Skip on server-side

    try {
      const item = localStorage.getItem(this.prefix + key)
      
      if (!item) {
        return null
      }

      const cacheData = JSON.parse(item)
      const now = Date.now()

      if (now > cacheData.expiresAt) {
        localStorage.removeItem(this.prefix + key)
        console.log(`🗑️ Expired localStorage item: ${key}`)
        return null
      }

      console.log(`🎯 Retrieved from localStorage: ${key}`)
      return cacheData.data as T
    } catch (error) {
      console.error('Failed to read from localStorage:', error)
      return null
    }
  }

  // Delete from localStorage
  delete(key: string): void {
    if (!this.isBrowser) return // Skip on server-side

    try {
      localStorage.removeItem(this.prefix + key)
      console.log(`🗑️ Deleted from localStorage: ${key}`)
    } catch (error) {
      console.error('Failed to delete from localStorage:', error)
    }
  }

  // Clear all cache from localStorage
  clear(): void {
    if (!this.isBrowser) return // Skip on server-side

    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix))
      keys.forEach(key => localStorage.removeItem(key))
      console.log(`🧹 Cleared ${keys.length} localStorage cache items`)
    } catch (error) {
      console.error('Error during clear:', error)
    }
  }

  // Clean expired items
  cleanup(): void {
    if (!this.isBrowser) return // Skip on server-side

    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix))
      let cleaned = 0

      keys.forEach(key => {
        try {
          const item = localStorage.getItem(key)
          if (item) {
            const cacheData = JSON.parse(item)
            if (Date.now() > cacheData.expiresAt) {
              localStorage.removeItem(key)
              cleaned++
            }
          }
        } catch (error) {
          // Remove corrupted items
          localStorage.removeItem(key)
          cleaned++
        }
      })

      if (cleaned > 0) {
        console.log(`🧹 Cleaned ${cleaned} expired localStorage items`)
      }
    } catch (error) {
      console.error('Error during cleanup:', error)
    }
  }
}

// Create singleton instances
export const wpCache = new WordPressCacheService()
export const localCache = new LocalStorageCacheService()

// Auto cleanup interval (only in browser)
if (typeof window !== 'undefined') {
  setInterval(() => {
    try {
      wpCache.cleanup()
      localCache.cleanup()
    } catch (error) {
      console.error('Error during auto cleanup:', error)
    }
  }, 5 * 60 * 1000) // Cleanup every 5 minutes
}

export { CacheService, WordPressCacheService, LocalStorageCacheService } 