// Script to enable all WordPress sync settings in browser
// Run this in browser console on WordPress settings page

console.log('🚀 WordPress Auto Sync Enabler');

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
        title: `BROWSER AUTO SYNC TEST - ${new Date().toLocaleTimeString()}`,
        content: 'Test auto sync từ browser console để verify localStorage settings hoạt động.',
        excerpt: 'Browser console auto sync test',
        status: 'publish',
        date: new Date().toISOString(),
        author: 'Browser Console',
        categories: [],
        tags: [],
        featuredImage: null
      }
    };

    console.log('📡 Sending test API call...');
    const response = await fetch('/api/sync/wordpress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('🎉 API TEST SUCCESS!');
      console.log('📝 WordPress Post ID:', result.wpPost?.id);
      console.log('🔗 WordPress Admin: http://vhdcom.local/wp-admin/edit.php');
    } else {
      console.log('❌ API TEST FAILED:', result.error);
    }
  } catch (error) {
    console.error('❌ API test error:', error);
  }
};

// 3. Instructions for testing auto sync from form
console.log('\n3️⃣ CÁCH TEST AUTO SYNC:');
console.log('1. Mở: http://localhost:3000/admin/news/create');
console.log('2. Điền form với:');
console.log('   - Title: "Test Auto Sync Form"');
console.log('   - Content: "Test nội dung"');
console.log('   - Status: "Published"');
console.log('3. Click "Lưu và Xuất bản"');
console.log('4. Kiểm tra Console để thấy logs sync');
console.log('5. Kiểm tra WordPress admin để thấy post mới');

// Run API test
testApiCall();

// 4. Page refresh notification
console.log('\n4️⃣ QUAN TRỌNG:');
console.log('🔄 Refresh trang để settings mới có hiệu lực!');
console.log('💡 Hoặc F5 để reload page');

// Function to enable auto sync settings
function enableAllSyncSettings() {
    try {
        // Enable WordPress sync in localStorage
        const wpSyncSettings = {
            wpSyncEnabled: true,
            autoSyncEnabled: true,
            bidirectionalSyncEnabled: true
        };
        
        // Save to localStorage
        Object.keys(wpSyncSettings).forEach(key => {
            localStorage.setItem(key, JSON.stringify(wpSyncSettings[key]));
            console.log(`✅ Set ${key}: ${wpSyncSettings[key]}`);
        });
        
        // Also set WordPress connection settings if not exists
        const existingSettings = localStorage.getItem('wordpressSettings');
        if (!existingSettings) {
            const defaultWordPressSettings = {
                apiUrl: 'http://vhdcom.local/wp-json/wp/v2',
                username: 'duong',
                password: 'kUgT g3ox OJcE yvN3 BCgp tyyZ',
                enabled: true
            };
            
            localStorage.setItem('wordpressSettings', JSON.stringify(defaultWordPressSettings));
            console.log('✅ Set default WordPress settings');
        } else {
            // Update existing settings to enable
            const settings = JSON.parse(existingSettings);
            settings.enabled = true;
            localStorage.setItem('wordpressSettings', JSON.stringify(settings));
            console.log('✅ Enabled existing WordPress settings');
        }
        
        console.log('🎉 ALL SYNC SETTINGS ENABLED!');
        console.log('📍 Please refresh the page to see changes');
        console.log('');
        console.log('🔍 Current settings:');
        console.log('- WordPress Sync:', localStorage.getItem('wpSyncEnabled'));
        console.log('- Auto Sync:', localStorage.getItem('autoSyncEnabled'));
        console.log('- Bidirectional Sync:', localStorage.getItem('bidirectionalSyncEnabled'));
        console.log('- WordPress Settings:', localStorage.getItem('wordpressSettings'));
        
        return true;
    } catch (error) {
        console.error('❌ Error enabling sync settings:', error);
        return false;
    }
}

