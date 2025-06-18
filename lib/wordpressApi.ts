// WordPress API configuration
const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://your-wordpress-site.com/wp-json/wp/v2'
const WORDPRESS_USERNAME = process.env.WORDPRESS_USERNAME || ''
const WORDPRESS_PASSWORD = process.env.WORDPRESS_PASSWORD || ''

// WordPress post interface
export interface WordPressPost {
  id: number
  date: string
  date_gmt: string
  modified: string
  modified_gmt: string
  slug: string
  status: 'publish' | 'draft' | 'private' | 'pending'
  type: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  author: number
  featured_media: number
  comment_status: string
  ping_status: string
  sticky: boolean
  template: string
  format: string
  meta: any[]
  categories: number[]
  tags: number[]
  _links: any
}

// Convert WordPress post to our NewsItem format
export function convertWordPressToNewsItem(wpPost: WordPressPost): any {
  return {
    id: wpPost.id,
    title: wpPost.title.rendered.replace(/<[^>]*>/g, ''), // Strip HTML tags
    titleEn: '', // You might want to use a custom field for English title
    excerpt: wpPost.excerpt.rendered.replace(/<[^>]*>/g, ''),
    excerptEn: '',
    content: wpPost.content.rendered,
    contentEn: '',
    date: wpPost.date.split('T')[0], // Convert to YYYY-MM-DD format
    author: 'WordPress Author', // You might want to fetch author details
    authorEn: 'WordPress Author',
    category: 'Tin tức', // Default category
    categoryEn: 'News',
    tags: [], // You might want to fetch tag details
    image: '', // You might want to fetch featured image
    status: wpPost.status === 'publish' ? 'published' as const : 'draft' as const,
    featured: wpPost.sticky,
    views: 0,
    readingTime: Math.ceil(wpPost.content.rendered.replace(/<[^>]*>/g, '').split(' ').length / 200), // Estimate reading time
    gallery: []
  }
}

// WordPress API service class
export class WordPressService {
  protected baseUrl: string
  protected auth: string

  constructor() {
    this.baseUrl = WORDPRESS_API_URL
    this.auth = btoa(`${WORDPRESS_USERNAME}:${WORDPRESS_PASSWORD}`)
  }

  // Method to set credentials dynamically
  setCredentials(apiUrl: string, username: string, password: string) {
    this.baseUrl = apiUrl
    this.auth = btoa(`${username}:${password}`)
  }

