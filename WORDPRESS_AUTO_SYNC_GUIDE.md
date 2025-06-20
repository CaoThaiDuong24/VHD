# 🔄 WordPress Auto-Sync System Guide

## Tổng quan

Hệ thống đồng bộ tự động WordPress cho phép website tự động cập nhật dữ liệu tin tức và sự kiện từ WordPress CMS một cách thông minh và hiệu quả.

## ✨ Tính năng chính

### 🚀 Auto-Sync
- **Tự động đồng bộ** theo khoảng thời gian tùy chọn (1, 5, 15, 30 phút)
- **Incremental sync** - chỉ đồng bộ dữ liệu mới/thay đổi
- **Smart scheduling** - tránh đồng bộ trùng lặp
- **Background processing** - không ảnh hưởng đến user experience

### 💾 Intelligent Caching
- **Multi-layer caching**: Memory + localStorage
- **TTL-based expiration**: Tự động xóa cache hết hạn  
- **Cache invalidation**: Làm mới khi có dữ liệu mới
- **Offline fallback**: Sử dụng cache khi mất kết nối

### 🛡️ Error Handling
- **Graceful degradation**: Fallback dữ liệu cũ khi lỗi
- **Retry mechanism**: Tự động thử lại khi thất bại
- **Detailed logging**: Log chi tiết để debug
- **Status monitoring**: Theo dõi trạng thái kết nối

### 📊 Monitoring & Stats
- **Sync statistics**: Số lần sync, lỗi, thành công
- **Connection status**: Real-time trạng thái kết nối
- **Performance metrics**: Thời gian sync, cache hit rate
- **Visual dashboard**: Giao diện quản lý trực quan

## 🔧 Cài đặt và Cấu hình

### Bước 1: Chuẩn bị WordPress

1. **Đảm bảo WordPress REST API hoạt động**:
   ```
   http://your-wordpress-site.com/wp-json/wp/v2
   ```

2. **Tạo Application Password**:
   - Vào WordPress Admin → Users → Profile
   - Scroll down đến "Application Passwords"
   - Tạo new password với tên "Frontend Sync"
   - Copy password được tạo

3. **Cấu hình Permalinks**:
   - Vào Settings → Permalinks  
   - Chọn "Post name" hoặc "Custom Structure"
   - Save Changes

### Bước 2: Cấu hình Frontend

1. **Truy cập Admin Panel**:
   ```
   http://localhost:3000/admin/wordpress-settings
   ```

2. **Điền thông tin WordPress**:
   - **API URL**: `http://your-wordpress-site.com/wp-json/wp/v2`
   - **Username**: Tên đăng nhập WordPress
   - **Password**: Application Password vừa tạo

3. **Test Connection**:
   - Click "Kiểm tra kết nối"
   - Đảm bảo kết nối thành công (màu xanh)

4. **Lưu cài đặt**:
   - Click "Lưu cài đặt" hoặc `Ctrl+S`

### Bước 3: Kích hoạt Auto-Sync

1. **Trong Auto-Sync Manager section**:
   - Bật "Kích hoạt tự động đồng bộ"
   - Chọn khoảng thời gian sync (khuyến nghị: 5 phút)
   - Theo dõi trạng thái trong dashboard

## 📋 API Documentation

### REST Endpoints

#### 1. Health Check
```http
GET /api/sync/wordpress?action=health
```
**Response**:
```json
{
  "success": true,
  "status": "WordPress API connection healthy",
  "timestamp": "2025-01-19T10:30:00.000Z"
}
```

#### 2. Fetch All Posts
```http
GET /api/sync/wordpress?action=fetch
```
**Response**:
```json
{
  "success": true,
  "data": [...newsItems],
  "count": 25,
  "lastSync": "2025-01-19T10:30:00.000Z"
}
```

#### 3. Incremental Sync
```http
GET /api/sync/wordpress?action=fetch-updated&since=2025-01-19T09:00:00.000Z
```
**Response**:
```json
{
  "success": true,
  "data": [...updatedItems],
  "count": 3,
  "lastSync": "2025-01-19T10:30:00.000Z"
}
```

#### 4. Push to WordPress
```http
POST /api/sync/wordpress
Content-Type: application/json

{
  "action": "push-to-wordpress",
  "data": [...newsItems]
}
```

## 🎯 Sử dụng Auto-Sync Hook

```typescript
import { useAutoSync } from '@/hooks/useAutoSync'

function MyComponent() {
  const { 
    syncStatus, 
    triggerManualSync,
    isAutoSyncActive 
  } = useAutoSync({
    interval: 5 * 60 * 1000, // 5 minutes
    enabled: true,
    onSuccess: (result) => {
      console.log('Sync thành công:', result)
    },
    onError: (error) => {
      console.error('Sync lỗi:', error)
    }
  })

  return (
    <div>
      <p>Trạng thái: {isAutoSyncActive ? 'Đang hoạt động' : 'Tắt'}</p>
      <p>Lần sync cuối: {syncStatus.lastSync?.toLocaleString()}</p>
      <button onClick={triggerManualSync}>
        Sync thủ công
      </button>
    </div>
  )
}
```

## 💾 Cache Management

### Cache Levels

