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
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testApplicationPassword() {
  console.log('🔍 KIỂM TRA APPLICATION PASSWORD');
  console.log('Application Password: kUgT g3ox OJcE yvN3 BCgp tyyZ');
  console.log('=' .repeat(50));
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing WordPress connection...');
    const healthResponse = await makeRequest('http://localhost:3000/api/sync/wordpress?action=health');
    console.log('✅ Health Status:', healthResponse.data.status);
    
    // Test 2: Create post với Application Password
    console.log('\n2️⃣ Testing create post với Application Password...');
    
    const testPost = {
      title: 'TEST SUCCESS - Application Password Working! - ' + new Date().toLocaleString('vi-VN'),
      content: 'Đây là bài test để xác nhận Application Password đã hoạt động thành công! WordPress sync đã được thiết lập hoàn chỉnh.',
      excerpt: 'Test thành công với Application Password',
      status: 'publish'
    };
    
    console.log('📝 Creating post:', testPost.title);
    
    const createResponse = await makeRequest('http://localhost:3000/api/sync/wordpress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'create',
        data: testPost
      })
    });
    
    console.log('\n📊 RESULTS:');
    console.log('Status Code:', createResponse.status);
    
    if (createResponse.ok) {
      console.log('🎉 SUCCESS! Application Password đã hoạt động!');
      console.log('✅ WordPress Post ID:', createResponse.data.wpId);
      console.log('✅ Post Title:', createResponse.data.title);
      console.log('✅ WordPress URL:', `http://vhdcom.local/wp-admin/post.php?post=${createResponse.data.wpId}&action=edit`);
      
      console.log('\n🎯 HOÀN THÀNH SETUP!');
      console.log('📱 Frontend: http://localhost:3000/admin/news/create');
      console.log('🌐 WordPress: http://vhdcom.local/wp-admin/edit.php');
      console.log('⚙️ Settings: http://localhost:3000/admin/wordpress-settings');
      
      console.log('\n💡 Bây giờ bạn có thể:');
      console.log('1. Tạo tin tức từ frontend → Tự động sync lên WordPress');
      console.log('2. Kiểm tra bài viết trong WordPress admin');
      console.log('3. Auto-sync sẽ hoạt động cho tất cả bài viết mới');
      
    } else {
      console.log('❌ FAILED!');
      console.log('Error Details:', createResponse.data);
      
      if (createResponse.data.error?.includes('rest_cannot_create')) {
        console.log('\n🔧 VẪN CẦN CẤU HÌNH:');
        console.log('1. Vào: http://localhost:3000/admin/wordpress-settings');
        console.log('2. Username: admin');
        console.log('3. Password: kUgT g3ox OJcE yvN3 BCgp tyyZ');
        console.log('4. Save Settings');
      }
    }
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
    console.log('🔧 Đảm bảo server đang chạy tại http://localhost:3000');
  }
}

testApplicationPassword(); 