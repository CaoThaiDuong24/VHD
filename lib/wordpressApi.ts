import { wpCache } from './cacheService'

// WordPress API configuration
const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://vhdcom.local/wp-json/wp/v2'
const WORDPRESS_USERNAME = process.env.WORDPRESS_USERNAME || 'admin'
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
    // Ensure the API URL ends with the correct WordPress REST API path
    let cleanUrl = apiUrl.replace(/\/+$/, '') // Remove trailing slashes
    
    // Add wp-json/wp/v2 if not already present
    if (!cleanUrl.includes('/wp-json/wp/v2')) {
      cleanUrl += '/wp-json/wp/v2'
    }
    
    this.baseUrl = cleanUrl
    this.auth = btoa(`${username}:${password}`)
    
    console.log('🔧 WordPress API URL set to:', cleanUrl)
  }

  // Test WordPress connection (with caching)
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    // Check cache first
    const cached = wpCache.getCachedConnectionStatus()
    if (cached) {
      console.log('🎯 Using cached connection status')
      return cached
    }

    try {
      console.log('🔍 Testing WordPress connection to:', this.baseUrl)
      
      // First, test if the base URL is reachable
      const baseResponse = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!baseResponse.ok) {
        if (baseResponse.status === 404) {
          return {
            success: false,
            message: `WordPress REST API không tìm thấy tại: ${this.baseUrl}\n\nVui lòng kiểm tra:\n• URL WordPress đúng không?\n• REST API đã được bật?\n• Permalinks đã cấu hình?`
          }
        }
        return {
          success: false,
          message: `Không thể kết nối tới WordPress: HTTP ${baseResponse.status}`
        }
      }

      // Test authentication by getting posts
      const postsResponse = await fetch(`${this.baseUrl}/posts?per_page=1`, {
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/json',
        },
      })

      if (!postsResponse.ok) {
        if (postsResponse.status === 401) {
          return {
            success: false,
            message: 'Lỗi xác thực WordPress. Vui lòng kiểm tra:\n• Username đúng không?\n• Application Password đúng không?\n• User có quyền truy cập?'
          }
        }
        const errorText = await postsResponse.text()
        return {
          success: false,
          message: `Lỗi WordPress API: ${postsResponse.status} - ${errorText}`
        }
      }

      const posts = await postsResponse.json()
      const result = {
        success: true,
        message: `✅ Kết nối WordPress thành công!\n🔗 URL: ${this.baseUrl}\n📊 Tìm thấy ${posts.length > 0 ? 'posts' : 'không có posts nào'}`,
        details: {
          url: this.baseUrl,
          postsFound: posts.length
        }
      }

      // Cache successful connection
      wpCache.cacheConnectionStatus(result)
      return result

    } catch (error) {
      console.error('❌ WordPress connection test failed:', error)
      return {
        success: false,
        message: `Lỗi kết nối: ${(error as Error).message}\n\nVui lòng kiểm tra:\n• Internet connection\n• WordPress server đang chạy\n• Firewall/CORS settings`
      }
    }
  }

  // Get all posts (with caching)
  async getPosts(params: {
    page?: number
    per_page?: number
    status?: string
    search?: string
    orderby?: string
    order?: 'asc' | 'desc'
    useCache?: boolean
  } = {}): Promise<WordPressPost[]> {
    // Generate cache key based on params
    const cacheKey = `posts-${JSON.stringify(params)}`
    
    // Check cache first (unless explicitly disabled)
    if (params.useCache !== false) {
      const cached = wpCache.get<WordPressPost[]>(cacheKey)
      if (cached) {
        console.log(`🎯 Using cached posts for params: ${JSON.stringify(params)}`)
        return cached
      }
    }
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

      console.log('🔍 Fetching from:', `${this.baseUrl}/posts?${queryParams}`)
      
      const response = await fetch(`${this.baseUrl}/posts?${queryParams}`, {
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ WordPress API Error Response:', errorText)
        
        if (response.status === 404) {
          throw new Error(`WordPress REST API không tìm thấy. Kiểm tra:\n1. URL: ${this.baseUrl}\n2. WordPress REST API đã bật\n3. Permalinks đã cấu hình`)
        } else if (response.status === 401) {
          throw new Error('Lỗi xác thực. Kiểm tra username/password WordPress')
        } else {
          throw new Error(`WordPress API error ${response.status}: ${errorText}`)
        }
      }

      const posts = await response.json()
      console.log(`✅ Fetched ${posts.length} posts from WordPress`)
      
      // Cache the results
      if (params.useCache !== false) {
        wpCache.set(cacheKey, posts, 5 * 60 * 1000) // Cache for 5 minutes
      }
      
      return posts
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

  // Create new post with enhanced error handling and validation
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
      // Validate required fields
      if (!postData.title || postData.title.trim() === '') {
        throw new Error('Tiêu đề bài viết không được để trống')
      }
      
      if (!postData.content || postData.content.trim() === '') {
        throw new Error('Nội dung bài viết không được để trống')
      }
      
      // Clean and prepare data
      const cleanTitle = postData.title.trim()
      const cleanContent = postData.content.trim()
      const cleanExcerpt = postData.excerpt ? postData.excerpt.trim() : ''
      
      console.log('🔍 Creating WordPress post with data:', {
        title: cleanTitle,
        status: postData.status || 'draft',
        contentLength: cleanContent.length,
        excerptLength: cleanExcerpt.length,
        hasCategories: postData.categories && postData.categories.length > 0,
        hasTags: postData.tags && postData.tags.length > 0
      })
      
      // Prepare request body with cleaned data
      const requestBody = {
        title: cleanTitle,
        content: cleanContent,
        excerpt: cleanExcerpt,
        status: postData.status || 'draft',
        categories: postData.categories || [],
        tags: postData.tags || [],
        featured_media: postData.featured_media || 0,
        // Additional WordPress fields for better SEO and formatting
        comment_status: 'open',
        ping_status: 'open',
        format: 'standard'
      }
      
      console.log('📡 Sending request to:', `${this.baseUrl}/posts`)
      console.log('🔐 Auth header:', this.auth ? 'SET' : 'NOT SET')
      console.log('📝 Request body preview:', {
        title: requestBody.title,
        status: requestBody.status,
        contentPreview: requestBody.content.substring(0, 100) + '...',
        excerptPreview: requestBody.excerpt.substring(0, 50) + '...'
      })
      
      const response = await fetch(`${this.baseUrl}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Frontend-WordPress-Sync/1.0'
        },
        body: JSON.stringify(requestBody),
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ WordPress API Error Response:', errorText)
        
        let errorMessage = `WordPress API error: ${response.status}`
        let errorDetails = ''
        
        try {
          const errorData = JSON.parse(errorText)
          console.error('❌ Parsed error data:', errorData)
          
          if (errorData.message) {
            errorMessage = errorData.message
          }
          if (errorData.code) {
            errorMessage = `${errorData.code}: ${errorMessage}`
          }
          if (errorData.data && errorData.data.details) {
            errorDetails = JSON.stringify(errorData.data.details)
          }
        } catch (e) {
          errorMessage = `${errorMessage} - ${errorText}`
        }
        
        // Enhanced error messages based on status codes
        if (response.status === 401) {
          errorMessage = 'Lỗi xác thực WordPress. Kiểm tra username/password hoặc tạo Application Password mới.\n\n' +
                        '🔧 Cách tạo Application Password:\n' +
                        '1. Vào: http://vhdcom.local/wp-admin/profile.php\n' +
                        '2. Cuộn xuống "Application Passwords"\n' +
                        '3. Tạo password mới với tên "Frontend Sync"\n' +
                        '4. Sử dụng password đó thay cho password thường'
        } else if (response.status === 403) {
          errorMessage = 'Không có quyền tạo bài viết. Kiểm tra permissions của user WordPress.\n\n' +
                        '🔧 Cách fix:\n' +
                        '1. Đảm bảo user có role Editor hoặc Administrator\n' +
                        '2. Kiểm tra plugin bảo mật có block REST API không\n' +
                        '3. Kiểm tra .htaccess có rules chặn API không'
        } else if (response.status === 404) {
          errorMessage = 'WordPress REST API không tìm thấy.\n\n' +
                        '🔧 Cách fix:\n' +
                        '1. Kiểm tra URL WordPress đúng không\n' +
                        '2. Đảm bảo permalinks đã được cấu hình\n' +
                        '3. Kiểm tra REST API đã được enable'
        } else if (response.status === 500) {
          errorMessage = 'Lỗi server WordPress. Kiểm tra WordPress error logs.\n\n' +
                        '🔧 Debug:\n' +
                        '1. Kiểm tra wp-content/debug.log\n' +
                        '2. Tắt tất cả plugins thử lại\n' +
                        '3. Chuyển về theme mặc định'
        }
        
        if (errorDetails) {
          errorMessage += `\n\n📋 Chi tiết lỗi: ${errorDetails}`
        }
        
        throw new Error(errorMessage)
      }

      const createdPost = await response.json()
      console.log('✅ WordPress post created successfully:', {
        id: createdPost.id,
        title: createdPost.title?.rendered,
        status: createdPost.status,
        link: createdPost.link,
        date: createdPost.date
      })
      
      // Clear relevant caches after successful creation
      wpCache.clearCache('posts-')
      
      return createdPost
    } catch (error) {
      console.error('❌ Error creating WordPress post:', error)
      console.error('❌ Error stack:', (error as Error).stack)
      throw error
    }
  }

  // Update existing post with enhanced validation and error handling
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
      if (!id || id <= 0) {
        throw new Error('ID bài viết không hợp lệ')
      }

      // Clean data if provided
      const cleanData: any = {}
      if (postData.title !== undefined) {
        cleanData.title = postData.title.trim()
      }
      if (postData.content !== undefined) {
        cleanData.content = postData.content.trim()
      }
      if (postData.excerpt !== undefined) {
        cleanData.excerpt = postData.excerpt.trim()
      }
      if (postData.status !== undefined) {
        cleanData.status = postData.status
      }
      if (postData.categories !== undefined) {
        cleanData.categories = postData.categories
      }
      if (postData.tags !== undefined) {
        cleanData.tags = postData.tags
      }
      if (postData.featured_media !== undefined) {
        cleanData.featured_media = postData.featured_media
      }

      console.log('🔄 Updating WordPress post:', {
        id,
        fieldsToUpdate: Object.keys(cleanData),
        hasTitle: !!cleanData.title,
        hasContent: !!cleanData.content,
        status: cleanData.status
      })

      const response = await fetch(`${this.baseUrl}/posts/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Frontend-WordPress-Sync/1.0'
        },
        body: JSON.stringify(cleanData),
      })

      console.log('📡 Update response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ WordPress update error:', errorText)
        
        let errorMessage = `WordPress API error: ${response.status}`
        
        if (response.status === 401) {
          errorMessage = 'Lỗi xác thực khi cập nhật bài viết'
        } else if (response.status === 403) {
          errorMessage = 'Không có quyền cập nhật bài viết này'
        } else if (response.status === 404) {
          errorMessage = `Không tìm thấy bài viết với ID: ${id}`
        }
        
        throw new Error(errorMessage)
      }

      const updatedPost = await response.json()
      console.log('✅ WordPress post updated successfully:', {
        id: updatedPost.id,
        title: updatedPost.title?.rendered,
        status: updatedPost.status
      })

      // Clear relevant caches
      wpCache.clearCache('posts-')
      wpCache.delete(`wp-post-${id}`)

      return updatedPost
    } catch (error) {
      console.error('❌ Error updating WordPress post:', error)
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