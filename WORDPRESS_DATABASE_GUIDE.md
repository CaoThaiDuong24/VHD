# 🗄️ WordPress Database Integration Guide

## 📋 Tổng quan

File `lib/newsData.ts` đã được nâng cấp với đầy đủ các functions để tích hợp với WordPress database. Bạn có thể:

- ✅ **GET**: Lấy tin tức từ WordPress database
- ✅ **POST**: Đăng tin tức mới lên WordPress 
- ✅ **UPDATE**: Cập nhật tin tức trên WordPress
- ✅ **DELETE**: Xóa tin tức từ WordPress
- ✅ **SYNC**: Đồng bộ 2 chiều hoàn chỉnh

## 🚀 Các Functions chính

### 1. **getNewsFromWordPress()**
```typescript
const newsItems = await getNewsFromWordPress()
```
- **Mục đích**: Lấy tất cả tin tức từ WordPress database
- **Return**: `NewsItem[]` - Array các tin tức đã format
- **Features**: 
  - Lấy tối đa 50 bài viết gần nhất
  - Convert từ WordPress format sang NewsItem format
  - Bao gồm cả draft và published posts

### 2. **postNewsToWordPress()**
```typescript
const result = await postNewsToWordPress(newsItem)
// result: { id: number, url?: string }
```
- **Mục đích**: Đăng tin tức mới lên WordPress
- **Input**: `NewsItem` object
- **Return**: WordPress post ID và URL
- **Features**:
  - Convert sang WordPress HTML format đẹp
  - Bao gồm featured image, metadata, gallery
  - Tự động styling inline

### 3. **updateNewsInWordPress()**
```typescript
await updateNewsInWordPress(newsItem) // Cần có wpId
```
- **Mục đích**: Cập nhật tin tức đã có trên WordPress
- **Require**: NewsItem phải có `wpId` property
- **Features**: Cập nhật toàn bộ content, title, metadata

### 4. **deleteNewsFromWordPress()**
```typescript
await deleteNewsFromWordPress(wpId)
```
- **Mục đích**: Xóa vĩnh viễn tin tức từ WordPress
- **Input**: WordPress post ID (number)
- **Features**: Force delete (không qua Trash)

### 5. **syncNewsWithWordPress()**
```typescript
const result = await syncNewsWithWordPress()
// result: { pulled: number, pushed: number, errors: string[] }
```
- **Mục đích**: Đồng bộ 2 chiều hoàn chỉnh
- **Features**:
  - Pull: Lấy tin từ WordPress về local
  - Push: Đẩy tin local (chưa có wpId) lên WordPress
  - Error tracking chi tiết

### 6. **testWordPressConnection()**
```typescript
const result = await testWordPressConnection()
// result: { success: boolean, message: string, postsCount?: number }
```
- **Mục đích**: Kiểm tra kết nối WordPress
- **Features**: Validate settings và test API access

## 🎨 HTML Format Output

Khi đăng lên WordPress, tin tức sẽ được format thành HTML đẹp:

```html
<div class="news-content">
  <!-- Featured Image -->
  <div class="featured-image" style="margin-bottom: 20px;">
    <img src="..." style="max-width: 100%; height: auto; border-radius: 8px;" />
  </div>
  
  <!-- Description -->
  <div class="description" style="margin-bottom: 20px;">
    <p><strong>Mô tả:</strong> ...</p>
  </div>
  
  <!-- Metadata Card -->
  <div class="metadata" style="background: #f8f9fa; padding: 15px; margin: 20px 0; border-left: 4px solid #007cba; border-radius: 4px;">
    <p><strong>📍 Địa điểm:</strong> ...</p>
    <p><strong>👥 Số lượng tham gia:</strong> ...</p>
    <p><strong>👤 Tác giả/Tổ chức:</strong> ...</p>
    <p><strong>📅 Ngày đăng:</strong> ...</p>
    <p><strong>⏱️ Thời gian đọc:</strong> ... phút</p>
    <p><strong>🏷️ Danh mục:</strong> ...</p>
  </div>
  
  <!-- Main Content -->
  <div class="main-content" style="margin: 20px 0; line-height: 1.6;">
    ...
  </div>
  
  <!-- Gallery (if exists) -->
  <div class="gallery" style="margin-top: 30px;">
    <h3>Thư viện ảnh</h3>
    <div class="gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
      <div class="gallery-item" style="border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <img src="..." style="width: 100%; height: 200px; object-fit: cover;" />
        <p style="margin: 8px 12px 12px; font-size: 14px; color: #666; font-style: italic;">Caption</p>
      </div>
    </div>
  </div>
</div>
```

