# 📋 Hướng dẫn Setup WordPress Auto-Sync

## 🎯 Tổng quan
Hướng dẫn này sẽ giúp bạn thiết lập kết nối WordPress để hệ thống auto-sync hoạt động hoàn hảo.

## ✅ Các lỗi đã được fix:
- ❌ **localStorage undefined error**: ĐÃ FIX
- ❌ **Unicode encoding errors**: ĐÃ FIX  
- ❌ **Fast Refresh reload errors**: ĐÃ FIX
- ✅ **Tất cả trang web hoạt động**: HTTP 200 OK

## 🔧 Cần thiết lập WordPress

### Bước 1: Chuẩn bị WordPress Site
```bash
# Nếu bạn chưa có WordPress, có thể dùng:
# - WordPress.com
# - Local server (XAMPP, WAMP)
# - Hosting provider
# - WordPress demo site
```

### Bước 2: Kích hoạt WordPress REST API
1. Đăng nhập WordPress Admin
2. Vào **Settings > Permalinks** 
3. Chọn **Post name** hoặc **Custom Structure**: `/%postname%/`
4. Nhấn **Save Changes**

### Bước 3: Tạo Application Password
1. Vào **Users > Profile** (hoặc **Users > All Users > Edit User**)
2. Cuộn xuống phần **Application Passwords**
3. Nhập tên: `NextJS Website`
4. Nhấn **Add New Application Password**
5. **SAO CHÉP PASSWORD** ngay lập tức (chỉ hiển thị 1 lần!)

### Bước 4: Cấu hình trong Next.js
Tạo file `.env.local` trong thư mục root:

```env
# WordPress Configuration
NEXT_PUBLIC_WORDPRESS_API_URL=https://YOUR-WORDPRESS-SITE.com/wp-json/wp/v2
WORDPRESS_USERNAME=your-username
WORDPRESS_PASSWORD=your-application-password-here

# Ví dụ:
# NEXT_PUBLIC_WORDPRESS_API_URL=https://mysite.com/wp-json/wp/v2
# WORDPRESS_USERNAME=admin
# WORDPRESS_PASSWORD=abcd 1234 efgh 5678 ijkl 9012
```

### Bước 5: Test WordPress Demo (Tạm thời)
Nếu chưa có WordPress, dùng demo site để test:

```env
# Demo WordPress (chỉ để test)
NEXT_PUBLIC_WORDPRESS_API_URL=https://demo.wp-api.org/wp-json/wp/v2
WORDPRESS_USERNAME=demo
WORDPRESS_PASSWORD=demo
```

## 🧪 Kiểm tra kết nối

### Cách 1: Qua Admin Panel
1. Mở `http://localhost:3000/admin/wordpress-settings`
2. Nhấn **Kiểm tra kết nối**
3. Xem kết quả

### Cách 2: Qua API trực tiếp
```bash
# Test connection
curl "http://localhost:3000/api/sync/wordpress?action=health"

# Test fetch posts  
curl "http://localhost:3000/api/sync/wordpress?action=fetch-all"
```

### Cách 3: Qua Browser
Mở: `http://localhost:3000/api/sync/wordpress?action=health`

## 🔧 Troubleshooting

### Lỗi "SyntaxError: Unexpected token '<'"
**Nguyên nhân**: URL WordPress sai hoặc REST API chưa hoạt động
**Giải pháp**:
1. Kiểm tra URL có đúng: `https://your-site.com/wp-json/wp/v2`
2. Test URL trực tiếp trong browser
3. Kiểm tra Permalinks trong WordPress

### Lỗi "401 Unauthorized" 
**Nguyên nhân**: Username/Password sai
**Giải pháp**:
1. Kiểm tra username đúng không
2. Tạo lại Application Password
3. Kiểm tra không có khoảng trống thừa

### Lỗi "404 Not Found"
**Nguyên nhân**: REST API bị tắt hoặc URL sai
**Giải pháp**:
1. Vào WordPress Admin > Plugins
2. Tìm plugin chặn REST API và tắt
3. Kiểm tra `.htaccess` file

### Lỗi CORS
**Nguyên nhân**: WordPress không cho phép cross-origin requests
**Giải pháp**: Thêm vào `functions.php`:

```php
// Allow CORS for REST API
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        return $value;
    });
}, 15);
```

## 📊 Tính năng Auto-Sync

### Sau khi kết nối thành công:
- ✅ Tự động đồng bộ mỗi 1-30 phút
- ✅ Cache thông minh giảm tải server
- ✅ Đồng bộ thủ công khi cần
- ✅ Theo dõi trạng thái real-time
- ✅ Xử lý lỗi và fallback
- ✅ Statistics và monitoring

### Auto-Sync Manager Dashboard:
1. Mở `http://localhost:3000/admin/wordpress-settings`
2. Cấu hình interval sync
3. Bật/tắt auto-sync
4. Xem statistics
5. Clear cache khi cần

## 🎯 Status hiện tại
```
✅ Website: Running perfectly (HTTP 200)
✅ All pages: Working
✅ Auto-sync system: Ready
⏳ WordPress connection: Pending setup
```

## 📞 Hỗ trợ
Nếu gặp vấn đề, kiểm tra:
1. WordPress site có hoạt động không
2. REST API có accessible không  
3. Application Password có đúng không
4. Browser Console có lỗi gì không

Chạy lệnh test để kiểm tra:
```bash
node test-fixes.js
``` 