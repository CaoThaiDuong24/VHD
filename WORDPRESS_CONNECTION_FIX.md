# 🚨 Fix lỗi kết nối WordPress "rest_no_route"

## ⚡ Quick Fix (30 giây)

### 1. **Kiểm tra URL WordPress**
```
❌ Sai: http://vhdcom.local/wp-json/wp/v2
✅ Đúng: http://vhdcom.local
```
**Lý do:** Hệ thống sẽ tự động thêm `/wp-json/wp/v2`

### 2. **Test URL trực tiếp**
Mở trình duyệt và truy cập:
```
http://vhdcom.local/wp-json/wp/v2/posts
```
- **Nếu thấy JSON** → API hoạt động ✅
- **Nếu thấy 404** → Cần fix WordPress ❌

### 3. **WordPress Permalinks Fix**
1. Vào WordPress Admin: `http://vhdcom.local/wp-admin`
2. Settings → Permalinks
3. Chọn "Post name" 
4. Click **"Save Changes"**

---

## 🔧 Fix chi tiết theo từng lỗi

### **Lỗi 1: "rest_no_route" 404**
```json
{"code":"rest_no_route","message":"No route was found matching the URL and request method"}
```

**Nguyên nhân:**
- WordPress REST API bị tắt
- Permalinks chưa được cấu hình
- URL không đúng

**Cách fix:**

#### **Step 1: Kiểm tra URL**
```bash
# Test trong terminal hoặc browser
curl http://vhdcom.local/wp-json/wp/v2
```

#### **Step 2: Fix WordPress Permalinks**
1. WordPress Admin → Settings → Permalinks
2. Chọn "Post name" hoặc "Custom Structure"
3. Save Changes

#### **Step 3: Enable REST API**
Thêm vào `functions.php`:
```php
// Ensure REST API is enabled
add_action('rest_api_init', function() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
});
```

### **Lỗi 2: 401 Unauthorized**
```json
{"code":"rest_forbidden","message":"Sorry, you are not allowed to do that"}
```

**Cách fix:**

#### **Step 1: Tạo Application Password**
1. WordPress Admin → Users → Your Profile
2. Scroll down to "Application Passwords"
3. Name: `Next.js App`
4. Click "Add New Application Password"
5. **Copy password** (chỉ hiện 1 lần!)

#### **Step 2: Test với curl**
```bash
curl -u "username:application_password" http://vhdcom.local/wp-json/wp/v2/posts
```

### **Lỗi 3: CORS Error**
```
Access to fetch at 'http://vhdcom.local/wp-json/wp/v2/posts' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Cách fix:**
Thêm vào `functions.php`:
```php
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        return $value;
    });
});
```

---

## 🎯 Test kết nối trong Next.js

### **Method 1: Sử dụng WordPress Settings Page**
1. Vào `/admin/wordpress-settings`
2. Điền thông tin:
   - **URL**: `http://vhdcom.local`
   - **Username**: WordPress username
   - **Password**: Application password
3. Click "Kiểm tra kết nối"

### **Method 2: Test trực tiếp trong browser console**
```javascript
// Test basic API
fetch('http://vhdcom.local/wp-json/wp/v2/posts')
  .then(response => response.json())
  .then(data => console.log('✅ API hoạt động:', data))
  .catch(error => console.error('❌ API lỗi:', error))

// Test authenticated API
const credentials = btoa('username:password')
fetch('http://vhdcom.local/wp-json/wp/v2/posts', {
  headers: {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log('✅ Auth thành công:', data))
.catch(error => console.error('❌ Auth lỗi:', error))
```

### **Method 3: Sử dụng code trong NewsData**
```typescript
import { testWordPressConnection } from '@/lib/newsData'

// Test trong React component
const handleTest = async () => {
  const result = await testWordPressConnection()
  console.log(result)
}
```

---

## 🔍 Troubleshooting Checklist

### **✅ Pre-flight Check**
- [ ] XAMPP/Local server đang chạy
- [ ] WordPress site accessible tại `http://vhdcom.local`
- [ ] WordPress admin accessible tại `http://vhdcom.local/wp-admin`

### **✅ WordPress Configuration**
- [ ] Permalinks đã được cấu hình (Settings → Permalinks)
- [ ] REST API enabled (test: `http://vhdcom.local/wp-json/wp/v2`)
- [ ] Application Password đã tạo cho user
- [ ] User có quyền Editor/Administrator

### **✅ Next.js Settings**
- [ ] WordPress Settings đã điền đầy đủ
- [ ] URL format đúng (không cần `/wp-json/wp/v2`)
- [ ] Username/password chính xác
- [ ] Connection test thành công

### **✅ Network & CORS**
- [ ] No firewall blocking
- [ ] CORS headers configured (nếu cần)
- [ ] Local network accessible

---

## 🚀 Quick Commands để fix

### **Reset Permalinks**
```sql
-- Trong phpMyAdmin
UPDATE wp_options SET option_value = '/%postname%/' WHERE option_name = 'permalink_structure';
```

### **Force enable REST API**
```php
// Thêm vào wp-config.php
define('REST_REQUEST', true);
```

### **Clear WordPress cache**
```bash
# Xóa cache plugins nếu có
rm -rf wp-content/cache/*
```

---

## 📊 Status Messages Guide

### **Thành công ✅**
- `"✅ Kết nối WordPress thành công!"`
- `"📊 Tìm thấy X posts"`
- `"🔗 URL: http://vhdcom.local/wp-json/wp/v2"`

### **Lỗi cần fix ❌**
- `"WordPress REST API không tìm thấy"` → Fix permalinks
- `"Lỗi xác thực WordPress"` → Fix application password  
- `"Không thể kết nối tới WordPress"` → Check server
- `"CORS policy"` → Fix headers

### **Warning ⚠️**
- `"WordPress settings chưa đầy đủ"` → Complete configuration
- `"URL được tự động điều chỉnh"` → Format auto-corrected

---

## 💡 Pro Tips

### **1. Use Browser DevTools**
- F12 → Network tab
- Watch for failed requests
- Check response headers

### **2. WordPress Debug Mode**
```php
// wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

### **3. Test với Postman**
```
GET http://vhdcom.local/wp-json/wp/v2/posts
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
Content-Type: application/json
```

### **4. Enable WordPress REST API Logs**
```php
add_action('rest_api_init', function() {
    error_log('REST API request: ' . $_SERVER['REQUEST_URI']);
});
```

---

## 🎯 Expected Working Flow

1. **User vào WordPress Settings** → Điền thông tin
2. **Click "Kiểm tra kết nối"** → Thấy ✅ thành công
3. **Bật "Kích hoạt đồng bộ WordPress"** → Toggle ON
4. **Bật "Tự động đồng bộ"** → Toggle ON  
5. **Vào News Create** → Tạo tin tức mới
6. **Click "Lưu"** → Thấy "✅ Đã đồng bộ thành công với WordPress"
7. **Check WordPress Admin** → Thấy bài viết mới

**Nếu bất kỳ step nào fail → Dùng guide này để fix! 🔧** 