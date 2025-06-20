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

async function emergencyFixAuth() {
  console.log('🚨 EMERGENCY WORDPRESS AUTH FIX - TRIỆT ĐỂ');
  console.log('=============================================');
  
  // 1. Test direct WordPress API với credentials chính xác
  console.log('1️⃣ Test DIRECT WordPress API...');
  
  try {
    const wpTestResponse = await fetch('http://vhdcom.local/wp-json/wp/v2/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from('duong:kUgT g3ox OJcE yvN3 BCgp tyyZ').toString('base64')
      },
      body: JSON.stringify({
        title: 'Direct API Test Emergency - ' + new Date().toLocaleString('vi-VN'),
        content: 'Testing direct WordPress API với credentials duong',
        status: 'draft'
      })
    });

    const wpResult = await wpTestResponse.json();
    console.log('📊 Direct WordPress API result:', {
      status: wpTestResponse.status,
      success: wpTestResponse.ok,
      postId: wpResult.id || 'No ID',
      error: wpResult.code || 'No error'
    });

    if (wpTestResponse.ok && wpResult.id) {
      console.log('✅ DIRECT API SUCCESS! WordPress credentials are CORRECT');
      console.log(`🎉 Created WordPress Post ID: ${wpResult.id}`);
    } else {
      console.log('❌ DIRECT API FAILED! Credentials issue:', wpResult);
      
      // Test với users endpoint để check username
      console.log('\n🔍 Testing WordPress users endpoint...');
      const usersResponse = await fetch('http://vhdcom.local/wp-json/wp/v2/users');
      const users = await usersResponse.json();
      console.log('👥 WordPress users:', users.map(u => ({ id: u.id, name: u.name, slug: u.slug })));
    }

  } catch (error) {
    console.error('❌ Direct API test failed:', error.message);
  }

  console.log('\n' + '='.repeat(50));

  // 2. Test frontend API
  console.log('\n2️⃣ Test Frontend API...');
  
  try {
    const frontendTest = await makeRequest('http://localhost:3000/api/sync/wordpress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        action: 'create',
        data: {
          title: 'Frontend API Test Emergency - ' + new Date().toLocaleString('vi-VN'),
          content: 'Testing frontend API with emergency fix',
          status: 'draft'
        }
      }
    });

    console.log('📊 Frontend API result:', {
      status: frontendTest.status,
      success: frontendTest.data?.success || false,
      wpId: frontendTest.data?.wpId || 'No ID',
      error: frontendTest.data?.error?.substring(0, 100) + '...' || 'No error'
    });

  } catch (error) {
    console.error('❌ Frontend API test failed:', error.message);
  }

  console.log('\n' + '='.repeat(50));

  // 3. Tạo SUPER BROWSER SCRIPT để fix hoàn toàn
  console.log('\n3️⃣ Tạo SUPER BROWSER FIX SCRIPT...');
  
  const superBrowserScript = `
// 🚨 SUPER EMERGENCY WORDPRESS AUTH FIX
console.log('🚨 SUPER EMERGENCY FIX - Starting...');

// BƯỚC 1: Clear HOÀN TOÀN tất cả WordPress data
console.log('BƯỚC 1: Clearing ALL WordPress data...');
[
  'wpUrl', 'wpUsername', 'wpPassword', 'wpApiUrl', 'wpAuth', 'wpSyncEnabled', 
  'autoSyncEnabled', 'bidirectionalSyncEnabled', 'wp_url', 'wp_username', 
  'wp_password', 'wp_api_url', 'wpConnectionStatus', 'lastWpSync'
].forEach(key => {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
});

// Clear cookies
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});

console.log('✅ Cleared all WordPress data');

// BƯỚC 2: Set SUPER CORRECT settings
console.log('BƯỚC 2: Setting SUPER CORRECT settings...');
const superSettings = {
  wpUrl: 'http://vhdcom.local',
  wpUsername: 'duong',
  wpPassword: 'kUgT g3ox OJcE yvN3 BCgp tyyZ',
  wpSyncEnabled: 'true',
  autoSyncEnabled: 'true',
  bidirectionalSyncEnabled: 'true'
};

// Set multiple times để đảm bảo
Object.entries(superSettings).forEach(([key, value]) => {
  localStorage.setItem(key, value);
  sessionStorage.setItem(key, value);
});

console.log('✅ Set SUPER settings:', superSettings);

// BƯỚC 3: Verify settings
console.log('BƯỚC 3: Verifying settings...');
const verification = {};
Object.keys(superSettings).forEach(key => {
  verification[key] = {
    localStorage: localStorage.getItem(key),
    sessionStorage: sessionStorage.getItem(key)
  };
});
console.log('📋 Verification:', verification);

// BƯỚC 4: Test TRỰC TIẾP WordPress API từ browser
console.log('BƯỚC 4: Testing DIRECT WordPress API from browser...');
const credentials = btoa('duong:kUgT g3ox OJcE yvN3 BCgp tyyZ');
fetch('http://vhdcom.local/wp-json/wp/v2/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + credentials
  },
  body: JSON.stringify({
    title: 'SUPER DIRECT TEST - ' + new Date().toLocaleString('vi-VN'),
    content: 'Testing direct từ browser với credentials chính xác',
    status: 'draft'
  })
})
.then(response => {
  console.log('📡 Direct WordPress Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('🎯 Direct WordPress Result:', data);
  
  if (data.id) {
    console.log('🎉🎉 DIRECT WORDPRESS SUCCESS!');
    console.log('✅ WordPress Post ID:', data.id);
    
    // Nếu direct API work, test frontend API
    console.log('BƯỚC 5: Testing Frontend API...');
    return fetch('/api/sync/wordpress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'create',
        data: {
          title: 'SUPER FRONTEND TEST - ' + new Date().toLocaleString('vi-VN'),
          content: 'Testing frontend API sau khi fix settings hoàn toàn',
          excerpt: 'Super frontend test',
          status: 'draft'
        }
      })
    });
  } else {
    throw new Error('Direct WordPress failed: ' + (data.message || 'Unknown error'));
  }
})
.then(response => {
  console.log('📡 Frontend API Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('🎯 Frontend API Result:', data);
  
  if (data.success && data.wpId) {
    console.log('🎉🎉🎉 HOÀN TOÀN SUCCESS!');
    console.log('✅ Frontend WordPress Post ID:', data.wpId);
    alert('🎉 HOÀN TOÀN SUCCESS!\\n\\nDirect WordPress: SUCCESS\\nFrontend API: SUCCESS\\nWordPress Post ID: ' + data.wpId);
  } else {
    console.error('❌ Frontend API still failed:', data.error);
    alert('❌ Direct WordPress SUCCESS nhưng Frontend API vẫn failed:\\n' + (data.error || 'Unknown error'));
  }
})
.catch(error => {
  console.error('❌ Error in test chain:', error);
  alert('❌ Error: ' + error.message);
});

console.log('✅ SUPER FIX script started. Waiting for results...');
`;

  require('fs').writeFileSync('super-emergency-fix.js', superBrowserScript);
  console.log('✅ Đã tạo: super-emergency-fix.js');

  console.log('\n🎯 HƯỚNG DẪN FIX CUỐI CÙNG:');
  console.log('=' .repeat(50));
  console.log('1. Mở: http://localhost:3000/admin/wordpress-settings');
  console.log('2. Mở DevTools (F12) → Console tab');
  console.log('3. Copy TOÀN BỘ nội dung file: super-emergency-fix.js');
  console.log('4. Paste vào Console và nhấn Enter');
  console.log('5. Script sẽ:');
  console.log('   ✅ Clear tất cả WordPress data');
  console.log('   ✅ Set credentials chính xác (duong + Application Password)');
  console.log('   ✅ Test TRỰC TIẾP WordPress API');
  console.log('   ✅ Test Frontend API');
  console.log('   ✅ Báo kết quả SUCCESS hoặc FAILED với chi tiết');
  console.log('');
  console.log('🔧 Nếu Direct WordPress SUCCESS nhưng Frontend vẫn FAILED:');
  console.log('   → Vấn đề ở Frontend code, không phải credentials');
  console.log('   → Tôi sẽ fix Frontend code');
  console.log('');
  console.log('🔧 Nếu cả hai đều FAILED:');
  console.log('   → Vấn đề ở WordPress server hoặc Application Password');
  console.log('   → Cần check WordPress admin');
  
  console.log('\n📋 CREDENTIALS CHÍNH XÁC:');
  console.log('   Username: duong');
  console.log('   Password: kUgT g3ox OJcE yvN3 BCgp tyyZ');
  console.log('   URL: http://vhdcom.local');
  console.log('   Base64: ' + Buffer.from('duong:kUgT g3ox OJcE yvN3 BCgp tyyZ').toString('base64'));
}

emergencyFixAuth(); 