
// Browser script to update localStorage
(function() {
  console.log('🔄 Updating frontend with WordPress data...');
  
  const wordpressNews = [
  {
    "id": 112,
    "title": "abc",
    "content": "têtts",
    "description": "têtts",
    "image": "/placeholder.svg",
    "date": "2025-06-18T10:39:38",
    "author": "WordPress Import",
    "category": "WordPress Import",
    "tags": [
      "WordPress",
      "Import"
    ],
    "slug": "abc",
    "wpId": 12,
    "status": "publish",
    "gallery": []
  },
  {
    "id": 101,
    "title": "Hello world!",
    "content": "Welcome to WordPress. This is your first post. Edit or delete it, then start writing!",
    "description": "Welcome to WordPress. This is your first post. Edit or delete it, then start writing!",
    "image": "/placeholder.svg",
    "date": "2025-06-17T09:01:40",
    "author": "WordPress Import",
    "category": "WordPress Import",
    "tags": [
      "WordPress",
      "Import"
    ],
    "slug": "hello-world",
    "wpId": 1,
    "status": "publish",
    "gallery": []
  }
];
  
  // Get existing news from localStorage
  const existingNews = JSON.parse(localStorage.getItem('newsItems') || '[]');
  console.log('📊 Existing news items:', existingNews.length);
  
  // Merge WordPress news with existing (avoiding duplicates)
  const mergedNews = [...wordpressNews];
  
  existingNews.forEach(existing => {
    // Only add if not already imported from WordPress
    if (!wordpressNews.find(wp => wp.wpId === existing.wpId || wp.id === existing.id)) {
      mergedNews.push(existing);
    }
  });
  
  // Save back to localStorage
  localStorage.setItem('newsItems', JSON.stringify(mergedNews));
  console.log('✅ Updated localStorage with', mergedNews.length, 'news items');
  console.log('📰 WordPress items added:', wordpressNews.length);
  
  // Force page reload to show new data
  if (confirm('Đã cập nhật dữ liệu tin tức từ WordPress. Reload trang để xem thay đổi?')) {
    window.location.reload();
  }
})();
