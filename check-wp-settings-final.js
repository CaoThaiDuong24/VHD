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

async function checkAndFixWordPressSettings() {
  console.log('🔧 KIỂM TRA VÀ FIX WORDPRESS SETTINGS');
  console.log('====================================');
  
  try {
    // 1. Test current authentication
    console.log('1️⃣ Test authentication hiện tại...');
    const testResponse = await makeRequest('http://localhost:3000/api/sync/wordpress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        action: 'create',
        data: {
          title: 'Test Auth - ' + new Date().toLocaleString('vi-VN'),
          content: 'Test authentication với settings hiện tại',
          status: 'draft'
        }
      }
    });

    console.log('📊 Kết quả test:', {
      status: testResponse.status,
      success: testResponse.data?.success,
      error: testResponse.data?.error?.substring(0, 100) + '...'
    });

    if (testResponse.status === 401 || testResponse.status === 500) {
      console.log('\n❌ Authentication FAILED - Cần cập nhật settings!');
      
      // 2. Create browser script to update WordPress settings
      console.log('\n2️⃣ Tạo script cập nhật WordPress Settings...');
      
      const browserScript = `
// 🔧 SCRIPT CẬP NHẬT WORDPRESS SETTINGS
console.log('🔧 Updating WordPress Settings...');

// WordPress settings với thông tin đúng
const wpSettings = {
  wpUrl: 'http://vhdcom.local',
  wpUsername: 'duong',
  wpPassword: 'kUgT g3ox OJcE yvN3 BCgp tyyZ',
  wpSyncEnabled: true,
  autoSyncEnabled: true,
  bidirectionalSyncEnabled: true
};

// Save to localStorage
localStorage.setItem('wpUrl', wpSettings.wpUrl);
localStorage.setItem('wpUsername', wpSettings.wpUsername);
localStorage.setItem('wpPassword', wpSettings.wpPassword);
localStorage.setItem('wpSyncEnabled', 'true');
localStorage.setItem('autoSyncEnabled', 'true');
localStorage.setItem('bidirectionalSyncEnabled', 'true');

console.log('✅ Updated WordPress settings:', wpSettings);

// Test ngay lập tức
fetch('/api/sync/wordpress', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    action: 'create',
    data: {
      title: 'Test From Browser - ' + new Date().toLocaleString('vi-VN'),
      content: 'Test sau khi cập nhật WordPress settings từ browser',
      excerpt: 'Test browser settings update',
      status: 'draft'
    }
  })
})
.then(response => response.json())
.then(data => {
  console.log('🎉 Test result after settings update:', data);
  if (data.success) {
    alert('✅ SUCCESS! WordPress settings đã được cập nhật và hoạt động!');
  } else {
    console.error('❌ Still failed:', data.error);
  }
})
.catch(error => {
  console.error('❌ Test error:', error);
});
`;

      require('fs').writeFileSync('update-wp-settings-browser.js', browserScript);
      console.log('✅ Đã tạo: update-wp-settings-browser.js');

      console.log('\n📋 HƯỚNG DẪN FIX:');
      console.log('1. Mở browser tại: http://localhost:3000/admin/wordpress-settings');
      console.log('2. Mở DevTools (F12) → Console tab');
      console.log('3. Copy và paste script từ file: update-wp-settings-browser.js');
      console.log('4. Hoặc điền thủ công:');
      console.log('   - WordPress URL: http://vhdcom.local');
      console.log('   - Username: duong');
      console.log('   - Password: kUgT g3ox OJcE yvN3 BCgp tyyZ');
      console.log('   - Auto Sync: ✓ Enabled');
      console.log('5. Click "Lưu cấu hình"');
      console.log('6. Test tạo bài viết tại: http://localhost:3000/admin/news/create');

    } else {
      console.log('\n✅ Authentication THÀNH CÔNG!');
      console.log('WordPress settings đã được cấu hình đúng.');
      
      if (testResponse.data?.wpId) {
        console.log(`🎉 WordPress Post ID: ${testResponse.data.wpId}`);
      }
    }

    console.log('\n🔍 Để kiểm tra WordPress posts hiện có:');
    const wpPosts = await makeRequest('http://vhdcom.local/wp-json/wp/v2/posts?per_page=10');
    if (Array.isArray(wpPosts.data)) {
      console.log(`📊 WordPress có ${wpPosts.data.length} posts:`);
      wpPosts.data.forEach(post => {
        console.log(`  - ID ${post.id}: ${post.title?.rendered} (${post.date})`);
      });
    }

  } catch (error) {
    console.error('❌ LỖI:', error.message);
    console.error('Stack:', error.stack);
  }
}

checkAndFixWordPressSettings(); 