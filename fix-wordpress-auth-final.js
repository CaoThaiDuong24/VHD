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

async function fixWordPressAuth() {
  console.log('🔧 FIX WORDPRESS AUTHENTICATION - FINAL');
  console.log('========================================');
  
  try {
    // 1. Kiểm tra trạng thái hiện tại
    console.log('1️⃣ Kiểm tra authentication hiện tại...');
    const currentTest = await makeRequest('http://localhost:3000/api/sync/wordpress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        action: 'create',
        data: {
          title: 'Auth Test - ' + new Date().toLocaleString('vi-VN'),
          content: 'Testing current authentication',
          status: 'draft'
        }
      }
    });

    console.log('📊 Current status:', {
      status: currentTest.status,
      success: currentTest.data?.success || false,
      error: currentTest.data?.error?.substring(0, 80) + '...' || 'No error message'
    });

    if (currentTest.status === 401 || (currentTest.status === 500 && currentTest.data?.error?.includes('rest_cannot_create'))) {
      console.log('\n❌ AUTHENTICATION FAILED - Fixing...');
      
      // 2. Tạo comprehensive browser fix script
      console.log('\n2️⃣ Tạo Browser Fix Script...');
      
      const comprehensiveBrowserScript = `
// 🚨 EMERGENCY WORDPRESS AUTH FIX - COMPREHENSIVE
console.log('🚨 EMERGENCY WORDPRESS AUTH FIX - Starting...');

// Step 1: Clear ALL existing WordPress settings
console.log('Step 1: Clearing existing settings...');
const wpKeys = [
  'wpUrl', 'wpUsername', 'wpPassword', 'wpApiUrl', 'wpAuth',
  'wpSyncEnabled', 'autoSyncEnabled', 'bidirectionalSyncEnabled',
  'wp_url', 'wp_username', 'wp_password', 'wp_api_url'
];

wpKeys.forEach(key => {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
});

console.log('✅ Cleared all existing WordPress settings');

// Step 2: Set CORRECT WordPress credentials
console.log('Step 2: Setting CORRECT credentials...');
const correctSettings = {
  wpUrl: 'http://vhdcom.local',
  wpUsername: 'duong',
  wpPassword: 'kUgT g3ox OJcE yvN3 BCgp tyyZ',
  wpSyncEnabled: 'true',
  autoSyncEnabled: 'true',
  bidirectionalSyncEnabled: 'true'
};

// Set in localStorage
Object.entries(correctSettings).forEach(([key, value]) => {
  localStorage.setItem(key, value);
});

console.log('✅ Set correct WordPress settings:', correctSettings);

// Step 3: Verify localStorage
console.log('Step 3: Verifying localStorage...');
const verification = {};
Object.keys(correctSettings).forEach(key => {
  verification[key] = localStorage.getItem(key);
});
console.log('📋 Verification:', verification);

// Step 4: Force reload WordPress settings in UI (if on settings page)
console.log('Step 4: Refreshing UI...');
if (window.location.pathname.includes('wordpress-settings')) {
  // Try to trigger a page refresh or form update
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

// Step 5: Test authentication immediately
console.log('Step 5: Testing authentication...');
fetch('/api/sync/wordpress', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    action: 'create',
    data: {
      title: 'FIXED AUTH TEST - ' + new Date().toLocaleString('vi-VN'),
      content: 'Testing sau khi fix authentication với username duong và Application Password chính xác',
      excerpt: 'Fixed auth test',
      status: 'draft'
    }
  })
})
.then(response => {
  console.log('📡 Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('🎉 FINAL TEST RESULT:', data);
  
  if (data.success && data.wpId) {
    console.log('🎉🎉 SUCCESS! WordPress authentication FIXED!');
    console.log('✅ WordPress Post ID:', data.wpId);
    alert('🎉 SUCCESS! WordPress authentication đã được FIX thành công!\\n\\nWordPress Post ID: ' + data.wpId);
  } else {
    console.error('❌ STILL FAILED:', data.error);
    alert('❌ Vẫn còn lỗi: ' + (data.error || 'Unknown error'));
    
    // Debug info
    console.log('🔍 Debug info:');
    console.log('- Current URL:', window.location.href);
    console.log('- LocalStorage wpUsername:', localStorage.getItem('wpUsername'));
    console.log('- LocalStorage wpPassword:', localStorage.getItem('wpPassword'));
    console.log('- LocalStorage wpUrl:', localStorage.getItem('wpUrl'));
  }
})
.catch(error => {
  console.error('❌ Network error:', error);
  alert('❌ Network error: ' + error.message);
});

console.log('✅ Fix script completed. Check results above.');
`;

      require('fs').writeFileSync('fix-wordpress-auth-browser.js', comprehensiveBrowserScript);
      console.log('✅ Đã tạo: fix-wordpress-auth-browser.js');

      // 3. Tạo direct API test script  
      console.log('\n3️⃣ Tạo Direct API Test Script...');
      
      const directTestScript = `
// Direct WordPress API Test với credentials chính xác
const testData = {
  title: 'Direct API Test - ' + new Date().toLocaleString('vi-VN'),
  content: 'Testing direct WordPress API với username duong',
  status: 'draft',
  excerpt: 'Direct API test'
};

const credentials = 'duong:kUgT g3ox OJcE yvN3 BCgp tyyZ';
const authHeader = 'Basic ' + btoa(credentials);

console.log('🔍 Testing direct WordPress API...');
console.log('📝 Credentials:', 'duong:kUgT g3ox OJcE yvN3 BCgp tyyZ');
console.log('🔐 Auth header:', authHeader);

fetch('http://vhdcom.local/wp-json/wp/v2/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': authHeader
  },
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('📡 Direct API Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('🎯 Direct API Result:', data);
  if (data.id) {
    console.log('🎉 DIRECT API SUCCESS! Post ID:', data.id);
  } else {
    console.log('❌ Direct API failed:', data);
  }
})
.catch(error => {
  console.error('❌ Direct API error:', error);
});
`;

      require('fs').writeFileSync('test-direct-wordpress-api.js', directTestScript);
      console.log('✅ Đã tạo: test-direct-wordpress-api.js');

      console.log('\n🎯 HƯỚNG DẪN FIX NGAY:');
      console.log('=' .repeat(50));
      console.log('1. Mở: http://localhost:3000/admin/wordpress-settings');
      console.log('2. Mở DevTools (F12) → Console tab');
      console.log('3. Copy TOÀN BỘ nội dung file: fix-wordpress-auth-browser.js');
      console.log('4. Paste vào Console và nhấn Enter');
      console.log('5. Script sẽ tự động:');
      console.log('   - Xóa tất cả settings cũ');
      console.log('   - Set credentials chính xác (duong + Application Password)');
      console.log('   - Test authentication ngay lập tức');
      console.log('   - Báo kết quả SUCCESS hoặc FAILED');
      console.log('');
      console.log('🔧 Nếu vẫn lỗi, chạy thêm script: test-direct-wordpress-api.js');
      console.log('');
      console.log('✅ THÔNG TIN CHÍNH XÁC:');
      console.log('   Username: duong');
      console.log('   Password: kUgT g3ox OJcE yvN3 BCgp tyyZ');
      console.log('   URL: http://vhdcom.local');

    } else {
      console.log('\n✅ AUTHENTICATION WORKING!');
      
      if (currentTest.data?.wpId) {
        console.log(`🎉 WordPress Post ID: ${currentTest.data.wpId}`);
        console.log('✅ WordPress sync đã hoạt động bình thường!');
      }
    }

    // 4. Kiểm tra WordPress posts hiện có
    console.log('\n4️⃣ Kiểm tra WordPress Posts...');
    const wpPosts = await makeRequest('http://vhdcom.local/wp-json/wp/v2/posts?per_page=10');
    if (Array.isArray(wpPosts.data)) {
      console.log(`📊 WordPress có ${wpPosts.data.length} posts:`);
      wpPosts.data.forEach((post, index) => {
        console.log(`  ${index + 1}. ID ${post.id}: "${post.title?.rendered}" (${post.date})`);
      });
    }

    console.log('\n🎯 STATUS SUMMARY:');
    console.log('- Next.js Server: RUNNING (port 3000)');
    console.log('- WordPress: ACCESSIBLE (vhdcom.local)');
    console.log('- Authentication: ' + (currentTest.status === 200 && currentTest.data?.success ? '✅ WORKING' : '❌ FAILED'));
    console.log('- Required Action: ' + (currentTest.status === 200 && currentTest.data?.success ? 'NONE' : 'RUN BROWSER FIX SCRIPT'));

  } catch (error) {
    console.error('❌ SCRIPT ERROR:', error.message);
    console.error('Stack:', error.stack);
  }
}

fixWordPressAuth(); 