// SCRIPT FIX AUTO SYNC FRONTEND
console.log('🔧 EMERGENCY FIX - Frontend Auto Sync');

// 1. Enable all localStorage settings
console.log('\n1️⃣ Enabling localStorage settings...');
localStorage.setItem('wpSyncEnabled', 'true');
localStorage.setItem('autoSyncEnabled', 'true');  
localStorage.setItem('bidirectionalSyncEnabled', 'true');

// 2. Test NewsContext directly
console.log('\n2️⃣ Testing NewsContext...');
const testNews = {
  id: Date.now(),
  title: `FRONTEND TEST - ${new Date().toLocaleTimeString()}`,
  content: 'Test từ frontend form để kiểm tra auto sync có hoạt động không.',
  excerpt: 'Frontend sync test',
  status: 'published', // Quan trọng: phải là 'published'
  date: new Date().toISOString(),
  author: 'Frontend Test',
  categories: [],
  tags: [],
  featuredImage: null
};

// 3. Simulate form submission
console.log('\n3️⃣ Simulating frontend form submission...');

// Check if we're on the news create page
if (window.location.pathname.includes('/admin/news/create')) {
  console.log('✅ On news create page - testing form submission');
  
  // Try to trigger form submit event
  const forms = document.querySelectorAll('form');
  console.log(`📋 Found ${forms.length} forms on page`);
  
  // Fill form if available
  const titleInput = document.querySelector('input[placeholder*="tiêu đề"], input[placeholder*="title"], #title');
  const contentInput = document.querySelector('textarea[placeholder*="nội dung"], textarea[placeholder*="content"], #content');
  
  if (titleInput && contentInput) {
    console.log('✅ Found form inputs - filling data');
    titleInput.value = testNews.title;
    contentInput.value = testNews.content;
    
    // Trigger change events
    titleInput.dispatchEvent(new Event('change', { bubbles: true }));
    contentInput.dispatchEvent(new Event('change', { bubbles: true }));
  }
} else {
  console.log('⚠️ Not on news create page - redirecting...');
  window.location.href = '/admin/news/create';
}

// 4. Direct API test
console.log('\n4️⃣ Testing WordPress API directly...');
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
.then(response => {
  console.log('📡 API Response status:', response.status);
  return response.json();
})
.then(data => {
  if (data.success) {
    console.log('🎉 SUCCESS! WordPress post created:');
    console.log('📝 Post ID:', data.wpPost?.id);
    console.log('📰 Title:', data.wpPost?.title);
    console.log('🔗 Link:', data.wpPost?.link);
    console.log('📊 Status:', data.wpPost?.status);
    
    // Check WordPress admin
    console.log('\n🔍 Kiểm tra WordPress admin:');
    console.log('👉 http://vhdcom.local/wp-admin/edit.php');
    
  } else {
    console.log('❌ FAILED:', data.error);
    
    // Debug localStorage
    console.log('\n🔍 Debug localStorage:');
    console.log('- wpSyncEnabled:', localStorage.getItem('wpSyncEnabled'));
    console.log('- autoSyncEnabled:', localStorage.getItem('autoSyncEnabled'));
    console.log('- bidirectionalSyncEnabled:', localStorage.getItem('bidirectionalSyncEnabled'));
  }
})
.catch(error => {
  console.error('❌ API Error:', error);
});

// 5. Check if NewsContext is working
console.log('\n5️⃣ Checking NewsContext availability...');
setTimeout(() => {
  // Try to access NewsContext through window
  if (window.React && window.React.createElement) {
    console.log('✅ React detected');
  }
  
  // Check for any news-related global variables
  const globals = Object.keys(window).filter(key => 
    key.toLowerCase().includes('news') || 
    key.toLowerCase().includes('sync') ||
    key.toLowerCase().includes('wordpress')
  );
  
  if (globals.length > 0) {
    console.log('🔍 Found globals:', globals);
  }
  
  console.log('\n✅ Script completed!');
  console.log('📋 Next steps:');
  console.log('1. Refresh page if needed');
  console.log('2. Try creating news from form');
  console.log('3. Check WordPress admin panel');
  
}, 2000);

// 6. Add event listener for form submissions
document.addEventListener('submit', function(e) {
  console.log('📝 Form submitted:', e.target);
  console.log('📊 Form data:', new FormData(e.target));
});

console.log('\n💡 To test manually:');
console.log('1. Go to: http://localhost:3000/admin/news/create');
console.log('2. Fill form and submit');
console.log('3. Check browser Network tab for POST /api/sync/wordpress');
console.log('4. Check WordPress: http://vhdcom.local/wp-admin/edit.php'); 