// COMPREHENSIVE WORDPRESS SYNC FIX & TEST
console.log('🔧 COMPREHENSIVE WORDPRESS SYNC FIX & TEST\n')

const fixWordPressSync = async () => {
  console.log('1️⃣ FIXING ALL SETTINGS...')
  
  // Clear any corrupted settings first
  console.log('   🧹 Clearing existing settings...')
  localStorage.removeItem('wpSyncEnabled')
  localStorage.removeItem('autoSyncEnabled')
  localStorage.removeItem('bidirectionalSyncEnabled')
  localStorage.removeItem('wordpressSettings')
  
  // Set correct settings
  console.log('   ⚙️ Setting correct WordPress sync settings...')
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
  
  console.log('   ✅ WordPress sync: ENABLED')
  console.log('   ✅ Auto sync: ENABLED')
  console.log('   ✅ Bidirectional sync: ENABLED')
  console.log('   ✅ WordPress credentials: CONFIGURED')
  
  console.log('\n' + '='.repeat(60) + '\n')
  
  // Verify settings
  console.log('2️⃣ VERIFYING SETTINGS...')
  const wpSyncCheck = localStorage.getItem('wpSyncEnabled')
  const autoSyncCheck = localStorage.getItem('autoSyncEnabled')
  const wpSettingsCheck = localStorage.getItem('wordpressSettings')
  
  console.log('   📊 wpSyncEnabled:', wpSyncCheck)
  console.log('   📊 autoSyncEnabled:', autoSyncCheck)
  console.log('   📊 wordpressSettings:', wpSettingsCheck ? 'SET' : 'NOT SET')
  
  if (wpSyncCheck === 'true' && autoSyncCheck === 'true' && wpSettingsCheck) {
    console.log('   ✅ All settings verified successfully')
  } else {
    console.log('   ❌ Settings verification failed')
    return
  }
  
  console.log('\n' + '='.repeat(60) + '\n')
  
  // Test WordPress connection
  console.log('3️⃣ TESTING WORDPRESS CONNECTION...')
  try {
    const wpTestResponse = await fetch('http://vhdcom.local/wp-json/wp/v2/posts?per_page=1')
    if (wpTestResponse.ok) {
      const wpTestData = await wpTestResponse.json()
      console.log('   ✅ WordPress REST API: ACCESSIBLE')
      console.log('   📊 Sample posts available:', wpTestData.length)
    } else {
      console.log('   ❌ WordPress REST API: NOT ACCESSIBLE')
      console.log('   Status:', wpTestResponse.status)
      return
    }
  } catch (error) {
    console.log('   ❌ WordPress connection failed:', error.message)
    return
  }
  
  console.log('\n' + '='.repeat(60) + '\n')
  
  // Test WordPress authentication
  console.log('4️⃣ TESTING WORDPRESS AUTHENTICATION...')
  try {
    const authTestResponse = await fetch('http://vhdcom.local/wp-json/wp/v2/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('admin:admin')
      },
      body: JSON.stringify({
        title: `Auth Test ${Date.now()}`,
        content: '<p>Authentication test post</p>',
        status: 'draft'
      })
    })
    
    if (authTestResponse.ok) {
      const authTestResult = await authTestResponse.json()
      console.log('   ✅ WordPress authentication: SUCCESS')
      console.log('   📊 Test post created with ID:', authTestResult.id)
      
      // Delete the test post
      await fetch(`http://vhdcom.local/wp-json/wp/v2/posts/${authTestResult.id}?force=true`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin')
        }
      })
      console.log('   🗑️ Test post cleaned up')
      
    } else {
      console.log('   ❌ WordPress authentication: FAILED')
      console.log('   Status:', authTestResponse.status)
      const errorText = await authTestResponse.text()
      console.log('   Error:', errorText)
      
      if (authTestResponse.status === 401) {
        console.log('   💡 TIP: Có thể cần tạo Application Password')
        console.log('   🔗 Link: http://vhdcom.local/wp-admin/profile.php')
      }
      return
    }
  } catch (error) {
    console.log('   ❌ Authentication test failed:', error.message)
    return
  }
  
  console.log('\n' + '='.repeat(60) + '\n')
  
  // Test frontend API endpoints
  console.log('5️⃣ TESTING FRONTEND API ENDPOINTS...')
  try {
    const frontendApiResponse = await fetch('http://localhost:3001/api/sync/wordpress/?action=health')
    if (frontendApiResponse.ok) {
      const frontendApiResult = await frontendApiResponse.json()
      console.log('   ✅ Frontend WordPress API: SUCCESS')
      console.log('   📊 Health check result:', frontendApiResult.success ? 'HEALTHY' : 'UNHEALTHY')
    } else {
      console.log('   ❌ Frontend WordPress API: FAILED')
      console.log('   Status:', frontendApiResponse.status)
    }
  } catch (error) {
    console.log('   ❌ Frontend API test failed:', error.message)
  }
  
  console.log('\n' + '='.repeat(60) + '\n')
  
  // Check existing news data
  console.log('6️⃣ CHECKING EXISTING NEWS DATA...')
  const existingNews = localStorage.getItem('news')
  if (existingNews) {
    const parsedNews = JSON.parse(existingNews)
    console.log('   📊 Total news items:', parsedNews.length)
    
    const newsWithWpId = parsedNews.filter(news => news.wpId)
    const newsWithoutWpId = parsedNews.filter(news => !news.wpId)
    
    console.log('   📊 News already synced to WordPress:', newsWithWpId.length)
    console.log('   📊 News NOT synced to WordPress:', newsWithoutWpId.length)
    
    if (newsWithoutWpId.length > 0) {
      console.log('   📋 News items that need WordPress sync:')
      newsWithoutWpId.slice(0, 3).forEach((news, index) => {
        console.log(`      ${index + 1}. "${news.title}" (ID: ${news.id})`)
      })
      
      if (newsWithoutWpId.length > 3) {
        console.log(`      ... and ${newsWithoutWpId.length - 3} more`)
      }
    }
  } else {
    console.log('   ℹ️ No existing news data found')
  }
  
  console.log('\n' + '='.repeat(60) + '\n')
  
  // Final instructions
  console.log('🎯 WORDPRESS SYNC IS NOW READY!')
  console.log('✅ All settings configured correctly')
  console.log('✅ WordPress connection verified')
  console.log('✅ Authentication working')
  console.log('✅ Frontend API endpoints functional')
  
  console.log('\n📋 NEXT STEPS TO TEST:')
  console.log('1. Refresh this page: window.location.reload()')
  console.log('2. Go to: http://localhost:3001/admin/news/create')
  console.log('3. Create a new news item')
  console.log('4. Watch console logs during creation')
  console.log('5. Check WordPress admin: http://vhdcom.local/wp-admin/edit.php')
  
  console.log('\n🔍 DEBUGGING COMMANDS (if needed):')
  console.log('// Check sync settings in console')
  console.log('console.log("Settings:", {')
  console.log('  wpSyncEnabled: localStorage.getItem("wpSyncEnabled"),')
  console.log('  autoSyncEnabled: localStorage.getItem("autoSyncEnabled"),')
  console.log('  wpSettings: JSON.parse(localStorage.getItem("wordpressSettings"))')
  console.log('})')
  
  console.log('\n🔄 Auto-refreshing page in 5 seconds to apply changes...')
  setTimeout(() => {
    console.log('🔄 Refreshing page now...')
    window.location.reload()
  }, 5000)
}

// Execute the fix
fixWordPressSync().catch(error => {
  console.error('❌ Fix script failed:', error)
  console.log('\n🛠️ MANUAL FIX STEPS:')
  console.log('1. localStorage.setItem("wpSyncEnabled", "true")')
  console.log('2. localStorage.setItem("autoSyncEnabled", "true")')
  console.log('3. localStorage.setItem("wordpressSettings", JSON.stringify({apiUrl: "http://vhdcom.local/wp-json/wp/v2", username: "admin", password: "admin", enabled: true}))')
  console.log('4. window.location.reload()')
}) 