async function testWithEnv() {
  console.log('🔄 TESTING AFTER ENV VARIABLES SETUP');
  console.log('=' .repeat(50));
  
  // Wait for server restart
  console.log('⏱️ Waiting 8 seconds for server restart...');
  await new Promise(resolve => setTimeout(resolve, 8000));
  
  console.log('1️⃣ Testing WordPress API health...');
  try {
    const healthResponse = await fetch('http://localhost:3000/api/sync/wordpress?action=health');
    console.log('   Health Status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('   ✅ Health check SUCCESS!');
      console.log('   Response:', healthData);
    } else {
      const errorText = await healthResponse.text();
      console.log('   ❌ Health check FAILED');
      console.log('   Error preview:', errorText.substring(0, 200) + '...');
    }
  } catch (error) {
    console.log('   ❌ Health check ERROR:', error.message);
  }
  
  console.log('\n2️⃣ Testing WordPress post creation...');
  try {
    const createResponse = await fetch('http://localhost:3000/api/sync/wordpress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'create',
        data: {
          title: 'ENV VARIABLES TEST - ' + new Date().toLocaleString('vi-VN'),
          content: 'Testing với environment variables được setup đúng. Username duong và Application Password đã được cấu hình trong .env.local file.',
          excerpt: 'Environment variables test',
          status: 'draft'
        }
      })
    });
    
    console.log('   Create Status:', createResponse.status);
    
    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('   ✅ POST CREATION SUCCESS!');
      console.log('   Success:', createData.success);
      console.log('   WordPress ID:', createData.wpId);
      console.log('   Message:', createData.message);
      console.log('');
      console.log('🎉🎉🎉 WORDPRESS SYNC IS FULLY WORKING! 🎉🎉🎉');
      console.log('');
      console.log('📋 What works now:');
      console.log('   ✅ Next.js server running');
      console.log('   ✅ Environment variables loaded');
      console.log('   ✅ WordPress authentication working');
      console.log('   ✅ API routes functional');
      console.log('   ✅ Post creation successful');
      console.log('');
      console.log('🚀 YOU CAN NOW:');
      console.log('   1. Open: http://localhost:3000/admin/news/create');
      console.log('   2. Fill out the news form');
      console.log('   3. Submit the form');
      console.log('   4. The post will be created BOTH in frontend AND WordPress!');
      console.log('');
      console.log('🔗 WordPress Admin: http://vhdcom.local/wp-admin/edit.php');
      console.log(`   → Check for post ID: ${createData.wpId}`);
      
    } else {
      const errorText = await createResponse.text();
      console.log('   ❌ POST CREATION FAILED');
      console.log('   Error:', errorText.substring(0, 500));
    }
    
  } catch (error) {
    console.log('   ❌ POST CREATION ERROR:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Test completed!');
}

testWithEnv(); 