const http = require('http');

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ ok: res.statusCode < 400, status: res.statusCode, data: result });
        } catch (error) {
          resolve({ ok: res.statusCode < 400, status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function testFixedAuth() {
  console.log('🧪 TESTING FIXED AUTHENTICATION');
  console.log('=' .repeat(50));
  
  // Wait for server restart
  console.log('⏱️  Waiting 5 seconds for server to restart...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  try {
    console.log('1️⃣ Testing Frontend API với credentials FIX...');
    
    const frontendTest = await makeRequest('http://localhost:3000/api/sync/wordpress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        action: 'create',
        data: {
          title: 'AUTHENTICATION FIXED TEST - ' + new Date().toLocaleString('vi-VN'),
          content: 'Testing authentication sau khi fix credentials trong route.ts với username duong và Application Password chính xác.',
          excerpt: 'Authentication fixed test',
          status: 'draft'
        }
      }
    });

    console.log('📊 Frontend API Result:');
    console.log('Status:', frontendTest.status);
    console.log('Success:', frontendTest.data?.success);
    console.log('WordPress ID:', frontendTest.data?.wpId);
    console.log('Error:', frontendTest.data?.error);
    
    if (frontendTest.ok && frontendTest.data?.success && frontendTest.data?.wpId) {
      console.log('🎉🎉🎉 AUTHENTICATION COMPLETELY FIXED!');
      console.log('✅ Frontend can now create WordPress posts successfully!');
      console.log(`✅ Created WordPress Post ID: ${frontendTest.data.wpId}`);
      
      // Test một lần nữa để confirm
      console.log('\n2️⃣ Double-checking với test thứ 2...');
      
      const secondTest = await makeRequest('http://localhost:3000/api/sync/wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          action: 'create',
          data: {
            title: 'DOUBLE CHECK TEST - ' + new Date().toLocaleString('vi-VN'),
            content: 'Testing lần 2 để confirm authentication hoạt động ổn định.',
            excerpt: 'Double check test',
            status: 'draft'
          }
        }
      });
      
      if (secondTest.ok && secondTest.data?.success) {
        console.log('🎉 DOUBLE CHECK SUCCESS!');
        console.log(`✅ Second WordPress Post ID: ${secondTest.data.wpId}`);
        console.log('\n🏆 AUTHENTICATION COMPLETELY RESOLVED!');
        console.log('💡 Frontend có thể tạo bài viết WordPress thành công!');
      } else {
        console.log('⚠️  Second test failed - authentication có thể không ổn định');
      }
      
    } else {
      console.log('❌ Authentication vẫn FAILED');
      console.log('🔍 Chi tiết lỗi:', frontendTest.data);
      
      // Debug thêm
      console.log('\n🔍 Debugging connection...');
      const healthTest = await makeRequest('http://localhost:3000/api/sync/wordpress?action=health');
      console.log('Health check:', healthTest.data);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Test completed');
}

testFixedAuth(); 