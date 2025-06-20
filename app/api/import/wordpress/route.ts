import { NextRequest, NextResponse } from 'next/server'
import { dataImportService } from '@/lib/dataImportService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'import-all':
        console.log('🔄 API: Starting full import from WordPress...')
        const importResult = await dataImportService.importAllPosts()
        
        return NextResponse.json({
          success: importResult.success,
          data: importResult.data,
          message: importResult.message,
          stats: importResult.stats,
          timestamp: new Date().toISOString()
        })

      case 'import-recent':
        const since = searchParams.get('since')
        console.log('🔄 API: Starting incremental import from WordPress...')
        
        const recentResult = await dataImportService.importRecentPosts(since || undefined)
        
        return NextResponse.json({
          success: recentResult.success,
          data: recentResult.data,
          message: recentResult.message,
          stats: recentResult.stats,
          timestamp: new Date().toISOString()
        })

      case 'stats':
        const stats = dataImportService.getStats()
        
        return NextResponse.json({
          success: true,
          stats,
          message: 'Import statistics retrieved successfully'
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: import-all, import-recent, or stats'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('❌ Import API error:', error)
    
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'export-post':
        if (!data || !data.title) {
          return NextResponse.json({
            success: false,
            error: 'Post data with title is required'
          }, { status: 400 })
        }

        console.log(`🔄 API: Exporting post "${data.title}" to WordPress...`)
        const exportResult = await dataImportService.exportPostToWordPress(data)
        
        return NextResponse.json({
          success: exportResult.success,
          wpPostId: exportResult.wpPostId,
          message: exportResult.message,
          timestamp: new Date().toISOString()
        })

      case 'sync-bidirectional':
        const localPosts = data?.posts || []
        console.log('🔄 API: Starting bidirectional sync...')
        
        const syncResult = await dataImportService.syncBidirectional(localPosts)
        
        return NextResponse.json({
          success: syncResult.success,
          imported: syncResult.imported,
          exported: syncResult.exported,
          message: syncResult.message,
          timestamp: new Date().toISOString()
        })

      case 'reset-stats':
        dataImportService.resetStats()
        
        return NextResponse.json({
          success: true,
          message: 'Import statistics reset successfully',
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: export-post, sync-bidirectional, or reset-stats'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('❌ Import API POST error:', error)
    
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 