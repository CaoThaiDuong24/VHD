# 🔐 Hướng dẫn thiết lập WordPress Application Password

## Tình trạng hiện tại
✅ **WordPress REST API**: Đang hoạt động tại `http://vhdcom.local/wp-json/wp/v2`  
✅ **Frontend API**: Các endpoint Next.js đã sẵn sàng  
✅ **Components**: Tất cả UI components đã được tạo  
⚠️ **Authentication**: Cần thiết lập Application Password  

---

## 🎯 Các bước thiết lập

### Bước 1: Tạo Application Password trong WordPress

1. **Đăng nhập vào WordPress Admin**
   ```
   http://vhdcom.local/wp-admin
   ```

2. **Vào User Profile**
   - Click vào tên user ở góc trên phải
   - Chọn "Edit My Profile" hoặc vào Users > All Users > Click vào user admin

3. **Tạo Application Password**
   - Cuộn xuống phần "Application Passwords"
   - Trong ô "New Application Password Name", nhập: `Frontend Sync`
   - Click **"Add New Application Password"**
   - **LƯU Ý**: Copy password được tạo ngay lập tức (chỉ hiển thị 1 lần)

4. **Ví dụ Application Password sẽ có dạng**:
   ```
   abcd efgh ijkl mnop qrst uvwx
   ```

### Bước 2: Cấu hình Frontend

1. **Mở Admin Panel**
   ```
   http://localhost:3001/admin/wordpress-settings
   ```

2. **Nhập thông tin**:
   - **WordPress API URL**: `http://vhdcom.local/wp-json/wp/v2`
   - **Username**: `admin` (hoặc username WordPress của bạn)
   - **Application Password**: `abcd efgh ijkl mnop qrst uvwx` (password vừa tạo)

3. **Test kết nối**:
   - Click **"Kiểm tra kết nối"**
   - Đợi kết quả (phải có màu xanh)

4. **Lưu cài đặt**:
   - Click **"Lưu cài đát"** hoặc `Ctrl+S`

### Bước 3: Kích hoạt Auto-sync (Tùy chọn)

1. **Trong Auto-Sync Manager section**:
   - Bật **"Kích hoạt tự động đồng bộ"**
   - Chọn khoảng thời gian (khuyến nghị: 5 phút)
   - Theo dõi dashboard

---

## 🐛 Troubleshooting phổ biến

### ❌ Lỗi "401 Unauthorized"
**Nguyên nhân**: Username hoặc Application Password sai  
**Giải pháp**:
- Kiểm tra username chính xác
- Tạo lại Application Password
- Đảm bảo không có khoảng trống thừa

### ❌ Lỗi "404 Not Found"
**Nguyên nhân**: URL API sai hoặc REST API bị tắt  
**Giải pháp**:
- Kiểm tra URL: `http://vhdcom.local/wp-json/wp/v2`
- Test trực tiếp trong browser
- Kiểm tra WordPress Permalinks

### ❌ Lỗi Connection Timeout
**Nguyên nhân**: WordPress server không chạy  
**Giải pháp**:
- Kiểm tra XAMPP/Local server
- Restart WordPress
- Kiểm tra firewall

---

## 📊 Tính năng sau khi thiết lập

### ✅ Đồng bộ tự động
- Tự động lấy tin tức mới từ WordPress
- Cập nhật nội dung đã thay đổi
- Sync bidirectional (2 chiều)

### ✅ Cache thông minh
- Giảm tải server WordPress
- Tăng tốc độ website
- Offline fallback

### ✅ Monitoring
- Dashboard theo dõi sync status
- Statistics chi tiết
- Error logging

---

## 🚀 Test kết nối ngay

Chạy lệnh sau để test:
```bash
node test-api.js
```

Hoặc truy cập:
```
http://localhost:3001/admin/wordpress-settings
```

---

## 💡 Lưu ý quan trọng

1. **Application Password khác với password thường**: Không dùng password đăng nhập WordPress
2. **Chỉ hiển thị 1 lần**: Copy ngay sau khi tạo
3. **An toàn**: Có thể revoke bất kỳ lúc nào
4. **Permissions**: Application Password có quyền như user tạo ra nó

---

**🎉 Sau khi hoàn thành, hệ thống sẽ tự động đồng bộ dữ liệu từ WordPress!** 