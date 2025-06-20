// ===== SCRIPT FIX NHANH WORDPRESS SYNC =====
// Copy toàn bộ script này vào Browser Console

console.log('🚀 BẮT ĐẦU FIX WORDPRESS SYNC...\n');

// Bước 1: Bật tất cả sync settings
console.log('1️⃣ Bật sync settings...');
localStorage.setItem('wpSyncEnabled', 'true');
localStorage.setItem('autoSyncEnabled', 'true');
localStorage.setItem('bidirectionalSyncEnabled', 'true');
console.log('   ✅ Đã bật sync settings');

// Bước 2: Cấu hình WordPress settings
console.log('2️⃣ Cấu hình WordPress settings...');
const wpSettings = {
  apiUrl: 'http://vhdcom.local/wp-json/wp/v2',
  username: 'admin',
  password: 'admin', // CẦN THAY BẰNG APPLICATION PASSWORD
  enabled: true
};
localStorage.setItem('wordpressSettings', JSON.stringify(wpSettings));
console.log('   ✅ Đã cấu hình WordPress settings');

// Bước 3: Kiểm tra settings
console.log('3️⃣ Kiểm tra settings hiện tại...');
console.log('   - wpSyncEnabled:', localStorage.getItem('wpSyncEnabled'));
console.log('   - autoSyncEnabled:', localStorage.getItem('autoSyncEnabled'));
console.log('   - bidirectionalSyncEnabled:', localStorage.getItem('bidirectionalSyncEnabled'));

const savedSettings = JSON.parse(localStorage.getItem('wordpressSettings'));
console.log('   - WordPress URL:', savedSettings.apiUrl);
console.log('   - WordPress Username:', savedSettings.username);
console.log('   - WordPress Enabled:', savedSettings.enabled);

// Bước 4: Test WordPress connection
console.log('4️⃣ Test kết nối WordPress...');
fetch('http://vhdcom.local/wp-json/wp/v2/posts?per_page=1')
  .then(response => {
    if (response.ok) {
      console.log('   ✅ WordPress đọc: THÀNH CÔNG');
      return response.json();
    } else {
      console.log('   ❌ WordPress đọc: THẤT BẠI');
      throw new Error('HTTP ' + response.status);
    }
  })
  .then(posts => {
    console.log('   📊 WordPress có', posts.length, 'bài viết');
    
    // Test write với password hiện tại
    console.log('5️⃣ Test ghi WordPress...');
    return fetch('http://vhdcom.local/wp-json/wp/v2/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('admin:admin')
      },
      body: JSON.stringify({
        title: 'Test Quick Fix - ' + new Date().toISOString(),
        content: 'Đây là test từ quick fix script',
        status: 'draft'
      })
    });
  })
  .then(response => {
    console.log('   📝 Kết quả ghi:', response.status);
    
    if (response.status === 201) {
      console.log('   🎉 HOÀN HẢO! WordPress ghi thành công!');
      console.log('   ✅ SYNC ĐÃ HOẠT ĐỘNG!');
      
      // Clean up test post
      return response.json().then(post => {
        fetch(`http://vhdcom.local/wp-json/wp/v2/posts/${post.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Basic ' + btoa('admin:admin')
          }
        });
        console.log('   🗑️ Đã xóa bài test');
      });
      
    } else if (response.status === 401) {
      console.log('   ❌ LỖI XÁC THỰC - CẦN APPLICATION PASSWORD!');
      console.log('\n🔑 BƯỚC TIẾP THEO:');
      console.log('1. Vào: http://vhdcom.local/wp-admin/profile.php');
      console.log('2. Tạo Application Password tên "Frontend Sync"');
      console.log('3. Copy password và chạy lệnh này:');
      console.log('\nconst wpSettings = {');
      console.log('  apiUrl: "http://vhdcom.local/wp-json/wp/v2",');
      console.log('  username: "admin",');
      console.log('  password: "YOUR_APPLICATION_PASSWORD_HERE",');
      console.log('  enabled: true');
      console.log('};');
      console.log('localStorage.setItem("wordpressSettings", JSON.stringify(wpSettings));');
      console.log('window.location.reload();');
      
    } else {
      console.log('   ⚠️ Lỗi khác:', response.status);
    }
  })
  .catch(error => {
    console.log('   ❌ Lỗi kết nối:', error.message);
  });

// Hướng dẫn test
console.log('\n📋 SAU KHI FIX:');
console.log('1. Tạo Application Password (nếu cần)');
console.log('2. Reload trang: window.location.reload()');
console.log('3. Vào: http://localhost:3001/admin/news/create');
console.log('4. Tạo tin tức mới');
console.log('5. Xem Console để thấy logs sync');
console.log('6. Kiểm tra WordPress Admin');

console.log('\n🔍 DEBUG COMMANDS:');
console.log('- Kiểm tra settings: console.log(localStorage.getItem("wpSyncEnabled"))');
console.log('- Reset settings: localStorage.clear()');
console.log('- Test WordPress: fetch("http://vhdcom.local/wp-json/wp/v2/posts?per_page=1")');

console.log('\n✅ SCRIPT HOÀN THÀNH!'); 