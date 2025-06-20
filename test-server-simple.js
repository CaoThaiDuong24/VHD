// Simple Server Test - Check if pages load
console.log('🧪 Testing Server Status...\n')

const testEndpoints = async () => {
  const baseUrl = 'http://localhost:3000'
  const endpoints = [
    { path: '/', name: 'Homepage' },
    { path: '/news', name: 'News Page' },
    { path: '/admin/news', name: 'Admin News' },
    { path: '/admin/wordpress-settings', name: 'WordPress Settings' },
    { path: '/admin/news/create', name: 'Create News' }
  ]

  console.log('🔍 Testing main endpoints...')
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint.path}`, {
        headers: {
          'Cookie': 'auth-token=designer1@ltacv.com',
          'User-Agent': 'Test-Script/1.0'
        }
      })
      
      const status = response.status
      const statusIcon = status === 200 ? '✅' : status < 400 ? '⚠️' : '❌'
      
      console.log(`   ${statusIcon} ${endpoint.name}: ${status}`)
      
      if (status === 200) {
        const text = await response.text()
        const hasContent = text.length > 1000
        console.log(`      Content: ${hasContent ? 'OK' : 'Small'} (${text.length} chars)`)
      }
      
    } catch (error) {
      console.log(`   ❌ ${endpoint.name}: ERROR - ${error.message}`)
    }
  }
}

const testWordPressAPI = async () => {
  console.log('\n🔍 Testing WordPress API endpoints...')
  
  const apiEndpoints = [
    { path: '/api/sync/wordpress?action=health', name: 'WordPress Health' },
    { path: '/api/import/wordpress?action=stats', name: 'Import Stats' }
  ]
  
  for (const endpoint of apiEndpoints) {
    try {
      const response = await fetch(`http://localhost:3000${endpoint.path}`)
      const status = response.status
      const statusIcon = status === 200 ? '✅' : '❌'
      
      console.log(`   ${statusIcon} ${endpoint.name}: ${status}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.message) {
          console.log(`      Message: ${data.message}`)
        }
        if (data.success !== undefined) {
          console.log(`      Success: ${data.success}`)
        }
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint.name}: ERROR - ${error.message}`)
    }
  }
}

const testWordPressDirect = async () => {
  console.log('\n🔍 Testing direct WordPress connection...')
  
  try {
    const response = await fetch('http://vhdcom.local/wp-json/wp/v2/posts?per_page=1')
    
    if (response.ok) {
      const posts = await response.json()
      console.log('   ✅ WordPress Direct: Connected')
      console.log(`      Posts available: ${posts.length}`)
      
      if (posts.length > 0) {
        console.log(`      Latest post: "${posts[0].title.rendered}"`)
      }
    } else {
      console.log(`   ❌ WordPress Direct: HTTP ${response.status}`)
    }
  } catch (error) {
    console.log(`   ❌ WordPress Direct: ${error.message}`)
  }
}

// Run all tests
const runTests = async () => {
  try {
    await testEndpoints()
    await testWordPressAPI()
    await testWordPressDirect()
    
    console.log('\n🎯 Test Summary:')
    console.log('1. Check if all endpoints return 200 OK')
    console.log('2. Verify WordPress API is working')
    console.log('3. Confirm direct WordPress connection')
    
    console.log('\n💡 Next Steps:')
    console.log('1. Open browser: http://localhost:3000')
    console.log('2. Go to admin: http://localhost:3000/admin/news')
    console.log('3. Test WordPress settings: http://localhost:3000/admin/wordpress-settings')
    console.log('4. Create news: http://localhost:3000/admin/news/create')
    
    console.log('\n🎮 Manual WordPress Sync Test:')
    console.log('1. Open browser console (F12)')
    console.log('2. Go to WordPress settings page')
    console.log('3. Enable WordPress sync')
    console.log('4. Create a test news article')
    console.log('5. Check WordPress admin: http://vhdcom.local/wp-admin/edit.php')
    
  } catch (error) {
    console.log('\n❌ Test execution failed:', error.message)
  }
}

runTests() 