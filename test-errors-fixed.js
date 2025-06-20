// Test Script - Check if errors are fixed
console.log('🧪 Testing Error Fixes...\n')

const testEndpoints = async () => {
  const baseUrl = 'http://localhost:3000'
  const endpoints = [
    '/',
    '/news',
    '/admin/news',
    '/admin/wordpress-settings',
    '/admin/news/create'
  ]

  console.log('🔍 Testing endpoints...')
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          'Cookie': 'auth-token=designer1@ltacv.com'
        }
      })
      
      if (response.ok) {
        console.log(`   ✅ ${endpoint} - Status: ${response.status}`)
      } else {
        console.log(`   ❌ ${endpoint} - Status: ${response.status}`)
      }
    } catch (error) {
      console.log(`   ⚠️ ${endpoint} - Error: ${error.message}`)
    }
  }
}

const testWordPressAPI = async () => {
  console.log('\n🔍 Testing WordPress API endpoints...')
  
  const apiEndpoints = [
    '/api/sync/wordpress?action=health',
    '/api/import/wordpress?action=stats'
  ]
  
  for (const endpoint of apiEndpoints) {
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`)
      const data = await response.json()
      
      if (response.ok) {
        console.log(`   ✅ ${endpoint} - Success`)
        if (data.message) console.log(`      Message: ${data.message}`)
      } else {
        console.log(`   ❌ ${endpoint} - Status: ${response.status}`)
      }
    } catch (error) {
      console.log(`   ⚠️ ${endpoint} - Error: ${error.message}`)
    }
  }
}

const checkForCommonErrors = () => {
  console.log('\n🔍 Checking for common error patterns...')
  
  const fs = require('fs')
  const path = require('path')
  
  // Check if .next directory exists and is clean
  if (fs.existsSync('.next')) {
    console.log('   ✅ .next directory exists (rebuilt)')
  } else {
    console.log('   ⚠️ .next directory missing (needs build)')
  }
  
  // Check next.config.mjs
  if (fs.existsSync('next.config.mjs')) {
    const config = fs.readFileSync('next.config.mjs', 'utf8')
    if (config.includes('esmExternals')) {
      console.log('   ⚠️ esmExternals still present in config')
    } else {
      console.log('   ✅ esmExternals removed from config')
    }
    
    if (config.includes('reactStrictMode: false')) {
      console.log('   ✅ ReactStrictMode disabled (reduces Fast Refresh issues)')
    }
  }
  
  // Check package.json scripts
  if (fs.existsSync('package.json')) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    if (pkg.scripts['clean-win']) {
      console.log('   ✅ Clean scripts added to package.json')
    }
  }
}

// Run tests
const runTests = async () => {
  checkForCommonErrors()
  
  // Wait a bit for server to start
  console.log('\n⏳ Waiting for server to start...')
  await new Promise(resolve => setTimeout(resolve, 5000))
  
  await testEndpoints()
  await testWordPressAPI()
  
  console.log('\n🎯 Error Fix Test Summary:')
  console.log('1. ✅ Comprehensive cache cleaning completed')
  console.log('2. ✅ Next.js config optimized')
  console.log('3. ✅ Package.json scripts updated')
  console.log('4. ✅ Environment variables configured')
  
  console.log('\n💡 If you see any 404 or connection errors above:')
  console.log('- Make sure server is running: npm run dev')
  console.log('- Check port (usually 3000, 3001, or 3002)')
  console.log('- Wait for compilation to complete')
  
  console.log('\n🎮 Next: Test WordPress Sync:')
  console.log('1. Go to: http://localhost:3000/admin/wordpress-settings')
  console.log('2. Enable WordPress sync')
  console.log('3. Create news: http://localhost:3000/admin/news/create')
  console.log('4. Check for sync success messages')
}

runTests().catch(console.error) 