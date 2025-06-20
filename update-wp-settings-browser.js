
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
