# 🚀 Hướng dẫn Test Đồng bộ WordPress

## ⚡ Test nhanh trong 3 phút

### Bước 1: Cấu hình WordPress Settings
1. **Mở**: `/admin/wordpress-settings`
2. **Điền thông tin**:
   - **URL API**: `http://vhdcom.local/wp-json/wp/v2`
   - **Username**: Tên đăng nhập WordPress của bạn
   - **Application Password**: Tạo từ WordPress Admin

### Bước 2: Tạo Application Password trong WordPress
1. Vào **WordPress Admin** → **Users** → **Profile**
2. Kéo xuống **Application Passwords**
3. Nhập tên: `Next.js App`
4. Click **Add New Application Password**
5. **Copy** password hiển thị (chỉ hiện 1 lần!)

### Bước 3: Test kết nối
1. Quay lại `/admin/wordpress-settings`
2. Paste **Application Password** vào trường Password
3. Click **"Kiểm tra kết nối"**
4. Nếu thấy ✅ → Thành công!

### Bước 4: Bật đồng bộ
1. **Kích hoạt đồng bộ WordPress**: ✅ ON
2. **Tự động đồng bộ khi thêm tin tức**: ✅ ON
3. **Đồng bộ 2 chiều** (tùy chọn): ✅ ON

### Bước 5: Test tạo tin tức
1. Vào `/admin/news/create`
2. Điền thông tin tin tức
3. Click **"Lưu"**
4. Xem **WordPress Sync Status Card** → Hiển thị trạng thái
5. Kiểm tra WordPress Admin → Posts → Sẽ có bài viết mới!

## 🔧 Troubleshooting

### Lỗi 404 "rest_no_route"
- **Nguyên nhân**: URL không đúng
- **Sửa**: Đảm bảo URL có dạng `http://yoursite.com/wp-json/wp/v2`

### Lỗi 401 Unauthorized  
- **Nguyên nhân**: Sai username/password
- **Sửa**: Tạo lại Application Password

### Lỗi "WordPress settings không tồn tại"
- **Nguyên nhân**: Chưa lưu settings
- **Sửa**: Nhập đầy đủ thông tin và click **"Lưu cài đặt"**

### Không thấy trạng thái đồng bộ
- **Nguyên nhân**: Chưa bật WordPress Sync
- **Sửa**: Bật **"Kích hoạt đồng bộ WordPress"** ở Settings

## ✅ Checklist

- [ ] WordPress đang chạy (XAMPP/Local)
- [ ] Application Password đã tạo
- [ ] URL API đúng định dạng
- [ ] Test connection thành công ✅
- [ ] WordPress Sync: ✅ ON
- [ ] Auto Sync: ✅ ON
- [ ] Tạo tin tức → Kiểm tra WordPress Admin

## 🎯 Kết quả mong đợi

Khi tạo tin tức mới:
1. **Trang tạo tin tức**: Hiện card "Trạng thái đồng bộ WordPress"
2. **Trạng thái**: "✅ Đã đồng bộ thành công lên WordPress"
3. **WordPress Admin**: Bài viết mới xuất hiện với format HTML đẹp
4. **Include**: Ảnh đại diện, metadata, gallery, nội dung đầy đủ

---

**🔥 Giờ bạn có thể test ngay! WordPress sync đã sẵn sàng!** 