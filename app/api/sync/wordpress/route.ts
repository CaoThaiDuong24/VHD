import { NextRequest, NextResponse } from 'next/server'
import { WordPressService, convertWordPressToNewsItem } from '@/lib/wordpressApi'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get('action') || 'fetch'
  const lastSync = searchParams.get('since')
  
  try {
    const wpService = new WordPressService()
    
    // 🔧 CRITICAL FIX: Load settings from environment/localStorage equivalent  
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://vhdcom.local'
    const wpUsername = process.env.WORDPRESS_USERNAME || 'duong'
    const wpPassword = process.env.WORDPRESS_PASSWORD || 'kUgT g3ox OJcE yvN3 BCgp tyyZ'
    
    // Set credentials explicitly before any operations
    wpService.setCredentials(wpUrl, wpUsername, wpPassword)
    
    // Test connection first
    const connectionTest = await wpService.testConnection()
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'WordPress connection failed',
        details: connectionTest.message
      }, { status: 503 })
    }

    switch (action) {
      case 'fetch':
        const posts = await wpService.getPosts({
          per_page: 100,
          orderby: 'modified',
          order: 'desc'
        })
        
        const newsItems = posts.map(convertWordPressToNewsItem)
        
        return NextResponse.json({
          success: true,
          data: newsItems,
          count: newsItems.length,
          lastSync: new Date().toISOString()
        })

      case 'fetch-updated':
        if (!lastSync) {
          return NextResponse.json({
            success: false,
            error: 'Missing "since" parameter for incremental sync'
          }, { status: 400 })
        }
        
        const updatedPosts = await wpService.getPosts({
          per_page: 100,
          orderby: 'modified',
          order: 'desc',
          // WordPress date filter would be added here
        })
        
        const updatedItems = updatedPosts
          .filter(post => new Date(post.modified) > new Date(lastSync))
          .map(convertWordPressToNewsItem)
        
        return NextResponse.json({
          success: true,
          data: updatedItems,
          count: updatedItems.length,
          lastSync: new Date().toISOString()
        })

      case 'health':
        return NextResponse.json({
          success: true,
          status: 'WordPress API connection healthy',
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action parameter'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('❌ WordPress sync API error:', error)
    return NextResponse.json({
      success: false,
      error: 'WordPress sync failed',
      details: (error as Error).message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    const wpService = new WordPressService()
    
    // 🔧 CRITICAL FIX: Load settings from environment/localStorage equivalent  
    // Since this is server-side, check if we have proper environment variables
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://vhdcom.local'
    const wpUsername = process.env.WORDPRESS_USERNAME || 'duong'
    const wpPassword = process.env.WORDPRESS_PASSWORD || 'kUgT g3ox OJcE yvN3 BCgp tyyZ'
    
    // Set credentials explicitly before any operations
    wpService.setCredentials(wpUrl, wpUsername, wpPassword)
    
    console.log('🔧 WordPress API configured:', {
      url: wpUrl,
      username: wpUsername,
      passwordSet: !!wpPassword
    })

    switch (action) {
      case 'create':
        // Single post creation
        if (!data) {
          return NextResponse.json({
            success: false,
            error: 'Missing data for post creation'
          }, { status: 400 })
        }

        try {
          console.log('🚀 Creating WordPress post:', data.title)
          
          // Enhanced content mapping with fallbacks
          const postData = {
            title: data.title || data.titleEn || 'Untitled Post',
            content: data.content || data.detailContent || data.detailContentEn || data.description || data.descriptionEn || 'Nội dung bài viết được tạo từ frontend.',
            excerpt: data.excerpt || data.description || data.descriptionEn || '',
            status: (data.status === 'published' || data.status === 'publish' ? 'publish' : 'draft') as 'publish' | 'draft'
          }
          
          console.log('📝 Post data:', {
            title: postData.title,
            contentLength: postData.content.length,
            status: postData.status
          })
          
          const newPost = await wpService.createPost(postData)
          
          console.log('✅ WordPress post created:', {
            id: newPost.id,
            title: newPost.title?.rendered,
            status: newPost.status
          })
          
          return NextResponse.json({
            success: true,
            data: newPost,
            wpId: newPost.id,
            message: 'Post created successfully'
          })
          
        } catch (error) {
          console.error('❌ Error creating WordPress post:', error)
          return NextResponse.json({
            success: false,
            error: 'Failed to create WordPress post',
            details: (error as Error).message
          }, { status: 500 })
        }

      case 'update':
        // Single post update
        if (!data || !data.wpId) {
          return NextResponse.json({
            success: false,
            error: 'Missing data or wpId for post update'
          }, { status: 400 })
        }

        try {
          // Enhanced content mapping with fallbacks
          const postData = {
            title: data.title || data.titleEn || 'Untitled Post',
            content: data.content || data.detailContent || data.detailContentEn || data.description || data.descriptionEn || 'Nội dung bài viết được cập nhật từ frontend.',
            excerpt: data.excerpt || data.description || data.descriptionEn || '',
            status: (data.status === 'published' || data.status === 'publish' ? 'publish' : 'draft') as 'publish' | 'draft'
          }
          
          const updatedPost = await wpService.updatePost(data.wpId, postData)
          
          return NextResponse.json({
            success: true,
            data: updatedPost,
            message: 'Post updated successfully'
          })
          
        } catch (error) {
          console.error('❌ Error updating WordPress post:', error)
          return NextResponse.json({
            success: false,
            error: 'Failed to update WordPress post',
            details: (error as Error).message
          }, { status: 500 })
        }

      case 'delete':
        // Single post deletion
        if (!data || !data.wpId) {
          return NextResponse.json({
            success: false,
            error: 'Missing wpId for post deletion'
          }, { status: 400 })
        }

        try {
          await wpService.deletePost(data.wpId)
          
          return NextResponse.json({
            success: true,
            message: 'Post deleted successfully'
          })
          
        } catch (error) {
          console.error('❌ Error deleting WordPress post:', error)
          return NextResponse.json({
            success: false,
            error: 'Failed to delete WordPress post',
            details: (error as Error).message
          }, { status: 500 })
        }

      case 'push-to-wordpress':
        // Batch operations
        if (!data || !Array.isArray(data)) {
          return NextResponse.json({
            success: false,
            error: 'Invalid data format'
          }, { status: 400 })
        }

        const results = []
        for (const item of data) {
          try {
            if (item.wpId) {
              // Update existing post
              await wpService.updatePost(item.wpId, {
                title: item.title,
                content: item.content || item.description,
                excerpt: item.excerpt,
                status: item.status === 'published' ? 'publish' : 'draft'
              })
              results.push({ id: item.id, status: 'updated' })
            } else {
              // Create new post
              const newPost = await wpService.createPost({
                title: item.title,
                content: item.content || item.description,
                excerpt: item.excerpt,
                status: item.status === 'published' ? 'publish' : 'draft'
              })
              results.push({ id: item.id, status: 'created', wpId: newPost.id })
            }
          } catch (error) {
            results.push({ 
              id: item.id, 
              status: 'error', 
              error: (error as Error).message 
            })
          }
        }

        return NextResponse.json({
          success: true,
          results,
          synced: results.filter(r => r.status !== 'error').length,
          errors: results.filter(r => r.status === 'error').length
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('❌ WordPress sync POST error:', error)
    return NextResponse.json({
      success: false,
      error: 'WordPress sync failed',
      details: (error as Error).message
    }, { status: 500 })
  }
} 