// EMERGENCY FIX - WordPress Sync Complete
// Fix tất cả issues một lần

async function emergencyFix() {
    console.log('🚨 EMERGENCY FIX - WordPress Sync');
    console.log('================================\n');
    
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
}

// Run the emergency fix
emergencyFix().catch(console.error); 