## 💻 Sử dụng trong React Components

### Basic Usage
```typescript
import { 
  getNewsFromWordPress,
  postNewsToWordPress,
  testWordPressConnection 
} from '@/lib/newsData'

// Test connection
const handleTestConnection = async () => {
  const result = await testWordPressConnection()
  if (result.success) {
    setStatus('✅ Kết nối thành công!')
  } else {
    setStatus('❌ ' + result.message)
  }
}

// Get news from WordPress
const handleGetFromWP = async () => {
  try {
    setLoading(true)
    const wpNews = await getNewsFromWordPress()
    setNewsItems(wpNews)
    setStatus(`📥 Đã tải ${wpNews.length} tin tức`)
  } catch (error) {
    setStatus('❌ Lỗi: ' + error.message)
  } finally {
    setLoading(false)
  }
}

// Post news to WordPress
const handlePostToWP = async (news: NewsItem) => {
  try {
    setLoading(true)
    const result = await postNewsToWordPress(news)
    
    // Update local news with WordPress ID
    setNewsItems(prev => prev.map(item => 
      item.id === news.id ? { ...item, wpId: result.id } : item
    ))
    
    setStatus(`✅ Đã đăng lên WordPress: ${result.id}`)
  } catch (error) {
    setStatus('❌ Lỗi đăng bài: ' + error.message)
  } finally {
    setLoading(false)
  }
}
```

### Advanced Usage với Error Handling
```typescript
const handleCompleteSync = async () => {
  try {
    setLoading(true)
    setStatus('🔄 Bắt đầu đồng bộ...')
    
    // 1. Test connection first
    const connectionTest = await testWordPressConnection()
    if (!connectionTest.success) {
      throw new Error('Kết nối WordPress thất bại: ' + connectionTest.message)
    }
    
    // 2. Perform sync
    const syncResult = await syncNewsWithWordPress()
    
    // 3. Update UI with results
    setStatus(`✅ Đồng bộ hoàn tất: ${syncResult.pulled} tải về, ${syncResult.pushed} đẩy lên`)
    
    if (syncResult.errors.length > 0) {
      console.warn('Sync errors:', syncResult.errors)
      setErrors(syncResult.errors)
    }
    
    // 4. Reload news data
    await handleGetFromWP()
    
  } catch (error) {
    setStatus('❌ Lỗi đồng bộ: ' + error.message)
  } finally {
    setLoading(false)
  }
}
```

## ⚙️ Configuration Requirements

### WordPress Settings (localStorage)
```json
{
  "apiUrl": "http://vhdcom.local",
  "username": "your-wp-username", 
  "password": "your-application-password",
  "enabled": true
}
```

### WordPress Setup
1. **Enable REST API**: Đảm bảo WordPress REST API đã bật
2. **Application Password**: Tạo Application Password cho user
3. **Permissions**: User cần quyền Editor hoặc Administrator
4. **Permalinks**: Đảm bảo permalinks đã được cấu hình

## 🔍 Error Handling

### Common Errors và Solutions

#### **WordPress settings không tồn tại**
```typescript
// Error: WordPress settings không tồn tại. Vui lòng cấu hình tại WordPress Settings.
// Solution: Vào /admin/wordpress-settings để cấu hình
```

