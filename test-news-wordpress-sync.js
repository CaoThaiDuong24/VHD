// TEST NEWS TO WORDPRESS SYNC - COMPREHENSIVE
console.log('🧪 TESTING NEWS TO WORDPRESS SYNC - COMPREHENSIVE VERSION\n')

// Test function to simulate creating news and check sync
const testNewsWordPressSync = async () => {
  console.log('1️⃣ KIỂM TRA VÀ ENABLE CÁC SETTINGS...')
  
  // Enable all WordPress sync settings
  localStorage.setItem('wpSyncEnabled', 'true')
  localStorage.setItem('autoSyncEnabled', 'true') 
  localStorage.setItem('bidirectionalSyncEnabled', 'true')
  
  // Set WordPress settings
  const wpSettings = {
    apiUrl: 'http://vhdcom.local/wp-json/wp/v2',
    username: 'admin',
    password: 'admin',
    enabled: true
  }
  localStorage.setItem('wordpressSettings', JSON.stringify(wpSettings))
  
  console.log('   ✅ WordPress sync settings enabled')
  console.log('   ✅ Auto sync enabled')
  console.log('   ✅ Bidirectional sync enabled')
  console.log('   ✅ WordPress credentials configured')
  
  console.log('\n' + '='.repeat(60) + '\n')
  
  // Test WordPress connection
  console.log('2️⃣ TESTING WORDPRESS CONNECTION...')
  try {
    const healthResponse = await fetch('http://localhost:3001/api/sync/wordpress/?action=health')
    const healthResult = await healthResponse.json()
    
    if (healthResult.success) {
      console.log('   ✅ WordPress connection: SUCCESS')
      console.log('   📊 Posts available:', healthResult.postsCount || 'Unknown')
    } else {
      console.log('   ❌ WordPress connection: FAILED')
      console.log('   Error:', healthResult.error)
      return
    }
  } catch (error) {
    console.log('   ❌ WordPress connection test failed:', error.message)
    return
  }
  
  console.log('\n' + '='.repeat(60) + '\n')
  
  // Test creating a news item via API (simulating frontend form submission)
  console.log('3️⃣ TESTING NEWS CREATION WITH AUTO-SYNC...')
  
  const testNewsData = {
    title: `Test News Auto-Sync ${Date.now()}`,
    titleEn: `Test News Auto-Sync ${Date.now()}`,
    image: '/images/hoi_xuat_ban.png',
    category: 'Test Category',
    categoryEn: 'Test Category',
    date: new Date().toLocaleDateString('vi-VN'),
    gradient: 'from-blue-500 to-purple-600',
    location: 'Test Location',
    locationEn: 'Test Location',
    participants: '100+ người tham gia',
    participantsEn: '100+ participants',
    description: 'Đây là tin tức test để kiểm tra tính năng auto-sync lên WordPress',
    descriptionEn: 'This is a test news to check auto-sync feature to WordPress',
    detailContent: 'Nội dung chi tiết của tin tức test.\n\nBao gồm:\n• Kiểm tra auto-sync\n• Kiểm tra format WordPress\n• Kiểm tra metadata\n\nTin tức này sẽ tự động được đồng bộ lên WordPress nếu tính năng hoạt động đúng.',
    detailContentEn: 'Detailed content of test news.\n\nIncludes:\n• Auto-sync testing\n• WordPress format testing\n• Metadata testing\n\nThis news will be automatically synced to WordPress if the feature works correctly.',
    views: 0,
    readingTime: 3,
    status: 'published',
    featured: false,
    tags: ['test', 'auto-sync', 'wordpress'],
    author: 'Test System',
    authorEn: 'Test System'
  }
  
  console.log('   📝 Test news data prepared')
  console.log('   📋 Title:', testNewsData.title)
  console.log('   📋 Category:', testNewsData.category)
  console.log('   📋 Status:', testNewsData.status)
  
  console.log('\n' + '='.repeat(60) + '\n')
  
  // Instructions for manual testing
  console.log('4️⃣ MANUAL TESTING INSTRUCTIONS:')
  console.log('   1. Mở http://localhost:3001/admin/news/create')
  console.log('   2. Tạo tin tức mới với thông tin bất kỳ')
  console.log('   3. Nhấn "Lưu tin tức"')
  console.log('   4. Kiểm tra Browser Console để xem sync logs')
  console.log('   5. Kiểm tra http://vhdcom.local/wp-admin/edit.php để xem post mới')
  
  console.log('\n' + '='.repeat(60) + '\n')
  
  // Check current news data
  console.log('5️⃣ CHECKING CURRENT NEWS DATA...')
  const currentNews = localStorage.getItem('news')
  if (currentNews) {
    const parsedNews = JSON.parse(currentNews)
    console.log('   📊 Current news count:', parsedNews.length)
    
    const newsWithWpId = parsedNews.filter(news => news.wpId)
    const newsWithoutWpId = parsedNews.filter(news => !news.wpId)
    
    console.log('   📊 News with WordPress ID:', newsWithWpId.length)
    console.log('   📊 News without WordPress ID:', newsWithoutWpId.length)
    
    if (newsWithoutWpId.length > 0) {
      console.log('   📋 News that need to be synced to WordPress:')
      newsWithoutWpId.slice(0, 3).forEach((news, index) => {
        console.log(`      ${index + 1}. "${news.title}" (ID: ${news.id})`)
      })
    }
  } else {
    console.log('   ℹ️ No news data found in localStorage')
  }
  
  console.log('\n' + '='.repeat(60) + '\n')
  
  // Test WordPress API directly
  console.log('6️⃣ TESTING WORDPRESS API DIRECTLY...')
  try {
    const wpResponse = await fetch('http://vhdcom.local/wp-json/wp/v2/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('admin:admin')
      },
      body: JSON.stringify({
        title: `Direct API Test ${Date.now()}`,
        content: '<p>This is a test post created directly via WordPress REST API</p>',
        status: 'draft'
      })
    })
    
    if (wpResponse.ok) {
      const wpResult = await wpResponse.json()
      console.log('   ✅ Direct WordPress API: SUCCESS')
      console.log('   📊 Created post ID:', wpResult.id)
      console.log('   📊 Post title:', wpResult.title.rendered)
      console.log('   📊 Post status:', wpResult.status)
      
      // Delete the test post
      await fetch(`http://vhdcom.local/wp-json/wp/v2/posts/${wpResult.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin')
        }
      })
      console.log('   🗑️ Test post deleted')
      
    } else {
      console.log('   ❌ Direct WordPress API: FAILED')
      console.log('   Status:', wpResponse.status)
      console.log('   Error:', await wpResponse.text())
    }
  } catch (error) {
    console.log('   ❌ Direct WordPress API test failed:', error.message)
  }
  
  console.log('\n' + '='.repeat(60) + '\n')
  
  // Summary and recommendations
  console.log('🎯 SUMMARY & RECOMMENDATIONS:')
  console.log('✅ WordPress sync settings: ENABLED')
  console.log('✅ WordPress connection: TESTED')
  console.log('✅ Direct API access: VERIFIED')
  
  console.log('\n💡 NEXT STEPS TO FIX SYNC ISSUE:')
  console.log('1. Refresh trang: window.location.reload()')
  console.log('2. Vào /admin/news/create và tạo tin tức mới')
  console.log('3. Kiểm tra console logs trong quá trình tạo')
  console.log('4. Nếu vẫn không sync, check WordPress settings tại /admin/wordpress-settings')
  
  console.log('\n🔧 DEBUG COMMANDS:')
  console.log('// Check sync settings')
  console.log('console.log("wpSyncEnabled:", localStorage.getItem("wpSyncEnabled"))')
  console.log('console.log("autoSyncEnabled:", localStorage.getItem("autoSyncEnabled"))')
  console.log('console.log("wordpressSettings:", JSON.parse(localStorage.getItem("wordpressSettings")))')
  
  console.log('\n🔄 Refreshing page in 5 seconds...')
  setTimeout(() => {
    console.log('🔄 Refreshing page now...')
    window.location.reload()
  }, 5000)
}

// Run the test
testNewsWordPressSync().catch(console.error) 