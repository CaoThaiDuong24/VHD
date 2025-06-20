const http = require('http');

async function testServerDirect() {
  console.log('🔍 DIRECT SERVER TEST');
  console.log('=' .repeat(40));
  
  // Test multiple endpoints
  const endpoints = [
    'http://localhost:3000/',
    'http://localhost:3000/api/sync/wordpress?action=health',
    'http://localhost:3000/admin/news'
  ];
  
  for (const url of endpoints) {
    console.log(`\n🧪 Testing: ${url}`);
    
    try {
      const response = await fetch(url);
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.status === 200) {
        console.log('   ✅ SUCCESS');
      } else if (response.status === 404) {
        console.log('   ❌ NOT FOUND - possible routing issue');
      } else if (response.status === 500) {
        console.log('   ❌ SERVER ERROR');
        const text = await response.text();
        console.log('   Error preview:', text.substring(0, 200) + '...');
      }
      
    } catch (error) {
      console.log(`   ❌ CONNECTION ERROR: ${error.message}`);
    }
  }
  
  // Test WordPress API creation directly
  console.log('\n🧪 Testing WordPress API directly...');
  try {
    const testData = {
      action: 'create',
      data: {
        title: 'DIRECT API TEST - ' + new Date().toLocaleString('vi-VN'),
        content: 'Testing WordPress API directly with fixed authentication.',
        excerpt: 'Direct API test',
        status: 'draft'
      }
    };
    
    const response = await fetch('http://localhost:3000/api/sync/wordpress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log(`   POST Status: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('   ✅ API SUCCESS!');
      console.log('   Success:', result.success);
      console.log('   WordPress ID:', result.wpId);
      console.log('   🎉 WORDPRESS SYNC IS WORKING!');
    } else {
      const errorText = await response.text();
      console.log('   ❌ API ERROR:', errorText.substring(0, 300));
    }
    
  } catch (error) {
    console.log(`   ❌ API CONNECTION ERROR: ${error.message}`);
  }
  
  console.log('\n' + '='.repeat(40));
  console.log('📋 Next steps if working:');
  console.log('1. Open browser: http://localhost:3000/admin/news/create');
  console.log('2. Fill in news form and submit');
  console.log('3. Should automatically create WordPress post');
}

testServerDirect(); 