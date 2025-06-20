// Example usage of WordPress integration functions in newsData.ts
import { 
  postNewsToWordPress, 
  getNewsFromWordPress, 
  updateNewsInWordPress, 
  deleteNewsFromWordPress,
  syncNewsWithWordPress,
  testWordPressConnection,
  type NewsItem 
} from './newsData'

// Example: Test WordPress connection
export async function exampleTestConnection() {
  try {
    const result = await testWordPressConnection()
    if (result.success) {
      console.log('✅', result.message)
      console.log(`📊 Posts found: ${result.postsCount}`)
    } else {
      console.log('❌', result.message)
    }
    return result
  } catch (error) {
    console.error('Connection test failed:', error)
    return { success: false, message: (error as Error).message }
  }
}

// Example: Get all news from WordPress
export async function exampleGetNewsFromWP() {
  try {
    const wpNews = await getNewsFromWordPress()
    console.log(`📥 Retrieved ${wpNews.length} news items from WordPress:`)
    
    wpNews.forEach((news, index) => {
      console.log(`${index + 1}. ${news.title} (WP ID: ${news.wpId})`)
    })
    
    return wpNews
  } catch (error) {
    console.error('❌ Failed to get news from WordPress:', error)
    return []
  }
}

// Example: Post a new news item to WordPress
export async function examplePostNewsToWP() {
  const sampleNews: NewsItem = {
    id: Date.now(), // Temporary local ID
    title: "Tin tức thử nghiệm từ Next.js",
    titleEn: "Test News from Next.js",
    description: "Đây là tin tức thử nghiệm được tạo từ ứng dụng Next.js và tự động đồng bộ lên WordPress.",
    descriptionEn: "This is a test news created from Next.js app and automatically synced to WordPress.",
    image: "/images/placeholder.jpg",
    category: "Thử nghiệm",
    categoryEn: "Testing",
    date: new Date().toLocaleDateString('vi-VN'),
    gradient: "from-blue-500 to-green-500",
    location: "Hà Nội",
    locationEn: "Hanoi",
    participants: "100+ người tham gia",
    participantsEn: "100+ participants",
    views: 0,
    readingTime: 3,
    status: "published",
    featured: false,
    tags: ["test", "nextjs", "wordpress"],
    author: "Hệ thống Next.js",
    authorEn: "Next.js System",
    detailContent: `
      <h2>Nội dung chi tiết</h2>
      <p>Đây là nội dung chi tiết của tin tức thử nghiệm. Tin tức này được tạo tự động từ ứng dụng Next.js.</p>
      
      <h3>Các tính năng đã test:</h3>
      <ul>
        <li>✅ Tạo bài viết WordPress từ Next.js</li>
        <li>✅ Chuyển đổi format dữ liệu</li>
        <li>✅ Hiển thị metadata đầy đủ</li>
        <li>✅ Styling HTML content</li>
      </ul>
      
      <p><strong>Thời gian tạo:</strong> ${new Date().toLocaleString('vi-VN')}</p>
    `,
    detailContentEn: `
      <h2>Detailed Content</h2>
      <p>This is the detailed content of the test news. This news was automatically created from Next.js application.</p>
      
      <h3>Features tested:</h3>
      <ul>
        <li>✅ Create WordPress post from Next.js</li>
        <li>✅ Data format conversion</li>
        <li>✅ Display complete metadata</li>
        <li>✅ HTML content styling</li>
      </ul>
      
      <p><strong>Created at:</strong> ${new Date().toLocaleString('en-US')}</p>
    `,
    gallery: [
      {
        id: "1",
        src: "/images/test-image-1.jpg",
        alt: "Test image 1",
        caption: "Ảnh thử nghiệm 1"
      },
      {
        id: "2", 
        src: "/images/test-image-2.jpg",
        alt: "Test image 2",
        caption: "Ảnh thử nghiệm 2"
      }
    ]
  }

  try {
    const result = await postNewsToWordPress(sampleNews)
    console.log('✅ Sample news posted to WordPress!')
    console.log(`📋 WordPress ID: ${result.id}`)
    console.log(`🔗 URL: ${result.url || 'N/A'}`)
    
    return { ...sampleNews, wpId: result.id }
  } catch (error) {
    console.error('❌ Failed to post sample news:', error)
    throw error
  }
}