  // Get all posts
  async getPosts(params: {
    page?: number
    per_page?: number
    status?: string
    search?: string
    orderby?: string
    order?: 'asc' | 'desc'
  } = {}): Promise<WordPressPost[]> {
    try {
      const queryParams = new URLSearchParams()
      
      // Set default params
      queryParams.set('per_page', (params.per_page || 10).toString())
      queryParams.set('page', (params.page || 1).toString())
      
      // Add other params if provided
      if (params.status) queryParams.set('status', params.status)
      if (params.search) queryParams.set('search', params.search)
      if (params.orderby) queryParams.set('orderby', params.orderby)
      if (params.order) queryParams.set('order', params.order)

      const response = await fetch(`${this.baseUrl}/posts?${queryParams}`, {
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching WordPress posts:', error)
      throw error
    }
  }

  // Get single post
  async getPost(id: number): Promise<WordPressPost> {
    try {
      const response = await fetch(`${this.baseUrl}/posts/${id}`, {
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching WordPress post:', error)
      throw error
    }
  }

  // Create new post
  async createPost(postData: {
    title: string
    content: string
    excerpt?: string
    status?: 'publish' | 'draft' | 'private' | 'pending'
    categories?: number[]
    tags?: number[]
    featured_media?: number
  }): Promise<WordPressPost> {
    try {
      const response = await fetch(`${this.baseUrl}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt || '',
          status: postData.status || 'draft',
          categories: postData.categories || [],
          tags: postData.tags || [],
          featured_media: postData.featured_media || 0,
        }),
      })

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating WordPress post:', error)
      throw error
    }
  }

  // Update existing post
  async updatePost(id: number, postData: {
    title?: string
    content?: string
    excerpt?: string
    status?: 'publish' | 'draft' | 'private' | 'pending'
    categories?: number[]
    tags?: number[]
    featured_media?: number
  }): Promise<WordPressPost> {
    try {
      const response = await fetch(`${this.baseUrl}/posts/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating WordPress post:', error)
      throw error
    }
  }

  // Delete post
  async deletePost(id: number, force: boolean = false): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/posts/${id}?force=${force}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error('Error deleting WordPress post:', error)
      throw error
    }
  }

  // Upload media file
  async uploadMedia(file: File): Promise<any> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${this.baseUrl}/media`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.auth}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error uploading media to WordPress:', error)
      throw error
    }
  }

  // Get categories
  async getCategories(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/categories`, {
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching WordPress categories:', error)
      throw error
    }
  }

  // Get tags
  async getTags(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tags`, {
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching WordPress tags:', error)
      throw error
    }
  }
}

// Export singleton instance
export const wordpressService = new WordPressService()

// Utility functions
export const WordPressUtils = {
  // Strip HTML tags from content
  stripHtml: (html: string): string => {
    return html.replace(/<[^>]*>/g, '')
  },

  // Extract image URLs from content
  extractImages: (content: string): string[] => {
    const imgRegex = /<img[^>]+src="([^">]+)"/g
    const images: string[] = []
    let match

    while ((match = imgRegex.exec(content)) !== null) {
      images.push(match[1])
    }

    return images
  },

  // Calculate reading time
  calculateReadingTime: (content: string): number => {
    const words = WordPressUtils.stripHtml(content).split(' ').length
    return Math.ceil(words / 200) // Average reading speed: 200 words per minute
  },

  // Format WordPress date
  formatDate: (wpDate: string): string => {
    return new Date(wpDate).toISOString().split('T')[0]
  }
}

// Convert Event to WordPress format
// Bidirectional sync functions
export async function syncFromWordPressToLocal(
  localItems: any[],
  setLocalItems: (items: any[]) => void,
  convertFunction: (wpPost: WordPressPost) => any,
  storageKey: string
): Promise<{ 
  added: number,
  updated: number,
  errors: string[]
}> {
  const errors: string[] = []
  let added = 0
  let updated = 0

  try {
    // Get WordPress settings from localStorage
    const wpSettings = JSON.parse(localStorage.getItem('wordpressSettings') || '{}')
    if (!wpSettings.apiUrl || !wpSettings.username || !wpSettings.password) {
      throw new Error('WordPress settings not configured')
    }

    // Create service instance with dynamic settings
    const service = new WordPressService()
    service.setCredentials(wpSettings.apiUrl, wpSettings.username, wpSettings.password)

    // Fetch all published posts from WordPress
    const wpPosts = await service.getPosts({
      status: 'publish',
      per_page: 100,
      orderby: 'modified',
      order: 'desc'
    })

    // Create a map of existing local items by wpId
    const localItemsMap = new Map()
    localItems.forEach(item => {
      if (item.wpId) {
        localItemsMap.set(item.wpId, item)
      }
    })

    const updatedItems = [...localItems]

    for (const wpPost of wpPosts) {
      try {
        const existingItem = localItemsMap.get(wpPost.id)
        const convertedItem = convertFunction(wpPost)
        convertedItem.wpId = wpPost.id

        if (existingItem) {
          // Update existing item if WordPress version is newer
          const wpModified = new Date(wpPost.modified)
          const localModified = new Date(existingItem.updatedAt || existingItem.createdAt || 0)
          
          if (wpModified > localModified) {
            const index = updatedItems.findIndex(item => item.wpId === wpPost.id)
            if (index !== -1) {
              updatedItems[index] = {
                ...updatedItems[index],
                ...convertedItem,
                id: existingItem.id, // Keep local ID
                updatedAt: new Date().toISOString()
              }
              updated++
            }
          }
        } else {
          // Add new item
          const newId = Math.max(...updatedItems.map(item => item.id || 0), 0) + 1
          updatedItems.unshift({
            ...convertedItem,
            id: newId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
          added++
        }
      } catch (error) {
        errors.push(`Error processing post ${wpPost.id}: ${error}`)
      }
    }

    // Update local storage and state
    setLocalItems(updatedItems)
    localStorage.setItem(storageKey, JSON.stringify(updatedItems))

    return { added, updated, errors }
  } catch (error) {
    errors.push(`Sync error: ${error}`)
    return { added: 0, updated: 0, errors }
  }
}

// Enhanced WordPress Service with dynamic credentials
export class EnhancedWordPressService extends WordPressService {
  setCredentials(apiUrl: string, username: string, password: string) {
    this.baseUrl = apiUrl
    this.auth = btoa(`${username}:${password}`)
  }

  // Check for new/updated posts since last sync
  async getUpdatedPosts(since: string): Promise<WordPressPost[]> {
    try {
      const response = await fetch(`${this.baseUrl}/posts?modified_after=${since}&per_page=100`, {
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching updated WordPress posts:', error)
      throw error
    }
  }

  // Get posts by category
  async getPostsByCategory(categoryId: number): Promise<WordPressPost[]> {
    try {
      const response = await fetch(`${this.baseUrl}/posts?categories=${categoryId}&per_page=100`, {
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching posts by category:', error)
      throw error
    }
  }
}

export function convertEventToWordPressFormat(event: any): {
  title: string
  content: string
  excerpt: string
  status: 'publish' | 'draft' | 'private' | 'pending'
} {
  const statusMap = {
    'upcoming': 'publish' as const,
    'ongoing': 'publish' as const,
    'completed': 'publish' as const,
    'cancelled': 'draft' as const
  }

  // Create well-formatted HTML content for the event
  const htmlContent = `
    <div class="event-content">
      ${event.image ? `
      <div class="featured-image">
        <img src="${event.image}" alt="${event.title}" style="max-width: 100%; height: auto; margin-bottom: 20px;" />
      </div>
      ` : ''}
      
      <div class="event-description">
        <p><strong>Mô tả:</strong> ${event.description}</p>
        ${event.descriptionEn ? `<p><strong>Description (EN):</strong> ${event.descriptionEn}</p>` : ''}
      </div>
      
      <div class="event-metadata" style="background: #f8f9fa; padding: 15px; margin: 20px 0; border-left: 4px solid #007cba;">
        <p><strong>📅 Ngày tổ chức:</strong> ${event.date}</p>
        <p><strong>⏰ Thời gian:</strong> ${event.time}</p>
        <p><strong>📍 Địa điểm:</strong> ${event.location}</p>
        ${event.locationEn ? `<p><strong>📍 Location (EN):</strong> ${event.locationEn}</p>` : ''}
        <p><strong>👥 Số lượng tham gia:</strong> ${event.participants}</p>
        ${event.participantsEn ? `<p><strong>👥 Participants (EN):</strong> ${event.participantsEn}</p>` : ''}
        <p><strong>🏷️ Danh mục:</strong> ${event.category || 'Sự kiện'}</p>
        <p><strong>📊 Trạng thái:</strong> ${
          event.status === 'upcoming' ? 'Sắp diễn ra' :
          event.status === 'ongoing' ? 'Đang diễn ra' :
          event.status === 'completed' ? 'Đã kết thúc' :
          event.status === 'cancelled' ? 'Đã hủy' : 'Không xác định'
        }</p>
        <p><strong>👁️ Lượt xem:</strong> ${event.views || 0}</p>
        <p><strong>✅ Đăng ký:</strong> ${event.registrations || 0}</p>
      </div>
    </div>
  `.trim()

  return {
    title: event.title,
    content: htmlContent,
    excerpt: event.description.substring(0, 150) + (event.description.length > 150 ? '...' : ''),
    status: statusMap[event.status as keyof typeof statusMap] || 'draft'
  }
}