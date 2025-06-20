// ===== BROWSER SCRIPT: Fix WordPress Sync =====
// Copy và paste vào Browser Console trên trang admin

console.log('🔧 FIX WORDPRESS SYNC & TEST');
console.log('============================');

// Enable all sync settings
localStorage.setItem('wpSyncEnabled', 'true');
localStorage.setItem('autoSyncEnabled', 'true');
localStorage.setItem('bidirectionalSyncEnabled', 'true');

// Set WordPress settings
const wpSettings = {
    apiUrl: 'http://vhdcom.local/wp-json/wp/v2',
    username: 'duong',
    password: 'kUgT g3ox OJcE yvN3 BCgp tyyZ',
    enabled: true
};
localStorage.setItem('wordpressSettings', JSON.stringify(wpSettings));

console.log('✅ All sync settings enabled');
console.log('📍 Please refresh page to activate');
console.log('');

// Test function
function testAutoSync() {
    console.log('🧪 Testing auto sync...');
    
    const testData = {
        title: 'BROWSER TEST AUTO SYNC - ' + new Date().toLocaleTimeString(),
        category: 'Test',
        description: 'Test từ browser console để check auto sync',
        detailContent: 'Nội dung test auto sync từ browser. Nếu thành công sẽ có WordPress post mới.',
        date: new Date().toLocaleDateString('vi-VN'),
        image: '/placeholder.svg',
        gallery: [],
        gradient: 'from-blue-500 to-purple-600',
        status: 'published',
        views: 0,
        readingTime: 2,
        featured: false,
        tags: ['browser-test'],
        author: 'Browser Test'
    };
    
    fetch('/api/sync/wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', data: testData })
    })
    .then(r => r.json())
    .then(data => {
        console.log('📡 Response:', data);
        if (data.success && data.wpId) {
            console.log(`🎉 SUCCESS! WordPress ID: ${data.wpId}`);
            console.log(`View at: http://vhdcom.local/?p=${data.wpId}`);
        } else {
            console.log('❌ Failed:', data.error || 'Unknown error');
        }
    })
    .catch(err => console.error('❌ Error:', err));
}

console.log('🎯 Run testAutoSync() to test');

// Auto-run test after settings applied
setTimeout(() => {
    console.log('🚀 Auto-running test in 2 seconds...');
    testAutoSync();
}, 2000);

// Step 1: Enable all sync settings
console.log('1️⃣ Enabling sync settings...');
localStorage.setItem('wpSyncEnabled', 'true');
localStorage.setItem('autoSyncEnabled', 'true');
localStorage.setItem('bidirectionalSyncEnabled', 'true');
console.log('   ✅ Sync settings enabled');

// Step 2: Configure WordPress settings with regular password first
console.log('\n2️⃣ Configuring WordPress settings...');
const savedSettings = JSON.parse(localStorage.getItem('wordpressSettings'));
console.log('   WordPress URL:', savedSettings.apiUrl);
console.log('   WordPress Username:', savedSettings.username);
console.log('   WordPress Enabled:', savedSettings.enabled);

// Step 3: Test current settings
console.log('\n3️⃣ Testing current settings...');
console.log('   wpSyncEnabled:', localStorage.getItem('wpSyncEnabled'));
console.log('   autoSyncEnabled:', localStorage.getItem('autoSyncEnabled'));
console.log('   bidirectionalSyncEnabled:', localStorage.getItem('bidirectionalSyncEnabled'));

