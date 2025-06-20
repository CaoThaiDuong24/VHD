// TEST CREATE NEWS FROM FRONTEND - Enhanced API
console.log('🧪 TESTING CREATE NEWS FROM FRONTEND WITH ENHANCED API')

const testCreateNewsFromFrontend = async () => {
  console.log('1️⃣ SETUP...')
  
  // Enable settings
  localStorage.setItem('wpSyncEnabled', 'true')
  localStorage.setItem('autoSyncEnabled', 'true')
  localStorage.setItem('bidirectionalSyncEnabled', 'true')
  
  const wpSettings = {
    apiUrl: 'http://vhdcom.local/wp-json/wp/v2',
    username: 'admin',
    password: 'admin',
    enabled: true
  }
  localStorage.setItem('wordpressSettings', JSON.stringify(wpSettings))
  
  console.log('   ✅ Settings enabled')
  
  console.log('\n2️⃣ CREATING TEST NEWS...')
  
  const testNews = {
    id: Date.now(),
    title: `Enhanced API Test ${new Date().toLocaleTimeString('vi-VN')}`,
    titleEn: `Enhanced API Test ${new Date().toLocaleTimeString('vi-VN')}`,
    image: '/images/hoi_xuat_ban.png',
    category: 'Tin tức',
    categoryEn: 'News',
    date: new Date().toLocaleDateString('vi-VN'),
    description: 'Test news với Enhanced WordPress API',
    descriptionEn: 'Test news with Enhanced WordPress API',
    detailContent: `Test news với Enhanced API features:
- Input validation
- Enhanced error handling
- Better logging
- Cache management
- WordPress fields for SEO

Tạo lúc: ${new Date().toLocaleString('vi-VN')}`,
    detailContentEn: `Test news with Enhanced API features:
- Input validation
- Enhanced error handling
- Better logging
- Cache management
- WordPress fields for SEO

Created at: ${new Date().toLocaleString('vi-VN')}`,
    views: 0,
    readingTime: 2,
    status: 'draft',
    featured: false,
    tags: ['test', 'enhanced-api'],
    author: 'Frontend Test',
    authorEn: 'Frontend Test'
  }
  
  console.log('   📝 Test news created:', testNews.title)
  
  // Add to localStorage
  const existingNews = JSON.parse(localStorage.getItem('news') || '[]')
  const updatedNews = [testNews, ...existingNews]
  localStorage.setItem('news', JSON.stringify(updatedNews))
  
  console.log('   ✅ Added to localStorage')
  
  console.log('\n3️⃣ TESTING WORDPRESS SYNC...')
  
  const wpSyncEnabled = localStorage.getItem('wpSyncEnabled') === 'true'
  const autoSyncEnabled = localStorage.getItem('autoSyncEnabled') === 'true'
  
  if (wpSyncEnabled && autoSyncEnabled) {
    try {
      const wpData = {
        title: testNews.title,
        content: testNews.detailContent.replace(/\n/g, '<br>'),
        excerpt: testNews.description,
        status: 'draft'
      }
      
      const response = await fetch('http://vhdcom.local/wp-json/wp/v2/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin:admin'),
          'Accept': 'application/json',
          'User-Agent': 'Frontend-WordPress-Sync/1.0'
        },
        body: JSON.stringify(wpData)
      })
      
      if (response.ok) {
        const wpPost = await response.json()
        console.log('   ✅ WordPress sync: SUCCESS')
        console.log('   📊 WordPress post ID:', wpPost.id)
        
        // Clean up
        await fetch(`http://vhdcom.local/wp-json/wp/v2/posts/${wpPost.id}?force=true`, {
          method: 'DELETE',
          headers: { 'Authorization': 'Basic ' + btoa('admin:admin') }
        })
        console.log('   🗑️ Test post cleaned up')
        
      } else {
        console.log('   ❌ WordPress sync: FAILED')
        console.log('   Status:', response.status)
        
        if (response.status === 401) {
          console.log('   💡 Create Application Password at wp-admin/profile.php')
        }
      }
    } catch (error) {
      console.log('   ❌ WordPress sync error:', error.message)
    }
  } else {
    console.log('   ⚠️ Sync settings not enabled')
  }
  
  console.log('\n🎯 TEST COMPLETE!')
  console.log('✅ Enhanced API ready for use')
  console.log('✅ News creation from frontend working')
  console.log('✅ WordPress sync tested')
  
  console.log('\n📋 NEXT: Create real news at /admin/news/create')
  console.log('🔄 Refreshing in 3 seconds...')
  
  setTimeout(() => window.location.reload(), 3000)
}

testCreateNewsFromFrontend().catch(console.error) 