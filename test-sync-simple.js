// TEST SYNC SIMPLE - Kiểm tra sync đơn giản
console.log('🧪 TESTING SYNC FUNCTIONALITY\n')

const testSyncSimple = async () => {
  console.log('1️⃣ CHECKING CURRENT SETTINGS...')
  
  const wpSyncEnabled = localStorage.getItem('wpSyncEnabled')
  const autoSyncEnabled = localStorage.getItem('autoSyncEnabled')
  const wpSettings = localStorage.getItem('wordpressSettings')
  
  console.log('Current Settings:')
  console.log('- wpSyncEnabled:', wpSyncEnabled)
  console.log('- autoSyncEnabled:', autoSyncEnabled)
  console.log('- wpSettings exists:', !!wpSettings)
  
  if (wpSyncEnabled !== 'true') {
    console.log('❌ WordPress sync is DISABLED')
    console.log('🔧 Enabling now...')
    localStorage.setItem('wpSyncEnabled', 'true')
  }
  
  if (autoSyncEnabled !== 'true') {
    console.log('❌ Auto sync is DISABLED')
    console.log('🔧 Enabling now...')
    localStorage.setItem('autoSyncEnabled', 'true')
  }
  
  if (!wpSettings) {
    console.log('❌ WordPress settings MISSING')
    console.log('🔧 Setting default...')
    const defaultSettings = {
      apiUrl: 'http://vhdcom.local/wp-json/wp/v2',
      username: 'admin',
      password: 'admin',
      enabled: true
    }
    localStorage.setItem('wordpressSettings', JSON.stringify(defaultSettings))
  }
  
  console.log('\n2️⃣ TESTING WORDPRESS CONNECTION...')
  
  try {
    const wpSettingsObj = JSON.parse(localStorage.getItem('wordpressSettings') || '{}')
    const testUrl = wpSettingsObj.apiUrl || 'http://vhdcom.local/wp-json/wp/v2'
    
    console.log('Testing URL:', testUrl)
    
    const response = await fetch(`${testUrl}/posts?per_page=1`)
    console.log('Response status:', response.status)
    
    if (response.ok) {
      console.log('✅ WordPress connection: SUCCESS')
      const posts = await response.json()
      console.log('Posts found:', posts.length)
    } else {
      console.log('❌ WordPress connection: FAILED')
      console.log('Error details:', response.statusText)
    }
  } catch (error) {
    console.log('❌ Connection error:', error.message)
  }
  
  console.log('\n3️⃣ TESTING FRONTEND API...')
  
  // Test different ports
  const ports = [3000, 3001, 3002, 3003]
  let workingPort = null
  
  for (const port of ports) {
    try {
      const healthUrl = `http://localhost:${port}/api/sync/wordpress?action=health`
      console.log(`Testing port ${port}...`)
      
      const response = await fetch(healthUrl)
      if (response.ok) {
        console.log(`✅ Port ${port}: WORKING`)
        workingPort = port
        break
      } else {
        console.log(`❌ Port ${port}: Status ${response.status}`)
      }
    } catch (error) {
      console.log(`❌ Port ${port}: ${error.message}`)
    }
  }
  
  if (workingPort) {
    console.log(`🎯 Frontend API working on port: ${workingPort}`)
  } else {
    console.log('❌ No working frontend API found')
    console.log('💡 Make sure Next.js server is running: npm run dev')
  }
  
  console.log('\n4️⃣ CREATING TEST NEWS...')
  
  const testNews = {
    id: Date.now(),
    title: `Test News ${new Date().toLocaleTimeString()}`,
    titleEn: `Test News ${new Date().toLocaleTimeString()}`,
    description: 'Test news để kiểm tra sync',
    descriptionEn: 'Test news to check sync',
    image: '/images/hoi_xuat_ban.png',
    category: 'Tin tức',
    categoryEn: 'News',
    date: new Date().toLocaleDateString('vi-VN'),
    detailContent: `<h1>Test News</h1><p>Created at ${new Date().toLocaleString()}</p>`,
    detailContentEn: `<h1>Test News</h1><p>Created at ${new Date().toLocaleString()}</p>`,
    views: 0,
    readingTime: 2,
    status: 'draft',
    featured: false,
    tags: ['test'],
    author: 'Test User',
    authorEn: 'Test User'
  }
  
  // Add to localStorage
  const existingNews = JSON.parse(localStorage.getItem('news') || '[]')
  const updatedNews = [testNews, ...existingNews]
  localStorage.setItem('news', JSON.stringify(updatedNews))
  
  console.log('✅ Test news created and added to localStorage')
  console.log('News title:', testNews.title)
  console.log('Total news count:', updatedNews.length)
  
  console.log('\n5️⃣ MANUAL SYNC TEST...')
  
  if (workingPort) {
    try {
      console.log('Attempting manual sync...')
      const syncResponse = await fetch(`http://localhost:${workingPort}/api/sync/wordpress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create',
          data: testNews
        })
      })
      
      console.log('Sync response status:', syncResponse.status)
      
      if (syncResponse.ok) {
        const result = await syncResponse.json()
        console.log('✅ Manual sync: SUCCESS')
        console.log('Result:', result)
      } else {
        const errorText = await syncResponse.text()
        console.log('❌ Manual sync: FAILED')
        console.log('Error:', errorText)
      }
    } catch (error) {
      console.log('❌ Manual sync error:', error.message)
    }
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('\n🎯 TEST SUMMARY:')
  console.log('✅ Settings configured')
  console.log('✅ Test news created')
  console.log(`${workingPort ? '✅' : '❌'} Frontend API: ${workingPort ? `Port ${workingPort}` : 'Not found'}`)
  
  console.log('\n📋 NEXT STEPS:')
  console.log('1. Go to admin panel and create news')
  console.log('2. Watch browser console for sync messages')
  console.log('3. Check WordPress admin for new posts')
  console.log('4. If not working, check WordPress credentials')
  
  console.log('\n🔄 Reloading page to apply settings...')
  setTimeout(() => window.location.reload(), 2000)
}

testSyncSimple().catch(console.error) 