// DEBUG WORDPRESS SYNC - Comprehensive Debugging
console.log('🔍 DEBUGGING WORDPRESS SYNC ISSUE\n')

const debugWordPressSync = async () => {
  console.log('1️⃣ CHECKING SETTINGS...')
  
  // Check all sync settings
  const wpSyncEnabled = localStorage.getItem('wpSyncEnabled')
  const autoSyncEnabled = localStorage.getItem('autoSyncEnabled')
  const bidirectionalSyncEnabled = localStorage.getItem('bidirectionalSyncEnabled')
  const wpSettingsStr = localStorage.getItem('wordpressSettings')
  
  console.log('📋 Current Settings:')
  console.log('   wpSyncEnabled:', wpSyncEnabled)
  console.log('   autoSyncEnabled:', autoSyncEnabled)
  console.log('   bidirectionalSyncEnabled:', bidirectionalSyncEnabled)
  console.log('   wpSettings exists:', !!wpSettingsStr)
  
  if (wpSettingsStr) {
    try {
      const wpSettings = JSON.parse(wpSettingsStr)
      console.log('   WordPress Settings:', {
        apiUrl: wpSettings.apiUrl,
        username: wpSettings.username,
        hasPassword: !!wpSettings.password,
        enabled: wpSettings.enabled
      })
    } catch (e) {
      console.log('   ❌ WordPress settings JSON parse error:', e.message)
    }
  }
  
  console.log('\n2️⃣ TESTING WORDPRESS CONNECTION...')
  
  try {
    const wpSettings = JSON.parse(wpSettingsStr || '{}')
    const testResponse = await fetch(`${wpSettings.apiUrl || 'http://vhdcom.local/wp-json/wp/v2'}/posts?per_page=1`)
    
    if (testResponse.ok) {
      console.log('   ✅ WordPress REST API: ACCESSIBLE')
      const posts = await testResponse.json()
      console.log('   📊 WordPress posts found:', posts.length)
    } else {
      console.log('   ❌ WordPress REST API: FAILED')
      console.log('   Status:', testResponse.status)
      
      if (testResponse.status === 404) {
        console.log('   💡 WordPress may not be running at: http://vhdcom.local')
      }
    }
  } catch (error) {
    console.log('   ❌ WordPress connection error:', error.message)
  }
  
  console.log('\n3️⃣ TESTING FRONTEND API...')
  
  try {
    const healthResponse = await fetch('http://localhost:3003/api/sync/wordpress?action=health')
    if (healthResponse.ok) {
      const healthData = await healthResponse.json()
      console.log('   ✅ Frontend API: WORKING')
      console.log('   📊 Health check:', healthData.success ? 'SUCCESS' : 'FAILED')
      if (healthData.message) {
        console.log('   📝 Message:', healthData.message)
      }
    } else {
      console.log('   ❌ Frontend API: FAILED')
      console.log('   Status:', healthResponse.status)
    }
  } catch (error) {
    console.log('   ❌ Frontend API error:', error.message)
    console.log('   💡 Try different ports: 3000, 3001, 3002, 3003')
  }
  
  console.log('\n4️⃣ TESTING DIRECT WORDPRESS POST CREATION...')
  
  if (wpSettingsStr) {
    try {
      const wpSettings = JSON.parse(wpSettingsStr)
      const testPostData = {
        title: `Debug Test ${new Date().toLocaleTimeString()}`,
        content: `<p>This is a debug test post created at ${new Date().toLocaleString('vi-VN')}</p>`,
        excerpt: 'Debug test post',
        status: 'draft'
      }
      
      console.log('   📝 Creating test post...')
      console.log('   📋 Post data:', {
        title: testPostData.title,
        contentLength: testPostData.content.length,
        status: testPostData.status
      })
      
      const createResponse = await fetch(`${wpSettings.apiUrl}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${wpSettings.username}:${wpSettings.password}`),
          'Accept': 'application/json',
          'User-Agent': 'Frontend-WordPress-Sync/1.0'
        },
        body: JSON.stringify(testPostData)
      })
      
      console.log('   📡 Response status:', createResponse.status)
      console.log('   📡 Response headers:', Object.fromEntries(createResponse.headers.entries()))
      
      if (createResponse.ok) {
        const createdPost = await createResponse.json()
        console.log('   ✅ WordPress post creation: SUCCESS')
        console.log('   📊 Created post:', {
          id: createdPost.id,
          title: createdPost.title?.rendered,
          status: createdPost.status,
          link: createdPost.link
        })
        
        // Clean up test post
        await fetch(`${wpSettings.apiUrl}/posts/${createdPost.id}?force=true`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Basic ' + btoa(`${wpSettings.username}:${wpSettings.password}`)
          }
        })
        console.log('   🗑️ Test post cleaned up')
        
      } else {
        const errorText = await createResponse.text()
        console.log('   ❌ WordPress post creation: FAILED')
        console.log('   📋 Error response:', errorText)
        
        // Detailed error analysis
        if (createResponse.status === 401) {
          console.log('   💡 SOLUTION: Authentication failed')
          console.log('   🔧 Steps to fix:')
          console.log('      1. Go to: http://vhdcom.local/wp-admin/profile.php')
          console.log('      2. Create Application Password named "Frontend Sync"')
          console.log('      3. Use that password instead of regular password')
        } else if (createResponse.status === 403) {
          console.log('   💡 SOLUTION: Permission denied')
          console.log('   🔧 Steps to fix:')
          console.log('      1. Ensure user has Editor or Administrator role')
          console.log('      2. Check if security plugins are blocking REST API')
        } else if (createResponse.status === 404) {
          console.log('   💡 SOLUTION: API endpoint not found')
          console.log('   🔧 Steps to fix:')
          console.log('      1. Check WordPress is running')
          console.log('      2. Verify permalinks are configured')
          console.log('      3. Ensure REST API is enabled')
        }
      }
    } catch (error) {
      console.log('   ❌ Test post creation error:', error.message)
    }
  }
  
  console.log('\n5️⃣ CHECKING NEWS CONTEXT STATE...')
  
  // Check if we can access news context
  try {
    const newsData = localStorage.getItem('news')
    if (newsData) {
      const news = JSON.parse(newsData)
      console.log('   📊 Local news count:', news.length)
      console.log('   📋 Recent news:', news.slice(0, 3).map(n => ({
        id: n.id,
        title: n.title,
        wpId: n.wpId
      })))
    } else {
      console.log('   📊 No local news data found')
    }
  } catch (error) {
    console.log('   ❌ Error reading news data:', error.message)
  }
  
  console.log('\n' + '='.repeat(60))
  
  console.log('\n🎯 DIAGNOSIS SUMMARY:')
  
  const wpSync = wpSyncEnabled === 'true'
  const autoSync = autoSyncEnabled === 'true'
  const hasSettings = !!wpSettingsStr
  
  if (!wpSync) {
    console.log('❌ ISSUE: WordPress sync is DISABLED')
    console.log('💡 SOLUTION: Enable WordPress sync in admin settings')
  } else if (!autoSync) {
    console.log('❌ ISSUE: Auto sync is DISABLED')
    console.log('💡 SOLUTION: Enable auto sync in admin settings')
  } else if (!hasSettings) {
    console.log('❌ ISSUE: WordPress settings are MISSING')
    console.log('💡 SOLUTION: Configure WordPress settings in admin panel')
  } else {
    console.log('✅ Settings appear correct')
    console.log('💡 Check WordPress connection and authentication above')
  }
  
  console.log('\n🔧 QUICK FIX COMMANDS:')
  console.log('// Enable all sync settings:')
  console.log('localStorage.setItem("wpSyncEnabled", "true")')
  console.log('localStorage.setItem("autoSyncEnabled", "true")')
  console.log('localStorage.setItem("bidirectionalSyncEnabled", "true")')
  
  console.log('\n// Set WordPress settings:')
  console.log('const wpSettings = {')
  console.log('  apiUrl: "http://vhdcom.local/wp-json/wp/v2",')
  console.log('  username: "admin",')
  console.log('  password: "admin",')
  console.log('  enabled: true')
  console.log('}')
  console.log('localStorage.setItem("wordpressSettings", JSON.stringify(wpSettings))')
  
  console.log('\n🔄 Reload page after running fix commands')
}

// Run debug
debugWordPressSync().catch(error => {
  console.error('❌ Debug script failed:', error)
  console.log('\n🛠️ MANUAL CHECKS:')
  console.log('1. Is WordPress running at http://vhdcom.local?')
  console.log('2. Is Next.js server running at http://localhost:3003?')
  console.log('3. Are browser console showing any errors?')
  console.log('4. Try the fix-all-errors.js script')
}) 