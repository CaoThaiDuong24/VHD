# CÁCH SỬ DỤNG WORDPRESS SYNC - TÓM TẮT

## 🎯 MỤC TIÊU
Dữ liệu tạo mới từ frontend tự động được lưu lên WordPress thông qua API.

## ⚡ CÁCH SỬ DỤNG NHANH (30 GIÂY)

### Bước 1: Cấu hình và Test
1. Vào: `http://localhost:3001` (server hiện tại)
2. Nhấn `F12` → Console tab
3. Copy và paste toàn bộ nội dung file `test-quick-sync.js`
4. Nhấn Enter
5. Đợi script chạy xong

### Bước 2: Tạo tin tức thật
1. Vào: `http://localhost:3001/admin/news/create`
2. Nhập thông tin tin tức
3. Nhấn "Tạo tin tức"
4. **Quan trọng**: Mở F12 → Console để xem log sync
5. Kiểm tra WordPress admin: `http://vhdcom.local/wp-admin/edit.php`

## 📊 LOG CONSOLE MONG ĐỢI

Khi tạo tin tức, Console sẽ hiển thị:
```
🔍 Sync Settings Check: {wpSyncEnabled: true, autoSyncEnabled: true, willSync: true}
🚀 Starting WordPress sync for news: [Tên tin tức]
📡 Calling sync API...
📡 API Response status: 200
✅ WordPress post created via API: {wpId: 123, message: "Post created successfully"}
✅ Đã tạo bài viết WordPress thành công: 123
```

## ⚠️ XỬ LÝ LỖI

### Lỗi 401 (Authentication Failed)
```javascript
// Tạo Application Password
const wpSettings = {
  apiUrl: 'http://vhdcom.local/wp-json/wp/v2',
  username: 'admin',
  password: 'YOUR_APPLICATION_PASSWORD_HERE',
  enabled: true
}
localStorage.setItem('wordpressSettings', JSON.stringify(wpSettings))
location.reload()
```

### Lỗi 404 (WordPress không chạy)
- Kiểm tra: `http://vhdcom.local`
- Khởi động WordPress nếu cần

### Lỗi 500 (Server Error)
- Kiểm tra WordPress error logs
- Thử restart WordPress

## 🔧 WORKFLOW HOÀN CHỈNH

1. **User tạo tin tức** → Form submit
2. **NewsContext.addNews()** → Được gọi
3. **Auto sync check** → wpSyncEnabled && autoSyncEnabled
4. **API call** → POST `/api/sync/wordpress` với action='create'
5. **WordPress API** → Tạo post mới
6. **Response** → Trả về wpId
7. **Update local** → Lưu wpId vào localStorage
8. **Hoàn thành** → Tin tức có mặt cả local và WordPress

## 📋 KIỂM TRA NHANH

Paste vào Console để kiểm tra hệ thống:
```javascript
// Kiểm tra settings
console.log('WordPress Sync:', localStorage.getItem('wpSyncEnabled'))
console.log('Auto Sync:', localStorage.getItem('autoSyncEnabled'))
console.log('WordPress Settings:', !!localStorage.getItem('wordpressSettings'))

// Kiểm tra tin tức có wpId
const news = JSON.parse(localStorage.getItem('news') || '[]')
const newsWithWpId = news.filter(n => n.wpId)
console.log('Total news:', news.length)
console.log('News synced to WordPress:', newsWithWpId.length)
```

## 📞 HỖ TRỢ

**Nếu gặp vấn đề:**
1. Chạy `debug-wordpress-sync.js` để phân tích chi tiết
2. Chạy `fix-all-errors.js` để fix tất cả lỗi
3. Đọc `HUONG_DAN_SU_DUNG_WORDPRESS_SYNC.md` để hướng dẫn chi tiết

**Files quan trọng:**
- `test-quick-sync.js` - Script chính test và cấu hình
- `HUONG_DAN_SU_DUNG_WORDPRESS_SYNC.md` - Hướng dẫn chi tiết
- `debug-wordpress-sync.js` - Debug khi có lỗi

## ✅ THÀNH CÔNG KHI

- Console hiển thị log sync thành công
- WordPress admin có bài viết mới
- localStorage có tin tức với wpId
- Không có lỗi trong Console 