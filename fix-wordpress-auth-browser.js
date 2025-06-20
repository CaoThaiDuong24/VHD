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
    alert('🎉 SUCCESS! WordPress authentication đã được FIX thành công!\n\nWordPress Post ID: ' + data.wpId);
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