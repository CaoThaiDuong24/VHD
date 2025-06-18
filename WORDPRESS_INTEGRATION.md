# Tích hợp WordPress - Hướng dẫn đầy đủ

## 🚀 Tính năng mới: Tự động đồng bộ tin tức

Hệ thống đã được nâng cấp với tính năng **tự động đồng bộ tin tức** lên WordPress khi thêm/sửa/xóa từ admin panel.

### ✨ Các tính năng chính

#### 1. **Tự động đồng bộ khi thêm tin tức**
- Khi tạo tin tức mới từ `/admin/news/create` → Tự động tạo bài viết WordPress
- Tin tức được chuyển đổi thành HTML có định dạng đẹp
- Bao gồm ảnh đại diện, thư viện ảnh và metadata đầy đủ

#### 2. **Tự động cập nhật WordPress**
- Khi sửa tin tức → Tự động cập nhật bài viết WordPress tương ứng
- Đồng bộ tất cả thay đổi: tiêu đề, nội dung, ảnh, metadata

#### 3. **Tự động xóa từ WordPress**
- Khi xóa tin tức → Tự động xóa bài viết WordPress
- Đảm bảo dữ liệu đồng nhất giữa hai hệ thống

#### 4. **Giao diện quản lý trực quan**
- Toggle bật/tắt đồng bộ WordPress
- Toggle bật/tắt tự động đồng bộ
- Hiển thị trạng thái đồng bộ real-time
- Nút đồng bộ thủ công khi cần

## 🔧 Cách sử dụng

### Bước 1: Cấu hình WordPress
1. Truy cập `/admin/wordpress-settings`
2. Điền thông tin kết nối WordPress:
   - **URL API**: `http://vhdcom.local` (sẽ tự động thêm `/wp-json/wp/v2`)
   - **Username**: Tên đăng nhập WordPress
   - **Application Password**: Tạo từ WordPress Admin → Users → Profile

### Bước 2: Bật tự động đồng bộ
1. Trong trang WordPress Settings:
   - Bật "Kích hoạt đồng bộ WordPress" 
   - Bật "Tự động đồng bộ khi thêm tin tức"
2. Test kết nối để đảm bảo hoạt động

### Bước 3: Tạo tin tức với đồng bộ tự động
1. Vào `/admin/news/create`
2. Điền thông tin tin tức
3. Khi nhấn "Lưu" → Tin tức sẽ được:
   - Lưu vào hệ thống local
   - Tự động tạo bài viết WordPress (nếu bật auto-sync)
   - Hiển thị trạng thái đồng bộ

## 📋 Định dạng bài viết WordPress

Tin tức sẽ được chuyển đổi thành HTML có cấu trúc:

```html
<div class="news-content">
  <!-- Ảnh đại diện -->
  <div class="featured-image">
    <img src="..." alt="..." style="max-width: 100%; height: auto; margin-bottom: 20px;" />
  </div>
  
  <!-- Mô tả -->
  <div class="description">
    <p><strong>Mô tả:</strong> ...</p>
  </div>
  
  <!-- Metadata với styling -->
  <div class="metadata" style="background: #f8f9fa; padding: 15px; margin: 20px 0; border-left: 4px solid #007cba;">
    <p><strong>📍 Địa điểm:</strong> ...</p>
    <p><strong>👥 Số lượng tham gia:</strong> ...</p>
    <p><strong>👤 Tác giả/Tổ chức:</strong> ...</p>
    <p><strong>📅 Ngày đăng:</strong> ...</p>
    <p><strong>⏱️ Thời gian đọc:</strong> ... phút</p>
  </div>
  
  <!-- Nội dung chính -->
  <div class="main-content">...</div>
  
  <!-- Thư viện ảnh (nếu có) -->
  <div class="gallery">
    <h3>Thư viện ảnh</h3>
    <div class="gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
      <div class="gallery-item">
        <img src="..." style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;" />
        <p style="margin-top: 8px; font-size: 14px; color: #666;">Caption</p>
      </div>
    </div>
  </div>
</div>
```

## 🎛️ Các tùy chọn điều khiển

### Trong WordPress Settings (`/admin/wordpress-settings`)

#### **Kích hoạt đồng bộ WordPress**
- **Bật**: Cho phép đồng bộ với WordPress
- **Tắt**: Vô hiệu hóa tất cả tính năng đồng bộ

#### **Tự động đồng bộ khi thêm tin tức**
- **Bật**: Tự động tạo/cập nhật/xóa bài viết WordPress
- **Tắt**: Chỉ đồng bộ khi nhấn nút thủ công

#### **Đồng bộ thủ công**
- Nút "Đồng bộ thủ công" để sync toàn bộ dữ liệu
- Hiển thị trạng thái và kết quả đồng bộ

### Trong Create News (`/admin/news/create`)

#### **Hiển thị trạng thái đồng bộ**
- Card "Trạng thái đồng bộ WordPress" hiện khi bật sync
- Hiển thị trạng thái: Đã bật/Đã tắt, Tự động/Thủ công
- Thông báo trạng thái đồng bộ gần nhất

