// QUICK SYNC TEST - Kiểm tra nhanh WordPress sync
console.log('⚡ QUICK WORDPRESS SYNC TEST\n')

const quickSyncTest = async () => {
  console.log('🔧 STEP 1: SETUP SYNC SETTINGS...')
  
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
  
  console.log('✅ Sync settings configured')
  
  console.log('\n🧪 STEP 2: TEST CONNECTIONS...')
  
  // Test WordPress
  try {
    const wpResponse = await fetch('http://vhdcom.local/wp-json/wp/v2/posts?per_page=1')
    if (wpResponse.ok) {
      console.log('✅ WordPress API: ACCESSIBLE')
    } else {
      console.log('❌ WordPress API: FAILED (Status:', wpResponse.status, ')')
      return
    }
  } catch (error) {
    console.log('❌ WordPress connection failed:', error.message)
    return
  }
  
  // Test Frontend API
  try {
    const apiResponse = await fetch('/api/sync/wordpress?action=health')
    if (apiResponse.ok) {
      const result = await apiResponse.json()
      console.log('✅ Frontend API: WORKING')
      console.log('📊 Health status:', result.success ? 'SUCCESS' : 'FAILED')
    } else {
      console.log('❌ Frontend API: FAILED (Status:', apiResponse.status, ')')
      return
    }
  } catch (error) {
    console.log('❌ Frontend API connection failed:', error.message)
    return
  }
  
  console.log('\n🚀 STEP 3: CREATE TEST POST...')
  
  const testNews = {
    id: Date.now(),
    title: `Quick Test ${new Date().toLocaleTimeString('vi-VN')}`,
    titleEn: `Quick Test ${new Date().toLocaleTimeString('vi-VN')}`,
    description: 'Test nhanh WordPress sync',
    descriptionEn: 'Quick WordPress sync test',
    image: '/images/hoi_xuat_ban.png',
    category: 'Test',
    categoryEn: 'Test',
    date: new Date().toLocaleDateString('vi-VN'),
    detailContent: `<h1>Quick Sync Test</h1>
<p>Đây là test nhanh để kiểm tra WordPress sync.</p>
<p>Thời gian: ${new Date().toLocaleString('vi-VN')}</p>
<p>Nếu thấy bài này trong WordPress admin, sync đã hoạt động!</p>`,
    detailContentEn: `<h1>Quick Sync Test</h1>
<p>This is a quick test to check WordPress sync.</p>
<p>Time: ${new Date().toLocaleString('vi-VN')}</p>
<p>If you see this post in WordPress admin, sync is working!</p>`,
    views: 0,
    readingTime: 1,
    status: 'draft',
    featured: false,
    tags: ['quick-test'],
    author: 'Quick Test',
    authorEn: 'Quick Test'
  }
  
  try {
    console.log('📡 Sending create request...')
    const createResponse = await fetch('/api/sync/wordpress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'create',
        data: testNews
      })
    })
    
    console.log('📊 Response status:', createResponse.status)
    
    if (createResponse.ok) {
      const result = await createResponse.json()
      console.log('🎉 SUCCESS! WordPress post created!')
      console.log('📋 WordPress Post ID:', result.wpId)
      console.log('📋 Title:', result.data?.title?.rendered || testNews.title)
      console.log('📋 Status:', result.data?.status || 'unknown')
      console.log('📋 Link:', result.data?.link || 'N/A')
      
      // Update localStorage
      testNews.wpId = result.wpId
      const existingNews = JSON.parse(localStorage.getItem('news') || '[]')
      const updatedNews = [testNews, ...existingNews]
      localStorage.setItem('news', JSON.stringify(updatedNews))
      
      console.log('\n🎯 VERIFICATION:')
      console.log('✅ Post created in WordPress with ID:', result.wpId)
      console.log('✅ Post added to localStorage with wpId')
      console.log('🔗 Check WordPress admin: http://vhdcom.local/wp-admin/edit.php')
      console.log('🔗 View post: ' + (result.data?.link || 'Check admin panel'))
      
    } else {
      const errorText = await createResponse.text()
      console.log('❌ FAILED to create WordPress post')
      console.log('📋 Status:', createResponse.status)
      console.log('📋 Error:', errorText)
      
      // Parse error details
      try {
        const errorData = JSON.parse(errorText)
        if (errorData.details) {
          console.log('📋 Details:', errorData.details)
        }
        
        // Provide specific solutions
        if (createResponse.status === 401) {
          console.log('\n💡 SOLUTION FOR 401 ERROR:')
          console.log('1. Go to: http://vhdcom.local/wp-admin/profile.php')
          console.log('2. Create Application Password named "Frontend Sync"')
          console.log('3. Update settings with new password:')
          console.log('   const wpSettings = {')
          console.log('     apiUrl: "http://vhdcom.local/wp-json/wp/v2",')
          console.log('     username: "admin",')
          console.log('     password: "YOUR_APPLICATION_PASSWORD",')
          console.log('     enabled: true')
          console.log('   }')
          console.log('   localStorage.setItem("wordpressSettings", JSON.stringify(wpSettings))')
        }
      } catch (e) {
        console.log('📋 Raw error:', errorText)
      }
    }
    
  } catch (error) {
    console.log('❌ API request failed:', error.message)
    console.log('📋 Error details:', error)
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('\n📊 QUICK TEST SUMMARY:')
  console.log('✅ Settings configured')
  console.log('✅ Connections tested')
  console.log('✅ API request sent')
  
  console.log('\n📋 NEXT STEPS:')
  console.log('1. Check the results above')
  console.log('2. If successful, try creating real news')
  console.log('3. If failed, follow the error solutions')
  console.log('4. Go to: http://localhost:3001/admin/news/create')
  
  console.log('\n💡 TIP: Watch Console when creating news for sync logs!')
}

// Run the quick test
quickSyncTest().catch(error => {
  console.error('❌ Quick test failed:', error)
  console.log('\n🔧 MANUAL CHECKS:')
  console.log('1. Is WordPress running? http://vhdcom.local')
  console.log('2. Is Next.js server running? Check terminal')
  console.log('3. Are there any network errors?')
  console.log('4. Try refreshing the page and running again')
}) 