// Example: Update news in WordPress
export async function exampleUpdateNewsInWP(news: NewsItem) {
  if (!news.wpId) {
    throw new Error('News must have WordPress ID to update')
  }

  // Update some fields
  const updatedNews: NewsItem = {
    ...news,
    title: news.title + " (Đã cập nhật)",
    description: news.description + " - Nội dung đã được cập nhật.",
    detailContent: news.detailContent + `\n\n<p><em>Cập nhật lần cuối: ${new Date().toLocaleString('vi-VN')}</em></p>`
  }

  try {
    await updateNewsInWordPress(updatedNews)
    console.log(`✅ News updated in WordPress: ${updatedNews.title}`)
    return updatedNews
  } catch (error) {
    console.error('❌ Failed to update news:', error)
    throw error
  }
}

// Example: Delete news from WordPress
export async function exampleDeleteNewsFromWP(wpId: number) {
  try {
    await deleteNewsFromWordPress(wpId)
    console.log(`✅ News deleted from WordPress: ${wpId}`)
    return true
  } catch (error) {
    console.error('❌ Failed to delete news:', error)
    throw error
  }
}

// Example: Full sync operation
export async function exampleFullSync() {
  try {
    console.log('🔄 Starting full sync with WordPress...')
    const result = await syncNewsWithWordPress()
    
    console.log('📊 Sync Results:')
    console.log(`📥 Pulled from WordPress: ${result.pulled}`)
    console.log(`📤 Pushed to WordPress: ${result.pushed}`)
    
    if (result.errors.length > 0) {
      console.log('❌ Errors occurred:')
      result.errors.forEach(error => console.log(`  - ${error}`))
    }
    
    return result
  } catch (error) {
    console.error('❌ Full sync failed:', error)
    throw error
  }
}

// Example: Complete workflow
export async function exampleCompleteWorkflow() {
  console.log('🚀 Starting complete WordPress integration workflow...')
  
  try {
    // 1. Test connection
    console.log('\n1️⃣ Testing WordPress connection...')
    const connectionTest = await exampleTestConnection()
    if (!connectionTest.success) {
      throw new Error('WordPress connection failed')
    }
    
    // 2. Get existing news
    console.log('\n2️⃣ Getting existing news from WordPress...')
    const existingNews = await exampleGetNewsFromWP()
    
    // 3. Post new news
    console.log('\n3️⃣ Posting new news to WordPress...')
    const newNews = await examplePostNewsToWP()
    
    // 4. Update the news
    console.log('\n4️⃣ Updating news in WordPress...')
    await exampleUpdateNewsInWP(newNews)
    
    // 5. Full sync
    console.log('\n5️⃣ Performing full sync...')
    await exampleFullSync()
    
    console.log('\n✅ Complete workflow finished successfully!')
    
    return {
      success: true,
      existingNewsCount: existingNews.length,
      newNewsWpId: newNews.wpId
    }
    
  } catch (error) {
    console.error('\n❌ Workflow failed:', error)
    return {
      success: false,
      error: (error as Error).message
    }
  }
}

// Usage in React components or pages:
/*
import { 
  exampleTestConnection,
  exampleGetNewsFromWP,
  examplePostNewsToWP,
  exampleCompleteWorkflow
} from '@/lib/newsDataExample'

// In a React component
const handleTestWordPress = async () => {
  const result = await exampleTestConnection()
  setConnectionStatus(result)
}

const handleSyncFromWordPress = async () => {
  const news = await exampleGetNewsFromWP()
  setNewsItems(news)
}

const handlePostToWordPress = async () => {
  try {
    await examplePostNewsToWP()
    alert('Đã đăng tin tức lên WordPress thành công!')
  } catch (error) {
    alert('Lỗi: ' + error.message)
  }
}
*/ 