// Function to test news creation with sync
function testNewsCreationWithSync() {
    console.log('');
    console.log('🧪 TESTING NEWS CREATION WITH AUTO SYNC...');
    
    const testNews = {
        title: 'TEST AUTO SYNC - ' + new Date().toLocaleTimeString(),
        titleEn: 'AUTO SYNC TEST - ' + new Date().toLocaleTimeString(),
        category: 'Tin tức',
        categoryEn: 'News',
        description: 'Test bài viết để kiểm tra auto sync lên WordPress',
        descriptionEn: 'Test post to check auto sync to WordPress',
        detailContent: 'Đây là nội dung chi tiết để test auto sync. Nếu auto sync hoạt động, bài viết này sẽ xuất hiện trên WordPress.',
        detailContentEn: 'This is detailed content to test auto sync. If auto sync works, this post will appear on WordPress.',
        date: new Date().toLocaleDateString('vi-VN'),
        image: '/placeholder.svg',
        gallery: [],
        gradient: 'from-blue-500 to-purple-600',
        location: 'Test Location',
        locationEn: 'Test Location',
        participants: '100 người',
        participantsEn: '100 people',
        views: 0,
        readingTime: 3,
        status: 'published',
        featured: false,
        tags: ['test', 'auto-sync'],
        author: 'System Test',
        authorEn: 'System Test'
    };
    
    // Post to API
    fetch('/api/sync/wordpress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'create',
            data: testNews
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('✅ Test news creation response:', data);
        if (data.success && data.wpId) {
            console.log(`🎉 SUCCESS! WordPress post created with ID: ${data.wpId}`);
            console.log(`📍 Check WordPress admin to verify: http://vhdcom.local/wp-admin/post.php?post=${data.wpId}&action=edit`);
        } else {
            console.log('❌ Test failed:', data);
        }
    })
    .catch(error => {
        console.error('❌ Test error:', error);
    });
}

// Function to check current sync status
function checkSyncStatus() {
    console.log('');
    console.log('📊 CURRENT SYNC STATUS:');
    console.log('=======================');
    
    const wpSyncEnabled = JSON.parse(localStorage.getItem('wpSyncEnabled') || 'false');
    const autoSyncEnabled = JSON.parse(localStorage.getItem('autoSyncEnabled') || 'false');
    const bidirectionalSyncEnabled = JSON.parse(localStorage.getItem('bidirectionalSyncEnabled') || 'false');
    const wordpressSettings = JSON.parse(localStorage.getItem('wordpressSettings') || '{}');
    
    console.log('🔧 WordPress Sync Enabled:', wpSyncEnabled ? '✅ YES' : '❌ NO');
    console.log('⚡ Auto Sync Enabled:', autoSyncEnabled ? '✅ YES' : '❌ NO');
    console.log('🔄 Bidirectional Sync:', bidirectionalSyncEnabled ? '✅ YES' : '❌ NO');
    console.log('🌐 WordPress Connection:', wordpressSettings.enabled ? '✅ ENABLED' : '❌ DISABLED');
    
    if (wordpressSettings.apiUrl) {
        console.log('📍 WordPress URL:', wordpressSettings.apiUrl);
        console.log('👤 Username:', wordpressSettings.username || 'NOT SET');
        console.log('🔐 Password Set:', wordpressSettings.password ? '✅ YES' : '❌ NO');
    }
    
    const allEnabled = wpSyncEnabled && autoSyncEnabled && wordpressSettings.enabled;
    console.log('');
    console.log('🎯 READY FOR AUTO SYNC:', allEnabled ? '✅ YES' : '❌ NO');
    
    if (!allEnabled) {
        console.log('');
        console.log('🔧 TO FIX: Run enableAllSyncSettings() then refresh page');
    }
    
    return allEnabled;
}

// Main execution
console.log('🚀 WordPress Auto-Sync Setup Script');
console.log('====================================');

// Check current status first
const isReady = checkSyncStatus();

if (!isReady) {
    console.log('');
    console.log('🔧 FIXING SYNC SETTINGS...');
    enableAllSyncSettings();
} else {
    console.log('');
    console.log('✅ All sync settings already enabled!');
}

console.log('');
console.log('📋 Available functions:');
console.log('- enableAllSyncSettings() : Enable all sync settings');
console.log('- checkSyncStatus()       : Check current sync status');
console.log('- testNewsCreationWithSync() : Test creating news with auto sync');
console.log('');
console.log('🎯 To test auto sync: testNewsCreationWithSync()');

// Export functions for manual use
if (typeof window !== 'undefined') {
  window.enableAllSyncSettings = enableAllSyncSettings
  window.testNewsCreationWithSync = testNewsCreationWithSync
  window.checkSyncStatus = checkSyncStatus
} 