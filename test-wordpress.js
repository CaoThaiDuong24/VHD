// Quick WordPress connection test
const testWordPressConnection = async () => {
  const testUrl = 'http://vhdcom.local'
  const baseApiUrl = testUrl.replace(/\/+$/, '') + '/wp-json/wp/v2'
  
  console.log('🔍 Testing WordPress connection...')
  console.log('📍 Base URL:', testUrl)
  console.log('🔗 API URL:', baseApiUrl)
  
  try {
    // Test basic connectivity
    console.log('\n1️⃣ Testing basic connectivity...')
    const response = await fetch(baseApiUrl)
    
    if (response.ok) {
      console.log('✅ WordPress REST API is accessible')
      const data = await response.json()
      console.log('📊 API Response keys:', Object.keys(data))
    } else {
      console.log('❌ WordPress REST API error:', response.status, response.statusText)
      const errorText = await response.text()
      console.log('📝 Error details:', errorText)
    }
    
    // Test posts endpoint
    console.log('\n2️⃣ Testing posts endpoint...')
    const postsResponse = await fetch(`${baseApiUrl}/posts?per_page=1`)
    
    if (postsResponse.ok) {
      const posts = await postsResponse.json()
      console.log('✅ Posts endpoint accessible')
      console.log('📈 Posts found:', Array.isArray(posts) ? posts.length : 'Unknown')
    } else {
      console.log('❌ Posts endpoint error:', postsResponse.status)
    }
    
  } catch (error) {
    console.log('💥 Connection failed:', error.message)
    console.log('🔧 Possible solutions:')
    console.log('   • Check if XAMPP/Local server is running')
    console.log('   • Verify WordPress is accessible at http://vhdcom.local')
    console.log('   • Check WordPress permalinks (Settings → Permalinks)')
    console.log('   • Ensure REST API is enabled')
  }
}

// Run the test
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch')
  testWordPressConnection()
} else {
  // Browser environment
  console.log('Run this in browser console or Node.js')
  window.testWordPressConnection = testWordPressConnection
} 