1. **Memory Cache** (First Level):
   - Fastest access
   - TTL: 5-30 minutes tùy loại dữ liệu
   - Auto cleanup mỗi 5 phút

2. **localStorage Cache** (Second Level):
   - Persistent across sessions
   - Fallback khi memory cache miss
   - Manual cleanup available

### Cache Usage

```typescript
import { wpCache } from '@/lib/cacheService'

// Cache posts
wpCache.cachePosts(posts, lastModified)

// Get cached posts  
const cached = wpCache.getCachedPosts(lastModified)

// Cache single post
wpCache.cachePost(123, postData)

// Clear all cache
wpCache.clear()
```

## 🔍 Troubleshooting

### Lỗi thường gặp

#### 1. Connection Failed (503)
**Nguyên nhân**: WordPress server không truy cập được
**Giải pháp**:
- Kiểm tra WordPress server đang chạy
- Verify URL WordPress đúng
- Check firewall/network settings

#### 2. Authentication Error (401)  
**Nguyên nhân**: Sai username/password
**Giải pháp**:
- Verify username chính xác
- Tạo lại Application Password
- Đảm bảo user có quyền truy cập API

#### 3. REST API Not Found (404)
**Nguyên nhân**: WordPress REST API bị tắt
**Giải pháp**:
- Check Permalinks settings
- Disable conflicting plugins
- Verify `/wp-json/wp/v2` accessible

#### 4. CORS Error
**Nguyên nhân**: WordPress chặn cross-origin requests
**Giải pháp**:
```php
// Thêm vào functions.php
add_action('rest_api_init', function() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
});
```

### Debug Commands

```bash
# Test API endpoint
curl -X GET "http://localhost:3000/api/sync/wordpress?action=health"

# Check WordPress REST API
curl -X GET "http://your-wp-site.com/wp-json/wp/v2/posts?per_page=1"

# Test with auth
curl -X GET "http://your-wp-site.com/wp-json/wp/v2/posts" \
  -H "Authorization: Basic $(echo -n 'username:password' | base64)"
```

## 📈 Performance Optimization

### Caching Strategy
- **Posts**: 5 minutes TTL
- **Connection Status**: 2 minutes TTL  
- **Categories/Tags**: 30 minutes TTL
- **Auto cleanup**: Every 5 minutes

### Sync Frequency Recommendations
- **High traffic site**: 15-30 minutes
- **Medium traffic site**: 5-15 minutes
- **Low traffic site**: 1-5 minutes
- **Development**: 1 minute

### Memory Management
- Cache size limit: 200 entries
- Auto cleanup expired entries
- Manual cleanup tools available
- localStorage fallback for offline

## 🔐 Security Considerations

1. **Use Application Passwords** (không dùng main password)
2. **HTTPS trong production** cho API calls
3. **Rate limiting** để tránh spam requests
4. **User permissions** - chỉ users có quyền mới access API
5. **Input validation** cho tất cả API parameters
6. **Error message sanitization** - không expose sensitive info

## 📊 Monitoring Dashboard

Auto-Sync Manager cung cấp:

- ✅ **Connection Status**: Real-time WordPress connection status
- 📈 **Sync Statistics**: Success rate, error count, sync frequency  
- ⏰ **Scheduling Info**: Next sync time, interval settings
- 💾 **Cache Status**: Cache size, hit rate, cleanup stats
- 🔧 **Manual Controls**: Manual sync trigger, cache management
- 📋 **Error Logs**: Detailed error messages và troubleshooting tips

## 🚀 Production Deployment

### Environment Variables
```env
# WordPress Connection
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wp-site.com/wp-json/wp/v2
WORDPRESS_USERNAME=your-username  
WORDPRESS_PASSWORD=your-app-password

# Cache Settings (optional)
CACHE_TTL_POSTS=300000        # 5 minutes
CACHE_TTL_CONNECTION=120000   # 2 minutes
CACHE_MAX_SIZE=200           # Max cache entries
```

### Deployment Checklist
- [ ] WordPress REST API accessible từ production server
- [ ] Application passwords configured
- [ ] Environment variables set
- [ ] CORS headers configured if needed
- [ ] SSL certificates valid
- [ ] Firewall rules allow API access
- [ ] Monitoring/alerting setup
- [ ] Backup strategy for cached data

## 📞 Support

Nếu gặp vấn đề:

1. **Check console logs** trong browser DevTools
2. **Verify WordPress API** bằng direct URL access  
3. **Test connection** trong Admin Panel
4. **Check network tab** để xem API requests/responses
5. **Review error messages** trong Auto-Sync Manager

Các log files quan trọng:
- Browser Console: Real-time errors/warnings
- Network Tab: API request/response details  
- Auto-Sync Manager: Sync statistics và status

---

## ⚡ Quick Start

1. Cài đặt WordPress với REST API enabled
2. Tạo Application Password
3. Vào `/admin/wordpress-settings` 
4. Cấu hình connection details
5. Test connection thành công
6. Bật Auto-Sync với interval 5 phút
7. Monitor dashboard để verify hoạt động

**🎉 Hoàn thành! Website sẽ tự động đồng bộ dữ liệu từ WordPress.**