#### **404 rest_no_route**
```typescript
// Error: 404 rest_no_route
// Solution: 
// - Kiểm tra URL API: http://vhdcom.local/wp-json/wp/v2
// - Bật REST API trong WordPress
// - Kiểm tra Permalinks settings
```

#### **401 Unauthorized**
```typescript
// Error: 401 Unauthorized
// Solution:
// - Tạo lại Application Password
// - Kiểm tra username/password
// - Đảm bảo user có quyền đủ
```

#### **News không có WordPress ID**
```typescript
// Error: News không có WordPress ID
// Solution: Chỉ có thể update/delete news đã được đồng bộ lên WordPress (có wpId)
```

## 📊 Monitoring và Logging

### Console Logs
```typescript
// Success logs
✅ Đã tải 25 tin tức từ WordPress
✅ Đã tạo bài viết WordPress thành công: 123
✅ Đã cập nhật bài viết WordPress thành công: 123
✅ Đã xóa bài viết WordPress thành công: 123

// Error logs  
❌ Lỗi khi tải tin tức từ WordPress: [error details]
❌ Lỗi khi tạo bài viết WordPress: [error details]
```

### Sync Results Tracking
```typescript
const syncResult = {
  pulled: 15,    // Số tin tức tải từ WordPress
  pushed: 3,     // Số tin tức đẩy lên WordPress  
  errors: [      // Danh sách lỗi chi tiết
    "Lỗi đẩy tin 'Tin ABC': 401 Unauthorized",
    "Lỗi tải từ WordPress: Network timeout"
  ]
}
```

## 🚀 Best Practices

### 1. **Always Test Connection First**
```typescript
// Luôn test connection trước khi thực hiện operations
const isReady = await testWordPressConnection()
if (!isReady.success) {
  // Handle configuration issues
  return
}
```

### 2. **Handle Errors Gracefully**
```typescript
try {
  await postNewsToWordPress(news)
} catch (error) {
  // Fallback: Save locally, sync later
  console.error('WordPress sync failed, saving locally:', error)
  // Show user-friendly message
  showNotification('Tin tức đã lưu. Sẽ đồng bộ WordPress sau.')
}
```

### 3. **Batch Operations**
```typescript
// Thay vì sync từng tin một, dùng syncNewsWithWordPress()
const results = await syncNewsWithWordPress()
// Handle both successes and errors in batch
```

### 4. **Cache Management**
```typescript
// Cache WordPress news để tránh gọi API quá nhiều
let wpNewsCache: NewsItem[] | null = null
let cacheTimestamp = 0

const getNewsWithCache = async () => {
  const now = Date.now()
  if (wpNewsCache && (now - cacheTimestamp) < 5 * 60 * 1000) { // 5 minutes
    return wpNewsCache
  }
  
  wpNewsCache = await getNewsFromWordPress()
  cacheTimestamp = now
  return wpNewsCache
}
```

## 🔧 Troubleshooting

### Debug Mode
```typescript
// Enable debug logging
localStorage.setItem('debugWordPressSync', 'true')

// Check WordPress settings
console.log('WP Settings:', localStorage.getItem('wordpressSettings'))

// Test individual functions
await testWordPressConnection()
```

### Network Issues
```typescript
// Add timeout and retry logic
const fetchWithRetry = async (fn: Function, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

---

## 📞 Support

Nếu gặp vấn đề với WordPress database integration:

1. **Kiểm tra WordPress Settings**: `/admin/wordpress-settings`
2. **Test Connection**: Dùng `testWordPressConnection()`
3. **Check Console**: Xem logs chi tiết trong Developer Console
4. **Debug Mode**: Bật debug logging để trace issues
5. **Network**: Kiểm tra XAMPP/Local development server

**Documentation**: Tham khảo `lib/newsDataExample.ts` cho các examples chi tiết. 