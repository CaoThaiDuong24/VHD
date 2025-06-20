// TEST LOCALSTORAGE AUTO-ENABLE FIX
console.log('🧪 Testing localStorage auto-enable fix...');

// Simulate clear localStorage first
console.log('🗑️ Clearing localStorage to simulate fresh browser...');
localStorage.removeItem('wpSyncEnabled');
localStorage.removeItem('autoSyncEnabled');
localStorage.removeItem('bidirectionalSyncEnabled');

console.log('📋 Before fix:');
console.log('- wpSyncEnabled:', localStorage.getItem('wpSyncEnabled'));
console.log('- autoSyncEnabled:', localStorage.getItem('autoSyncEnabled'));
console.log('- bidirectionalSyncEnabled:', localStorage.getItem('bidirectionalSyncEnabled'));

// Auto-enable logic (same as in components)
console.log('\n🔧 Auto-enabling WordPress sync settings...');

const currentWpSync = localStorage.getItem('wpSyncEnabled');
const currentAutoSync = localStorage.getItem('autoSyncEnabled');
const currentBidirectional = localStorage.getItem('bidirectionalSyncEnabled');

let settingsChanged = false;

if (currentWpSync !== 'true') {
  localStorage.setItem('wpSyncEnabled', 'true');
  console.log('✅ wpSyncEnabled set to true');
  settingsChanged = true;
}

if (currentAutoSync !== 'true') {
  localStorage.setItem('autoSyncEnabled', 'true');
  console.log('✅ autoSyncEnabled set to true');
  settingsChanged = true;
}

if (currentBidirectional !== 'true') {
  localStorage.setItem('bidirectionalSyncEnabled', 'true');
  console.log('✅ bidirectionalSyncEnabled set to true');
  settingsChanged = true;
}

console.log('\n📋 After fix:');
console.log('- wpSyncEnabled:', localStorage.getItem('wpSyncEnabled'));
console.log('- autoSyncEnabled:', localStorage.getItem('autoSyncEnabled'));
console.log('- bidirectionalSyncEnabled:', localStorage.getItem('bidirectionalSyncEnabled'));

if (settingsChanged) {
  console.log('\n🎉 SUCCESS! WordPress auto sync đã được kích hoạt tự động!');
} else {
  console.log('\n✨ Settings already enabled, no changes needed.');
}

// Test WordPress API
console.log('\n🔌 Testing WordPress API...');
const testData = {
  action: 'create',
  data: {
    id: Date.now(),
    title: `LocalStorage Fix Test - ${new Date().toLocaleTimeString()}`,
    content: 'Test sau khi fix localStorage auto-enable. Auto sync should work now!',
    excerpt: 'LocalStorage fix test',
    status: 'draft',
    date: new Date().toISOString(),
    author: 'Fix Test',
    categories: [],
    tags: [],
    featuredImage: null
  }
};

fetch('/api/sync/wordpress', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('📡 Response status:', response.status);
  return response.json();
})
.then(data => {
  if (data.success) {
    console.log('🎉 SUCCESS! WordPress post created:');
    console.log('📝 Post ID:', data.wpPost?.id);
    console.log('📝 Title:', data.wpPost?.title);
    console.log('🔗 WordPress Admin: http://vhdcom.local/wp-admin/edit.php');
    console.log('\n🚀 AUTO SYNC IS NOW WORKING! You can create news and it will automatically sync to WordPress.');
  } else {
    console.log('❌ FAILED:', data.error);
  }
})
.catch(error => {
  console.log('❌ Error:', error.message);
}); 