## 🔍 Xử lý lỗi và Debug

### Các lỗi thường gặp

#### **404 "rest_no_route"**
- **Nguyên nhân**: URL WordPress không đúng hoặc REST API bị tắt
- **Khắc phục**: 
  - Kiểm tra URL: `http://vhdcom.local/wp-json/wp/v2`
  - Bật REST API trong WordPress
  - Kiểm tra Permalinks Settings

#### **401 Unauthorized**
- **Nguyên nhân**: Sai username/password hoặc không có quyền
- **Khắc phục**:
  - Tạo lại Application Password
  - Đảm bảo user có quyền Editor/Administrator

#### **Lỗi đồng bộ tự động**
- **Hiển thị**: Trong lastSyncStatus sẽ có thông báo lỗi
- **Xem chi tiết**: Mở Developer Console (F12) để xem log

### Debug Mode
```javascript
// Trong browser console
localStorage.setItem('debugWordPressSync', 'true')
// Reload trang để thấy debug logs
```

## 🔄 Quy trình hoạt động

### Khi tạo tin tức mới:
1. User điền form và nhấn "Lưu"
2. Tin tức được lưu vào localStorage
3. Nếu `wpSyncEnabled && autoSyncEnabled`:
   - Chuyển đổi tin tức sang format WordPress
   - Gọi API `createPost()` 
   - Lưu WordPress ID vào tin tức
   - Cập nhật `lastSyncStatus`
4. Hiển thị thông báo kết quả

### Khi cập nhật tin tức:
1. User sửa tin tức và lưu
2. Cập nhật dữ liệu local
3. Nếu có WordPress ID và auto-sync bật:
   - Gọi API `updatePost(wpId, data)`
   - Cập nhật trạng thái sync

### Khi xóa tin tức:
1. Xóa khỏi dữ liệu local
2. Nếu có WordPress ID và auto-sync bật:
   - Gọi API `deletePost(wpId)`
   - Cập nhật trạng thái

## 📊 Monitoring và Analytics

### Trạng thái đồng bộ
- `lastSyncStatus`: Hiển thị kết quả sync gần nhất
- Timestamp của lần sync cuối
- Số lượng tin tức đã sync thành công

### Logs
- Console logs cho debugging
- Error tracking cho failed syncs
- Success notifications cho user

## 🛠️ Technical Implementation

### NewsContext Updates
```typescript
interface NewsContextType {
  // ... existing fields
  autoSyncEnabled: boolean
  toggleAutoSync: () => void
  lastSyncStatus: string
  createWordPressPost: (news: NewsItem) => Promise<void>
  updateWordPressPost: (news: NewsItem) => Promise<void>
  deleteWordPressPost: (wpId: number) => Promise<void>
}
```

### Auto-sync Logic
```typescript
const addNews = async (news: Omit<NewsItem, 'id'>): Promise<NewsItem> => {
  // Save locally first
  const newNews = { ...news, id: newId, wpId: undefined }
  setNewsItems(prev => [newNews, ...prev])
  
  // Auto-sync if enabled
  if (wpSyncEnabled && autoSyncEnabled) {
    try {
      await createWordPressPost(newNews)
      setLastSyncStatus('✅ Đã đồng bộ thành công với WordPress')
    } catch (error) {
      setLastSyncStatus('❌ Lỗi đồng bộ: ' + error.message)
    }
  }
  
  return newNews
}
```

## 🔒 Security Considerations

### Application Passwords
- Sử dụng Application Passwords thay vì mật khẩu chính
- Có thể thu hồi bất cứ lúc nào từ WordPress Admin
- Scope hạn chế chỉ cho REST API

### Data Validation
- Validate dữ liệu trước khi gửi lên WordPress
- Sanitize HTML content
- Check permissions trước khi sync

### Error Handling
- Graceful fallback khi WordPress không available
- Retry mechanism cho failed requests
- User-friendly error messages

## 📈 Future Enhancements

### Planned Features
- [ ] Bidirectional sync (WordPress → Local)
- [ ] Batch sync operations
- [ ] Conflict resolution
- [ ] Sync scheduling
- [ ] Media library sync
- [ ] Category/Tag mapping
- [ ] Custom field mapping
- [ ] Webhook support

### Performance Optimizations
- [ ] Background sync jobs
- [ ] Incremental sync
- [ ] Caching layer
- [ ] Rate limiting
- [ ] Connection pooling

---

## 📞 Support

Nếu gặp vấn đề với tự động đồng bộ WordPress:

1. **Kiểm tra kết nối**: Dùng nút "Kiểm tra kết nối" trong WordPress Settings
2. **Xem logs**: Mở Developer Console để xem error details
3. **Test thủ công**: Thử đồng bộ thủ công trước
4. **Kiểm tra quyền**: Đảm bảo WordPress user có quyền đầy đủ
5. **Restart services**: Restart XAMPP/Local development server

**Hotline hỗ trợ**: [Thông tin liên hệ]
**Documentation**: `/admin/wordpress-settings` có hướng dẫn chi tiết 