// Test kết nối với WordPress local vhdcom.local
const testVhdcomWordPress = async () => {
  console.log('🧪 Testing vhdcom.local WordPress connection...\n')

  const baseUrl = 'http://vhdcom.local/wp-json/wp/v2'

  // Test 1: Kiểm tra WordPress REST API
  console.log('1️⃣ Testing WordPress REST API accessibility...')
  try {
    const response = await fetch(`${baseUrl}/posts?per_page=5`)
    
    if (response.ok) {
      const posts = await response.json()
      console.log('✅ WordPress REST API: ACCESSIBLE')
      console.log(`   Found ${posts.length} posts`)
      
      // Show first post details
      if (posts.length > 0) {
        const firstPost = posts[0]
        console.log(`   Latest post: "${firstPost.title.rendered}"`)
        console.log(`   Date: ${firstPost.date}`)
        console.log(`   Status: ${firstPost.status}`)
      }
    } else {
      console.log(`❌ WordPress REST API: HTTP ${response.status}`)
      const errorText = await response.text()
      console.log(`   Error: ${errorText.substring(0, 200)}...`)
    }
  } catch (error) {
    console.log('❌ WordPress REST API: CONNECTION FAILED')
    console.log(`   Error: ${error.message}`)
  }

  console.log('\n' + '='.repeat(50) + '\n')

  // Test 2: Test qua Next.js API
  console.log('2️⃣ Testing via Next.js API...')
  try {
    const response = await fetch('http://localhost:3000/api/sync/wordpress?action=health')
    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Next.js API connection: SUCCESS')
      console.log(`   Message: ${result.message}`)
    } else {
      console.log('❌ Next.js API connection: FAILED')
      console.log(`   Error: ${result.error}`)
    }
  } catch (error) {
    console.log('❌ Next.js API connection: ERROR')
    console.log(`   Error: ${error.message}`)
  }

  console.log('\n' + '='.repeat(50) + '\n')

  // Test 3: Test fetch posts
  console.log('3️⃣ Testing posts fetch via Next.js API...')
  try {
    const response = await fetch('http://localhost:3000/api/sync/wordpress?action=fetch-all')
    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Posts fetch: SUCCESS')
      console.log(`   Found ${result.data?.length || 0} posts`)
      
      // Show sample posts
      if (result.data && result.data.length > 0) {
        console.log('   Sample posts:')
        result.data.slice(0, 3).forEach((post, index) => {
          console.log(`   ${index + 1}. ${post.title.rendered}`)
        })
      }
    } else {
      console.log('❌ Posts fetch: FAILED')
      console.log(`   Error: ${result.error}`)
    }
  } catch (error) {
    console.log('❌ Posts fetch: ERROR')
    console.log(`   Error: ${error.message}`)
  }

  console.log('\n' + '='.repeat(50) + '\n')

  // Test 4: Test categories và tags
  console.log('4️⃣ Testing categories and tags...')
  try {
    const [categoriesRes, tagsRes] = await Promise.all([
      fetch(`${baseUrl}/categories`),
      fetch(`${baseUrl}/tags`)
    ])

    if (categoriesRes.ok) {
      const categories = await categoriesRes.json()
      console.log(`✅ Categories: Found ${categories.length} categories`)
    } else {
      console.log(`❌ Categories: HTTP ${categoriesRes.status}`)
    }

    if (tagsRes.ok) {
      const tags = await tagsRes.json()
      console.log(`✅ Tags: Found ${tags.length} tags`)
    } else {
      console.log(`❌ Tags: HTTP ${tagsRes.status}`)
    }
  } catch (error) {
    console.log('❌ Categories/Tags test: ERROR')
    console.log(`   Error: ${error.message}`)
  }

  console.log('\n' + '='.repeat(50) + '\n')
  console.log('🎯 Test completed!')
  console.log('\n📋 Kết quả:')
  console.log('- Nếu thấy ✅: WordPress đã kết nối thành công')  
  console.log('- Nếu thấy ❌: Cần kiểm tra cấu hình WordPress')
  console.log('\n💡 Hướng dẫn tiếp theo:')
  console.log('1. Tạo Application Password trong WordPress Admin')
  console.log('2. Cập nhật .env.local với thông tin đăng nhập')
  console.log('3. Test lại kết nối')
}

// Run tests
testVhdcomWordPress().catch(console.error) 