// Step 4: Test WordPress connection
console.log('\n4️⃣ Testing WordPress connection...');
fetch('http://vhdcom.local/wp-json/wp/v2/posts?per_page=1')
  .then(response => {
    if (response.ok) {
      console.log('   ✅ WordPress read access: SUCCESS');
      return response.json();
    } else {
      console.log('   ❌ WordPress read access: FAILED');
      throw new Error('HTTP ' + response.status);
    }
  })
  .then(posts => {
    console.log('   📊 WordPress posts available:', posts.length);
    
    // Test write access
    console.log('\n5️⃣ Testing WordPress write access...');
    return fetch('http://vhdcom.local/wp-json/wp/v2/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('admin:admin')
      },
      body: JSON.stringify({
        title: 'Test Post from Browser - ' + new Date().toISOString(),
        content: 'Testing write access from browser console',
        status: 'draft'
      })
    });
  })
  .then(response => {
    console.log('   📝 Write test response:', response.status);
    if (response.status === 201) {
      console.log('   ✅ WordPress write access: SUCCESS');
      return response.json();
    } else if (response.status === 401) {
      console.log('   ❌ WordPress write access: AUTHENTICATION FAILED');
      console.log('   💡 NEED APPLICATION PASSWORD!');
      throw new Error('Need Application Password');
    } else {
      console.log('   ❌ WordPress write access: OTHER ERROR');
      throw new Error('HTTP ' + response.status);
    }
  })
  .then(createdPost => {
    console.log('   📄 Created post ID:', createdPost.id);
    
    // Clean up test post
    return fetch(`http://vhdcom.local/wp-json/wp/v2/posts/${createdPost.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic ' + btoa('admin:admin')
      }
    });
  })
  .then(() => {
    console.log('   🗑️ Test post cleaned up');
  })
  .catch(error => {
    if (error.message === 'Need Application Password') {
      console.log('\n🔑 NEXT STEPS:');
      console.log('1. Go to: http://vhdcom.local/wp-admin/profile.php');
      console.log('2. Scroll to "Application Passwords"');
      console.log('3. Enter name: "Frontend Sync"');
      console.log('4. Click "Add New Application Password"');
      console.log('5. Copy the generated password');
      console.log('6. Run this command with the new password:');
      console.log('');
      console.log('const wpSettings = {');
      console.log('  apiUrl: "http://vhdcom.local/wp-json/wp/v2",');
      console.log('  username: "admin",');
      console.log('  password: "YOUR_APPLICATION_PASSWORD_HERE",');
      console.log('  enabled: true');
      console.log('};');
      console.log('localStorage.setItem("wordpressSettings", JSON.stringify(wpSettings));');
      console.log('');
      console.log('7. Then reload the page: window.location.reload();');
    } else {
      console.log('   ❌ Error:', error.message);
    }
  });

// Step 6: Instructions for testing news creation
console.log('\n6️⃣ TESTING NEWS CREATION:');
console.log('After setting up Application Password:');
console.log('1. Go to: http://localhost:3001/admin/news/create');
console.log('2. Create a test news item');
console.log('3. Watch browser console for sync logs like:');
console.log('   "🔍 Sync Settings Check: { wpSyncEnabled: true, autoSyncEnabled: true, willSync: true }"');
console.log('   "🔄 Syncing news to WordPress..."');
console.log('   "✅ News synced to WordPress successfully"');
console.log('4. Check WordPress admin for the new post');

console.log('\n✅ SYNC SETTINGS APPLIED!');
console.log('📱 Now create a news item to test the sync!');

// Auto-reload in 3 seconds to apply settings
console.log('\n⏰ Auto-reloading page in 3 seconds...');
setTimeout(() => {
  window.location.reload();
}, 3000);

// BROWSER FIX SYNC - Final WordPress Auto Sync Test
console.log('🚀 WordPress Auto Sync Fix - Final Test');

// 1. Enable all localStorage settings
console.log('\n1️⃣ Enabling localStorage settings...');
localStorage.setItem('wpSyncEnabled', 'true');
localStorage.setItem('autoSyncEnabled', 'true');  
localStorage.setItem('bidirectionalSyncEnabled', 'true');

console.log('✅ Settings enabled:');
console.log('- wpSyncEnabled:', localStorage.getItem('wpSyncEnabled'));
console.log('- autoSyncEnabled:', localStorage.getItem('autoSyncEnabled'));
console.log('- bidirectionalSyncEnabled:', localStorage.getItem('bidirectionalSyncEnabled'));

// 2. Test WordPress API directly
console.log('\n2️⃣ Testing WordPress API...');

const testApiCall = async () => {
  try {
    const testData = {
      action: 'create',
      data: {
        id: Date.now(),
        title: `BROWSER FIX SYNC TEST - ${new Date().toLocaleTimeString()}`,
        content: 'Test sau khi fix handleSubmit để verify WordPress sync hoạt động từ browser.',
        description: 'Browser fix sync test',
        detailContent: 'Nội dung chi tiết test sau khi fix',
        excerpt: 'Browser fix sync test',
        status: 'publish',
        date: new Date().toISOString(),
        author: 'Browser Fix Test',
        category: 'Test Category',
        tags: [],
        featuredImage: null,
        views: 1,
        readingTime: 2,
        featured: false
      }
    };

    console.log('📡 Sending test data to WordPress API...');
    const response = await fetch('/api/sync/wordpress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📡 Response status:', response.status);
    const result = await response.json();
    
    if (result.success) {
      console.log('🎉 SUCCESS! WordPress post created:');
      console.log('📝 Post ID:', result.wpPost?.id);
      console.log('📝 Post Title:', result.wpPost?.title?.rendered);
      console.log('📝 Post Status:', result.wpPost?.status);
      console.log('🔗 WordPress Admin: http://vhdcom.local/wp-admin/edit.php');
      
      // 3. Show result in a nice format
      console.log('\n✅ FINAL RESULT:');
      console.log('🎯 Auto Sync: ENABLED');
      console.log('🎯 WordPress API: WORKING');
      console.log('🎯 Authentication: SUCCESS');
      console.log('🎯 Post Creation: SUCCESS');
      console.log(`🎯 WordPress Post ID: ${result.wpPost?.id}`);
      
      alert(`✅ SUCCESS!\n\n` +
            `WordPress sync working perfectly!\n` +
            `Post ID: ${result.wpPost?.id}\n` +
            `Status: ${result.wpPost?.status}\n\n` +
            `Auto sync settings are now enabled.\n` +
            `Try creating news from the form!`);
            
    } else {
      console.log('❌ FAILED:', result.error);
      alert(`❌ FAILED: ${result.error}`);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    alert(`❌ Error: ${error.message}`);
  }
};

// Run the test
testApiCall();

// 4. Instructions for user
console.log('\n📋 INSTRUCTIONS:');
console.log('1. Auto sync settings are now enabled');
console.log('2. Try creating news from: /admin/news/create');
console.log('3. Fill the form and click "Lưu và Xuất bản"');
console.log('4. Check console for WordPress sync logs');
console.log('5. Check WordPress admin: http://vhdcom.local/wp-admin/edit.php'); 