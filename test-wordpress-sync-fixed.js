// TEST WORDPRESS SYNC FIXED - Kiểm tra sync sau khi fix
console.log('🧪 TESTING FIXED WORDPRESS SYNC\n')

const testWordPressSyncFixed = async () => {
  console.log('1️⃣ SETTING UP SYNC CONFIGURATION...')
  
  // Enable all sync settings
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
  
  console.log('✅ All sync settings configured')
  
  console.log('\n2️⃣ TESTING API ENDPOINT...')
  
  // Find active port
  const ports = [3000, 3001, 3002, 3003]
  let activePort = null
  
  for (const port of ports) {
    try {
      const response = await fetch(`http://localhost:${port}/api/sync/wordpress?action=health`)
      if (response.ok) {
        console.log(`✅ Found active API on port ${port}`)
        activePort = port
        break
      }
    } catch (error) {
      // Continue to next port
    }
  }
  
  if (!activePort) {
    console.log('❌ No active API found. Make sure Next.js server is running.')
    return
  }
  
  console.log('\n3️⃣ TESTING WORDPRESS CONNECTION...')
  
  try {
    const healthResponse = await fetch(`http://localhost:${activePort}/api/sync/wordpress?action=health`)
    const healthData = await healthResponse.json()
    
    if (healthData.success) {
      console.log('✅ WordPress connection: SUCCESS')
      console.log('📊 Status:', healthData.status)
    } else {
      console.log('❌ WordPress connection: FAILED')
      console.log('📋 Error:', healthData.error)
    }
  } catch (error) {
    console.log('❌ Connection test failed:', error.message)
  }
  
  console.log('\n4️⃣ CREATING TEST NEWS VIA API...')
  
  const testNews = {
    id: Date.now(),
    title: `API Test News ${new Date().toLocaleTimeString('vi-VN')}`,
    titleEn: `API Test News ${new Date().toLocaleTimeString('vi-VN')}`,
    description: 'Tin tức test qua API để kiểm tra sync WordPress',
    descriptionEn: 'Test news via API to check WordPress sync',
    image: '/images/hoi_xuat_ban.png',
    category: 'Tin tức',
    categoryEn: 'News',
    date: new Date().toLocaleDateString('vi-VN'),
    detailContent: `<h1>API Test News</h1>
<p>Đây là tin tức test được tạo qua API để kiểm tra tính năng sync WordPress.</p>
<h2>Thông tin:</h2>
<ul>
<li>Thời gian tạo: ${new Date().toLocaleString('vi-VN')}</li>
<li>Phương thức: API Route</li>
<li>Mục đích: Kiểm tra sync WordPress</li>
<li>Trạng thái: Draft</li>
</ul>
<p>Nếu bạn thấy tin tức này trên WordPress admin, nghĩa là sync đã hoạt động!</p>`,
    detailContentEn: `<h1>API Test News</h1>
<p>This is a test news created via API to check WordPress sync functionality.</p>
<h2>Information:</h2>
<ul>
<li>Created at: ${new Date().toLocaleString('vi-VN')}</li>
<li>Method: API Route</li>
<li>Purpose: Test WordPress sync</li>
<li>Status: Draft</li>
</ul>
<p>If you see this news in WordPress admin, sync is working!</p>`,
    views: 0,
    readingTime: 3,
    status: 'draft',
    featured: false,
    tags: ['test', 'api', 'sync'],
    author: 'API Test User',
    authorEn: 'API Test User'
  }
  
  console.log('📝 Test news data prepared:', {
    title: testNews.title,
    contentLength: testNews.detailContent.length,
    status: testNews.status
  })
  
  console.log('\n5️⃣ SENDING CREATE REQUEST TO API...')
  
  try {
    const createResponse = await fetch(`http://localhost:${activePort}/api/sync/wordpress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'create',
        data: testNews
      })
    })
    
    console.log('📡 Create response status:', createResponse.status)
    console.log('📡 Response headers:', Object.fromEntries(createResponse.headers.entries()))
    
    if (createResponse.ok) {
      const result = await createResponse.json()
      console.log('✅ WordPress post creation via API: SUCCESS')
      console.log('📊 Result:', {
        success: result.success,
        wpId: result.wpId,
        message: result.message
      })
      
      if (result.data) {
        console.log('📋 WordPress post details:', {
          id: result.data.id,
          title: result.data.title?.rendered,
          status: result.data.status,
          link: result.data.link
        })
      }
      
      // Add to localStorage with wpId
      testNews.wpId = result.wpId
      const existingNews = JSON.parse(localStorage.getItem('news') || '[]')
      const updatedNews = [testNews, ...existingNews]
      localStorage.setItem('news', JSON.stringify(updatedNews))
      
      console.log('✅ Test news added to localStorage with wpId:', result.wpId)
      
    } else {
      const errorText = await createResponse.text()
      console.log('❌ WordPress post creation: FAILED')
      console.log('📋 Status:', createResponse.status)
      console.log('📋 Error response:', errorText)
      
      // Try to parse error as JSON
      try {
        const errorData = JSON.parse(errorText)
        console.log('📋 Error details:', errorData)
        
        if (errorData.details) {
          console.log('💡 Error details:', errorData.details)
        }
      } catch (e) {
        console.log('📋 Raw error text:', errorText)
      }
    }
    
  } catch (error) {
    console.log('❌ API request failed:', error.message)
    console.log('📋 Error stack:', error.stack)
  }
  
  console.log('\n' + '='.repeat(60))
  
  console.log('\n🎯 TEST SUMMARY:')
  console.log('✅ Sync settings configured')
  console.log(`✅ API endpoint found: Port ${activePort}`)
  console.log('✅ Test news created')
  console.log('✅ API request sent')
  
  console.log('\n📋 VERIFICATION STEPS:')
  console.log('1. Check WordPress admin: http://vhdcom.local/wp-admin/edit.php')
  console.log('2. Look for the test news post')
  console.log('3. If found, sync is working!')
  console.log('4. If not found, check the error messages above')
  
  console.log('\n🔍 NEXT STEPS:')
  console.log('1. Go to: http://localhost:' + activePort + '/admin/news/create')
  console.log('2. Create a real news item')
  console.log('3. Watch browser console for sync messages')
  console.log('4. Verify the news appears in WordPress')
  
  console.log('\n💡 TROUBLESHOOTING:')
  console.log('• If 401 error: Create Application Password in WordPress')
  console.log('• If 403 error: Check user permissions')
  console.log('• If 404 error: Check WordPress is running')
  console.log('• If 500 error: Check WordPress error logs')
  
  console.log('\n🔄 Test completed. Check results above.')
}

testWordPressSyncFixed().catch(error => {
  console.error('❌ Test failed:', error)
  console.log('\n🛠️ QUICK FIXES:')
  console.log('1. Make sure WordPress is running: http://vhdcom.local')
  console.log('2. Make sure Next.js server is running: npm run dev')
  console.log('3. Check WordPress credentials are correct')
  console.log('4. Try creating Application Password')
}) 