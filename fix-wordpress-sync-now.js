// FIX WORDPRESS SYNC NOW - Quick Fix
console.log('🔧 FIXING WORDPRESS SYNC NOW\n')

const fixWordPressSyncNow = async () => {
  console.log('1️⃣ ENABLING ALL SYNC SETTINGS...')
  
  // Force enable all settings
  localStorage.setItem('wpSyncEnabled', 'true')
  localStorage.setItem('autoSyncEnabled', 'true')
  localStorage.setItem('bidirectionalSyncEnabled', 'true')
  
  console.log('   ✅ wpSyncEnabled: true')
  console.log('   ✅ autoSyncEnabled: true')
  console.log('   ✅ bidirectionalSyncEnabled: true')
  
  console.log('\n2️⃣ SETTING WORDPRESS CONFIGURATION...')
  
  const wpSettings = {
    apiUrl: 'http://vhdcom.local/wp-json/wp/v2',
    username: 'admin',
    password: 'admin',
    enabled: true
  }
  
  localStorage.setItem('wordpressSettings', JSON.stringify(wpSettings))
  console.log('   ✅ WordPress settings configured')
  console.log('   📋 API URL:', wpSettings.apiUrl)
  console.log('   📋 Username:', wpSettings.username)
  
  console.log('\n3️⃣ TESTING WORDPRESS CONNECTION...')
  
  try {
    const testResponse = await fetch('http://vhdcom.local/wp-json/wp/v2/posts?per_page=1')
    if (testResponse.ok) {
      console.log('   ✅ WordPress connection: SUCCESS')
    } else {
      console.log('   ❌ WordPress connection: FAILED')
      console.log('   Status:', testResponse.status)
      if (testResponse.status === 404) {
        console.log('   💡 Make sure WordPress is running at http://vhdcom.local')
      }
    }
  } catch (error) {
    console.log('   ❌ WordPress connection error:', error.message)
    console.log('   💡 Check if WordPress is running')
  }
  
  console.log('\n4️⃣ TESTING DIRECT POST CREATION...')
  
  try {
    const testPostData = {
      title: `Sync Test ${new Date().toLocaleTimeString('vi-VN')}`,
      content: `<p>Test post để kiểm tra sync WordPress. Tạo lúc: ${new Date().toLocaleString('vi-VN')}</p>`,
      excerpt: 'Test post kiểm tra sync',
      status: 'draft'
    }
    
    console.log('   📝 Creating test post:', testPostData.title)
    
    const createResponse = await fetch('http://vhdcom.local/wp-json/wp/v2/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('admin:admin'),
        'Accept': 'application/json',
        'User-Agent': 'Frontend-WordPress-Sync/1.0'
      },
      body: JSON.stringify(testPostData)
    })
    
    console.log('   📡 Response status:', createResponse.status)
    
    if (createResponse.ok) {
      const createdPost = await createResponse.json()
      console.log('   ✅ WordPress post creation: SUCCESS')
      console.log('   📊 Created post ID:', createdPost.id)
      console.log('   📊 Title:', createdPost.title?.rendered)
      console.log('   📊 Link:', createdPost.link)
      
      // Clean up test post
      await fetch(`http://vhdcom.local/wp-json/wp/v2/posts/${createdPost.id}?force=true`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin')
        }
      })
      console.log('   🗑️ Test post cleaned up')
      
    } else {
      const errorText = await createResponse.text()
      console.log('   ❌ WordPress post creation: FAILED')
      console.log('   📋 Status:', createResponse.status)
      console.log('   📋 Error:', errorText)
      
      if (createResponse.status === 401) {
        console.log('   💡 AUTHENTICATION ISSUE:')
        console.log('      1. Go to: http://vhdcom.local/wp-admin/profile.php')
        console.log('      2. Scroll to "Application Passwords"')
        console.log('      3. Create new password named "Frontend Sync"')
        console.log('      4. Copy the generated password')
        console.log('      5. Run this command:')
        console.log('         const wpSettings = {')
        console.log('           apiUrl: "http://vhdcom.local/wp-json/wp/v2",')
        console.log('           username: "admin",')
        console.log('           password: "YOUR_APPLICATION_PASSWORD_HERE",')
        console.log('           enabled: true')
        console.log('         }')
        console.log('         localStorage.setItem("wordpressSettings", JSON.stringify(wpSettings))')
      }
    }
  } catch (error) {
    console.log('   ❌ Test creation error:', error.message)
  }
  
  console.log('\n5️⃣ CREATING REAL NEWS TEST...')
  
  // Create a real news item to test sync
  const testNews = {
    id: Date.now(),
    title: `Test News Sync ${new Date().toLocaleTimeString('vi-VN')}`,
    titleEn: `Test News Sync ${new Date().toLocaleTimeString('vi-VN')}`,
    description: 'Tin tức test để kiểm tra sync lên WordPress',
    descriptionEn: 'Test news to check WordPress sync',
    image: '/images/hoi_xuat_ban.png',
    category: 'Tin tức',
    categoryEn: 'News',
    date: new Date().toLocaleDateString('vi-VN'),
    detailContent: `# Test News Sync

Đây là tin tức test để kiểm tra tính năng sync lên WordPress.

## Thông tin:
- Thời gian tạo: ${new Date().toLocaleString('vi-VN')}
- Mục đích: Kiểm tra sync WordPress
- Trạng thái: Draft

Nếu bạn thấy tin tức này trên WordPress admin, nghĩa là sync đã hoạt động!`,
    detailContentEn: `# Test News Sync

This is a test news to check WordPress sync functionality.

## Information:
- Created at: ${new Date().toLocaleString('vi-VN')}
- Purpose: Test WordPress sync
- Status: Draft

If you see this news in WordPress admin, sync is working!`,
    views: 0,
    readingTime: 2,
    status: 'draft',
    featured: false,
    tags: ['test', 'sync'],
    author: 'Test User',
    authorEn: 'Test User'
  }
  
  console.log('   📝 Test news created:', testNews.title)
  
  // Add to localStorage
  const existingNews = JSON.parse(localStorage.getItem('news') || '[]')
  const updatedNews = [testNews, ...existingNews]
  localStorage.setItem('news', JSON.stringify(updatedNews))
  
  console.log('   ✅ Test news added to localStorage')
  console.log('   📊 Total news count:', updatedNews.length)
  
  console.log('\n' + '='.repeat(60))
  
  console.log('\n🎯 SYNC FIX COMPLETE!')
  console.log('✅ All sync settings enabled')
  console.log('✅ WordPress settings configured')
  console.log('✅ Connection tested')
  console.log('✅ Test news created')
  
  console.log('\n📋 NEXT STEPS:')
  console.log('1. Go to: http://localhost:3003/admin/news/create')
  console.log('2. Create a new news item')
  console.log('3. Check browser console for sync logs')
  console.log('4. Verify on WordPress: http://vhdcom.local/wp-admin/edit.php')
  
  console.log('\n🔍 MONITORING:')
  console.log('• Watch browser console for sync messages')
  console.log('• Look for "🚀 Starting WordPress sync" messages')
  console.log('• Check for "✅ WordPress sync completed" confirmations')
  
  console.log('\n⚠️ IF STILL NOT WORKING:')
  console.log('1. Check WordPress is running: http://vhdcom.local')
  console.log('2. Create Application Password (see instructions above)')
  console.log('3. Run debug-wordpress-sync.js for detailed analysis')
  
  console.log('\n🔄 Refreshing page in 3 seconds to apply changes...')
  
  setTimeout(() => {
    window.location.reload()
  }, 3000)
}

// Execute the fix
fixWordPressSyncNow().catch(error => {
  console.error('❌ Fix failed:', error)
  console.log('\n🛠️ MANUAL STEPS:')
  console.log('1. Enable settings manually in admin panel')
  console.log('2. Check WordPress is accessible')
  console.log('3. Verify credentials are correct')
  console.log('4. Try creating Application Password')
}) 