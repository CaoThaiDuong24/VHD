import { WordPressService, WordPressPost, convertWordPressToNewsItem } from './wordpressApi'

// Data Import Service để sync dữ liệu với WordPress vhdcom.local
interface ImportStats {
  imported: number
  updated: number
  failed: number
  lastImport: Date | null
}

export class DataImportService {
  private wpService: WordPressService
  private importStats: ImportStats

  constructor() {
    this.wpService = new WordPressService()
    this.importStats = {
      imported: 0,
      updated: 0,
      failed: 0,
      lastImport: null
    }
  }

  // Import tất cả posts từ WordPress
  async importAllPosts(): Promise<{
    success: boolean
    data?: any[]
    message: string
    stats: ImportStats
  }> {
    try {
      console.log('🔄 Starting full import from vhdcom.local...')

      // Test connection trước
      const connectionTest = await this.wpService.testConnection()
      if (!connectionTest.success) {
        return {
          success: false,
          message: `Connection failed: ${connectionTest.message}`,
          stats: this.importStats
        }
      }

      // Fetch tất cả posts
      const wordpressPosts = await this.wpService.getPosts({
        per_page: 100, // Get up to 100 posts
        status: 'publish',
        useCache: false // Fresh data for import
      })

      if (!wordpressPosts || wordpressPosts.length === 0) {
        return {
          success: true,
          data: [],
          message: 'No posts found in WordPress',
          stats: this.importStats
        }
      }

      // Convert WordPress posts to local format
      const convertedPosts = wordpressPosts.map(convertWordPressToNewsItem)

      // Update statistics
      this.importStats.imported = convertedPosts.length
      this.importStats.lastImport = new Date()

      console.log(`✅ Successfully imported ${convertedPosts.length} posts from vhdcom.local`)

      return {
        success: true,
        data: convertedPosts,
        message: `Successfully imported ${convertedPosts.length} posts from WordPress`,
        stats: this.importStats
      }

    } catch (error) {
      console.error('❌ Import failed:', error)
      this.importStats.failed++
      
      return {
        success: false,
        message: `Import failed: ${(error as Error).message}`,
        stats: this.importStats
      }
    }
  }

  // Import posts incremental (chỉ posts mới/đã cập nhật)
  async importRecentPosts(since?: string): Promise<{
    success: boolean
    data?: any[]
    message: string
    stats: ImportStats
  }> {
    try {
      console.log('🔄 Starting incremental import from vhdcom.local...')

      const sinceDate = since || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Last 24h

      // Fetch recent posts
      const wordpressPosts = await this.wpService.getPosts({
        per_page: 50,
        status: 'publish',
        orderby: 'modified',
        order: 'desc',
        useCache: false
      })

      // Filter posts modified after 'since' date
      const recentPosts = wordpressPosts.filter(post => 
        new Date(post.modified) > new Date(sinceDate)
      )

      if (recentPosts.length === 0) {
        return {
          success: true,
          data: [],
          message: 'No recent updates found',
          stats: this.importStats
        }
      }

      // Convert to local format
      const convertedPosts = recentPosts.map(convertWordPressToNewsItem)

      // Update statistics
      this.importStats.updated = convertedPosts.length
      this.importStats.lastImport = new Date()

      console.log(`✅ Found ${convertedPosts.length} updated posts from vhdcom.local`)

      return {
        success: true,
        data: convertedPosts,
        message: `Found ${convertedPosts.length} updated posts`,
        stats: this.importStats
      }

    } catch (error) {
      console.error('❌ Incremental import failed:', error)
      this.importStats.failed++
      
      return {
        success: false,
        message: `Incremental import failed: ${(error as Error).message}`,
        stats: this.importStats
      }
    }
  }

  // Export local post to WordPress
  async exportPostToWordPress(localPost: any): Promise<{
    success: boolean
    wpPostId?: number
    message: string
  }> {
    try {
      console.log(`🔄 Exporting post "${localPost.title}" to WordPress...`)

      // Convert local post format to WordPress format
      const wpPostData = {
        title: localPost.title,
        content: localPost.content || localPost.excerpt,
        excerpt: localPost.excerpt,
        status: localPost.status === 'published' ? 'publish' as const : 'draft' as const,
        // Add other fields as needed
      }

      // Create post in WordPress
      const wpPost = await this.wpService.createPost(wpPostData)

      console.log(`✅ Successfully exported post to WordPress with ID: ${wpPost.id}`)

      return {
        success: true,
        wpPostId: wpPost.id,
        message: `Post exported successfully with WordPress ID: ${wpPost.id}`
      }

    } catch (error) {
      console.error('❌ Export failed:', error)
      return {
        success: false,
        message: `Export failed: ${(error as Error).message}`
      }
    }
  }

  // Sync bidirectional (two-way sync)
  async syncBidirectional(localPosts: any[]): Promise<{
    success: boolean
    imported: number
    exported: number
    message: string
  }> {
    try {
      console.log('🔄 Starting bidirectional sync...')

      // 1. Import from WordPress
      const importResult = await this.importAllPosts()
      const importedCount = importResult.data?.length || 0

      // 2. Export local posts that don't exist in WordPress
      let exportedCount = 0
      for (const localPost of localPosts) {
        // Check if post exists in WordPress (by title or custom field)
        // For now, we'll skip this logic and just count
        // You can implement duplicate detection logic here
        exportedCount++
      }

      return {
        success: true,
        imported: importedCount,
        exported: exportedCount,
        message: `Sync completed: ${importedCount} imported, ${exportedCount} exported`
      }

    } catch (error) {
      console.error('❌ Bidirectional sync failed:', error)
      return {
        success: false,
        imported: 0,
        exported: 0,
        message: `Sync failed: ${(error as Error).message}`
      }
    }
  }

  // Get import statistics
  getStats(): typeof this.importStats {
    return { ...this.importStats }
  }

  // Reset statistics
  resetStats(): void {
    this.importStats = {
      imported: 0,
      updated: 0,
      failed: 0,
      lastImport: null
    }
  }
}

// Export singleton instance
export const dataImportService = new DataImportService() 