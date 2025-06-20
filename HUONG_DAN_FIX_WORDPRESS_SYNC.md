# 🔧 HƯỚNG DẪN FIX WORDPRESS SYNC

## 🎯 VẤN ĐỀ
Khi tạo tin tức từ frontend, dữ liệu không tự động sync lên WordPress.

## ✅ KIỂM TRA HIỆN TRẠNG

### 1. WordPress API hoạt động tốt ✅
- URL: `http://vhdcom.local/wp-json/wp/v2`
- Đọc dữ liệu: SUCCESS
- Ghi dữ liệu: CẦN APPLICATION PASSWORD

### 2. Frontend Server hoạt động ✅
- URL: `http://localhost:3001`
- API endpoints: SUCCESS
- Debug logs: ĐÃ CÓ

### 3. Vấn đề chính ❌
- Settings chưa được bật
- Thiếu Application Password

---

## 🚀 CÁCH FIX (5 BƯỚC ĐỦ)

### BƯỚC 1: BẬT SYNC SETTINGS
1. Mở browser, vào: `http://localhost:3001/admin/news`
2. Nhấn **F12** → chọn tab **Console**
3. Copy và paste đoạn code này:

```javascript
// Bật tất cả sync settings
localStorage.setItem('wpSyncEnabled', 'true');
localStorage.setItem('autoSyncEnabled', 'true');
localStorage.setItem('bidirectionalSyncEnabled', 'true');

// Cấu hình WordPress settings tạm thời
const wpSettings = {
  apiUrl: 'http://vhdcom.local/wp-json/wp/v2',
  username: 'admin',
  password: 'admin', // Sẽ thay đổi ở bước 3
  enabled: true
};
localStorage.setItem('wordpressSettings', JSON.stringify(wpSettings));

console.log('✅ Đã bật sync settings!');
console.log('📋 Kiểm tra settings:');
console.log('- wpSyncEnabled:', localStorage.getItem('wpSyncEnabled'));
console.log('- autoSyncEnabled:', localStorage.getItem('autoSyncEnabled'));
console.log('- wordpressSettings:', JSON.parse(localStorage.getItem('wordpressSettings')));
```

4. Nhấn **Enter** để chạy
5. Thấy thông báo "✅ Đã bật sync settings!" là thành công

### BƯỚC 2: TẠO APPLICATION PASSWORD
1. Mở tab mới, vào: `http://vhdcom.local/wp-admin/profile.php`
2. Đăng nhập WordPress (admin/admin)
3. Cuộn xuống tìm mục **"Application Passwords"**
4. Trong ô **"New Application Password Name"**, nhập: `Frontend Sync`
5. Click **"Add New Application Password"**
6. **QUAN TRỌNG**: Copy password được tạo (dạng: `xxxx xxxx xxxx xxxx`)

### BƯỚC 3: CẬP NHẬT PASSWORD
Quay lại tab frontend, trong Console, chạy:

```javascript
// Thay YOUR_PASSWORD_HERE bằng password vừa copy
const wpSettings = {
  apiUrl: 'http://vhdcom.local/wp-json/wp/v2',
  username: 'admin',
  password: 'YOUR_PASSWORD_HERE', // Paste password ở đây
  enabled: true
};
localStorage.setItem('wordpressSettings', JSON.stringify(wpSettings));

console.log('✅ Đã cập nhật Application Password!');

// Test kết nối
fetch('http://vhdcom.local/wp-json/wp/v2/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa('admin:' + wpSettings.password)
  },
  body: JSON.stringify({
    title: 'Test từ Frontend - ' + new Date().toISOString(),
    content: 'Đây là bài test để kiểm tra kết nối',
    status: 'draft'
  })
})
.then(response => {
  if (response.status === 201) {
    console.log('🎉 THÀNH CÔNG! WordPress có thể ghi được!');
  } else {
    console.log('❌ Lỗi:', response.status);
  }
});
```

### BƯỚC 4: RELOAD TRANG
```javascript
window.location.reload();
```

### BƯỚC 5: TEST SYNC
1. Vào: `http://localhost:3001/admin/news/create`
2. Tạo tin tức mới với thông tin:
   - **Tiêu đề**: Test Sync WordPress
   - **Nội dung**: Đây là test sync
   - **Tác giả**: Test User
3. Click **"Thêm tin tức"**
4. Xem **Console** (F12) để thấy logs:
   ```
   🔍 Sync Settings Check: { wpSyncEnabled: true, autoSyncEnabled: true, willSync: true }
   🚀 Starting WordPress sync for news: Test Sync WordPress
   ✅ WordPress sync completed successfully
   ```
5. Kiểm tra WordPress Admin để thấy bài viết mới

---

## 🔍 DEBUG & TROUBLESHOOTING

### Kiểm tra Settings
```javascript
console.log('=== SYNC SETTINGS ===');
console.log('wpSyncEnabled:', localStorage.getItem('wpSyncEnabled'));
console.log('autoSyncEnabled:', localStorage.getItem('autoSyncEnabled'));
console.log('bidirectionalSyncEnabled:', localStorage.getItem('bidirectionalSyncEnabled'));

const wpSettings = JSON.parse(localStorage.getItem('wordpressSettings'));
console.log('=== WORDPRESS SETTINGS ===');
console.log('URL:', wpSettings?.apiUrl);
console.log('Username:', wpSettings?.username);
console.log('Password length:', wpSettings?.password?.length);
console.log('Enabled:', wpSettings?.enabled);
```

### Test WordPress Connection
```javascript
fetch('http://vhdcom.local/wp-json/wp/v2/posts?per_page=1')
  .then(response => response.json())
  .then(posts => {
    console.log('✅ WordPress Read:', posts.length, 'posts');
  })
  .catch(error => {
    console.log('❌ WordPress Read Error:', error);
  });
```

### Reset All Settings (nếu cần)
```javascript
localStorage.removeItem('wpSyncEnabled');
localStorage.removeItem('autoSyncEnabled');
localStorage.removeItem('bidirectionalSyncEnabled');
localStorage.removeItem('wordpressSettings');
console.log('🔄 Đã reset tất cả settings');
```

---

## 🎯 KẾT QUẢ MONG ĐỢI

Sau khi hoàn thành 5 bước trên:

1. ✅ Sync settings được bật
2. ✅ WordPress Application Password hoạt động
3. ✅ Khi tạo tin tức mới → tự động xuất hiện trên WordPress
4. ✅ Console hiển thị logs sync thành công

---

## 📞 HỖ TRỢ

Nếu vẫn gặp vấn đề, gửi screenshot của:
1. Browser Console logs khi tạo tin tức
2. WordPress Admin posts list
3. Kết quả của debug commands ở trên

**Lưu ý**: Application Password chỉ cần tạo 1 lần, sau đó sẽ hoạt động vĩnh viễn. 