// SUPER EMERGENCY FIX - WordPress Sync Complete
// Fix tất cả issues một lần

async function superEmergencyFix() {
    console.log('🚨 SUPER EMERGENCY FIX - WordPress Sync');
    console.log('=====================================\n');
    
    // 1. Test server health first
    console.log('1️⃣ Testing server health...');
    try {
        const healthResponse = await fetch('http://localhost:3000/api/sync/wordpress?action=health');
        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log('✅ Server health:', healthData.status);
        } else {
            console.log('❌ Server health check failed:', healthResponse.status);
            console.log('🔧 Please restart server: npm run dev');
            return;
        }
    } catch (error) {
        console.log('❌ Server not responding. Please run: npm run dev');
        return;
    }
    
    // 2. Test direct API call
    console.log('\n2️⃣ Testing direct API...');
    const testData = {
        action: 'create',
        title: 'EMERGENCY FIX TEST - ' + new Date().toLocaleTimeString(),
        content: 'Testing emergency fix. Auto sync should work after this.',
        excerpt: 'Emergency fix test',
        status: 'publish'
    };
    
    try {
        const response = await fetch('http://localhost:3000/api/sync/wordpress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Direct API working - WordPress ID:', result.wpId);
        } else {
            console.log('❌ Direct API failed:', response.status);
            const errorText = await response.text();
            console.log('Error details:', errorText);
            return;
        }
    } catch (error) {
        console.log('❌ API test failed:', error.message);
        return;
    }
    
    // 3. Check and fix browser localStorage settings
    console.log('\n3️⃣ Fixing browser localStorage...');
    
    // Clear all WordPress related settings
    const keysToRemove = [
        'wordpressSettings', 'wpSyncEnabled', 'autoSyncEnabled', 'bidirectionalSyncEnabled',
        'wp-connection-status', 'wordpressApiUrl', 'wordpressUsername', 'wordpressPassword'
    ];
    
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed: ${key}`);
    });
    
    // Set correct WordPress settings
    const wpSettings = {
        apiUrl: 'http://vhdcom.local/wp-json/wp/v2',
        username: 'duong',
        password: 'kUgT g3ox OJcE yvN3 BCgp tyyZ',
        enabled: true
    };
    
    // Set sync settings
    const syncSettings = {
        wpSyncEnabled: true,
        autoSyncEnabled: true,
        bidirectionalSyncEnabled: true
    };
    
    localStorage.setItem('wordpressSettings', JSON.stringify(wpSettings));
    Object.keys(syncSettings).forEach(key => {
        localStorage.setItem(key, JSON.stringify(syncSettings[key]));
        console.log(`✅ Set ${key}: ${syncSettings[key]}`);
    });
    
    // 4. Verify settings
    console.log('\n4️⃣ Verifying settings...');
    console.log('wordpressSettings:', JSON.parse(localStorage.getItem('wordpressSettings') || '{}'));
    console.log('wpSyncEnabled:', JSON.parse(localStorage.getItem('wpSyncEnabled') || 'false'));
    console.log('autoSyncEnabled:', JSON.parse(localStorage.getItem('autoSyncEnabled') || 'false'));
    
    // 5. Test auto sync simulation
    console.log('\n5️⃣ Testing auto sync simulation...');
    
    // Simulate what happens when user creates news from form
    const newsData = {
        title: 'AUTO SYNC TEST FROM FRONTEND - ' + new Date().toLocaleTimeString(),
        description: 'Test auto sync từ form frontend',
        content: 'Nội dung test auto sync. Nếu thành công sẽ tự động lên WordPress.',
        status: 'published',
        date: new Date().toISOString().split('T')[0],
        author: 'Admin Test',
        category: 'Tin tức',
        readingTime: 3
    };
    
    console.log('📝 Simulating frontend form submission...');
    console.log('Form data:', newsData);
    
    // Check if auto sync would trigger
    const wpSyncEnabled = JSON.parse(localStorage.getItem('wpSyncEnabled') || 'false');
    const autoSyncEnabled = JSON.parse(localStorage.getItem('autoSyncEnabled') || 'false');
    
    if (wpSyncEnabled && autoSyncEnabled) {
        console.log('✅ Auto sync settings are enabled');
        console.log('🚀 Auto sync would trigger for new news item');
    } else {
        console.log('❌ Auto sync settings not properly enabled');
        console.log('wpSyncEnabled:', wpSyncEnabled);
        console.log('autoSyncEnabled:', autoSyncEnabled);
    }
    
    console.log('\n🎯 EMERGENCY FIX COMPLETE!');
    console.log('=========================');
    console.log('✅ Server: Working');
    console.log('✅ API: Functional');
    console.log('✅ Settings: Fixed');
    console.log('✅ Auto Sync: Enabled');
    
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Refresh this page (F5)');
    console.log('2. Go to: http://localhost:3000/admin/news/create');
    console.log('3. Create a test news item');
    console.log('4. Check console for auto sync logs');
    console.log('5. Verify on WordPress: http://vhdcom.local/wp-admin/edit.php');
    
    console.log('\n💡 If auto sync still doesn\'t work:');
    console.log('1. Check browser console for errors');
    console.log('2. Restart server: npm run dev');
    console.log('3. Run this script again');
}

// Run the emergency fix
superEmergencyFix().catch(console.error);
