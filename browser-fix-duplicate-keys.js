// BROWSER SCRIPT: Fix Duplicate Keys & Enable Auto Sync
// Paste this into browser console on localhost:3001

console.log('🔧 COMPREHENSIVE FIX: WordPress Sync Settings');
console.log('================================================');

// Clear all WordPress related settings first
const keysToRemove = [
    'wordpressSettings', 'wpSyncEnabled', 'autoSyncEnabled', 'bidirectionalSyncEnabled',
    'wp-connection-status', 'wordpressApiUrl', 'wordpressUsername', 'wordpressPassword'
];

keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🗑️ Removed: ${key}`);
});

// Set proper WordPress settings
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

// Apply settings
localStorage.setItem('wordpressSettings', JSON.stringify(wpSettings));
Object.keys(syncSettings).forEach(key => {
    localStorage.setItem(key, JSON.stringify(syncSettings[key]));
    console.log(`✅ Set ${key}: ${syncSettings[key]}`);
});

// Verify settings
console.log('\n📋 VERIFICATION:');
console.log('wordpressSettings:', JSON.parse(localStorage.getItem('wordpressSettings') || '{}'));
console.log('wpSyncEnabled:', JSON.parse(localStorage.getItem('wpSyncEnabled') || 'false'));
console.log('autoSyncEnabled:', JSON.parse(localStorage.getItem('autoSyncEnabled') || 'false'));

console.log('\n🎯 SETTINGS APPLIED SUCCESSFULLY!');
console.log('🔄 Please refresh the page to activate settings');

// Test function for immediate verification
window.testWordPressSync = function() {
    console.log('🧪 Testing WordPress sync...');
    
    const testData = {
        title: 'AUTO SYNC TEST - ' + new Date().toLocaleTimeString(),
        content: 'Testing auto sync from browser console...',
        excerpt: 'Auto sync test',
        status: 'publish'
    };
    
    fetch('/api/sync/wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', ...testData })
    })
    .then(r => r.json())
    .then(data => {
        console.log('✅ Test result:', data);
    })
    .catch(err => {
        console.error('❌ Test failed:', err);
    });
};

console.log('\n💡 Run testWordPressSync() to test immediately!'); 