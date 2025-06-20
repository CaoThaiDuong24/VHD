# HƯỚNG DẪN SỬ DỤNG WORDPRESS SYNC - CHI TIẾT

## 🎯 MỤC TIÊU
Hướng dẫn từng bước để dữ liệu tạo mới từ frontend tự động được lưu lên WordPress thông qua API.

## 📋 KIỂM TRA TRƯỚC KHI BẮT ĐẦU

### 1. Kiểm tra WordPress đang chạy
- Mở browser, truy cập: `http://vhdcom.local`
- Đảm bảo WordPress hiển thị bình thường
- Kiểm tra REST API: `http://vhdcom.local/wp-json/wp/v2/posts`

### 2. Kiểm tra Next.js server đang chạy
- Terminal hiện tại đang chạy: `http://localhost:3001` (từ log)
- Kiểm tra API endpoint: `http://localhost:3001/api/sync/wordpress?action=health`

## 🔧 BƯỚC 1: CẤU HÌNH WORDPRESS SYNC

### Cách 1: Qua Admin Panel (Khuyên dùng)
1. Vào: `http://localhost:3001/admin/wordpress-settings`
2. Nhập thông tin:
   - **API URL**: `http://vhdcom.local/wp-json/wp/v2`
   - **Username**: `admin`
   - **Password**: `admin` (hoặc Application Password)
   - **Enabled**: ✅ Checked
3. Nhấn "Save Settings"
4. Nhấn "Test Connection" để kiểm tra

### Cách 2: Qua Browser Console (Nhanh hơn)
1. Vào bất kỳ trang nào của website
2. Nhấn F12 → Console tab
3. Copy và paste:

```javascript
// Bật tất cả sync settings
localStorage.setItem('wpSyncEnabled', 'true')
localStorage.setItem('autoSyncEnabled', 'true')
localStorage.setItem('bidirectionalSyncEnabled', 'true')

// Cấu hình WordPress settings
const wpSettings = {
  apiUrl: 'http://vhdcom.local/wp-json/wp/v2',
  username: 'admin',
  password: 'admin',
  enabled: true
}
localStorage.setItem('wordpressSettings', JSON.stringify(wpSettings))

console.log('✅ WordPress sync đã được cấu hình!')
location.reload()
```

## 🧪 BƯỚC 2: TEST WORDPRESS CONNECTION

Paste vào Console:

```javascript
// Test WordPress connection
const testWordPressConnection = async () => {
  console.log('🔍 Testing WordPress connection...')
  
  try {
    // Test WordPress REST API
    const wpResponse = await fetch('http://vhdcom.local/wp-json/wp/v2/posts?per_page=1')
    if (wpResponse.ok) {
      console.log('✅ WordPress REST API: ACCESSIBLE')
      const posts = await wpResponse.json()
      console.log('📊 WordPress posts found:', posts.length)
    } else {
      console.log('❌ WordPress REST API: FAILED')
      console.log('Status:', wpResponse.status)
    }
    
    // Test Frontend API
    const apiResponse = await fetch('http://localhost:3001/api/sync/wordpress?action=health')
    if (apiResponse.ok) {
      const apiData = await apiResponse.json()
      console.log('✅ Frontend API: WORKING')
      console.log('📊 Health check:', apiData.success ? 'SUCCESS' : 'FAILED')
    } else {
      console.log('❌ Frontend API: FAILED')
      console.log('Status:', apiResponse.status)
    }
    
  } catch (error) {
    console.log('❌ Connection test failed:', error.message)
  }
}

testWordPressConnection()
```

## 🚀 BƯỚC 3: TẠO TIN TỨC VÀ KIỂM TRA SYNC

### Cách 1: Tạo tin tức qua Admin Panel
1. Vào: `http://localhost:3001/admin/news/create`
2. Nhập thông tin tin tức:
   - **Tiêu đề**: Ví dụ "Test News Sync"
   - **Mô tả**: Mô tả ngắn
   - **Nội dung chi tiết**: Nội dung đầy đủ
   - **Trạng thái**: Draft hoặc Published
3. Nhấn "Tạo tin tức"
4. **Quan trọng**: Mở F12 → Console để xem log sync

### Cách 2: Tạo tin tức qua Console (Test)
Paste vào Console:

```javascript
// Tạo test news và sync
const createTestNews = async () => {
  console.log('📝 Creating test news...')
  
  const testNews = {
    id: Date.now(),
    title: `Test News ${new Date().toLocaleTimeString('vi-VN')}`,
    titleEn: `Test News ${new Date().toLocaleTimeString('vi-VN')}`,
    description: 'Tin tức test để kiểm tra sync WordPress',
    descriptionEn: 'Test news to check WordPress sync',
    image: '/images/hoi_xuat_ban.png',
    category: 'Tin tức',
    categoryEn: 'News',
    date: new Date().toLocaleDateString('vi-VN'),
    detailContent: `<h1>Test News Sync</h1>
<p>Đây là tin tức test để kiểm tra sync WordPress.</p>
<p>Thời gian tạo: ${new Date().toLocaleString('vi-VN')}</p>`,
    detailContentEn: `<h1>Test News Sync</h1>
<p>This is a test news to check WordPress sync.</p>
<p>Created at: ${new Date().toLocaleString('vi-VN')}</p>`,
    views: 0,
    readingTime: 2,
    status: 'draft',
    featured: false,
    tags: ['test', 'sync'],
    author: 'Test User',
    authorEn: 'Test User'
  }
  
  try {
    // Call API to create WordPress post
    console.log('🚀 Calling WordPress sync API...')
    const response = await fetch('/api/sync/wordpress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'create',
        data: testNews
      })
    })
    
    console.log('📡 API Response status:', response.status)
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ WordPress post created successfully!')
      console.log('📊 WordPress Post ID:', result.wpId)
      console.log('📊 Result:', result)
      
      // Add to localStorage
      const existingNews = JSON.parse(localStorage.getItem('news') || '[]')
      testNews.wpId = result.wpId
      const updatedNews = [testNews, ...existingNews]
      localStorage.setItem('news', JSON.stringify(updatedNews))
      
      console.log('✅ Test news added to localStorage with wpId:', result.wpId)
      console.log('🎯 Check WordPress admin: http://vhdcom.local/wp-admin/edit.php')
      
    } else {
      const errorText = await response.text()
      console.log('❌ WordPress post creation failed')
      console.log('📋 Error:', errorText)
    }
    
  } catch (error) {
    console.log('❌ API call failed:', error.message)
  }
}

createTestNews()
```

## 📊 BƯỚC 4: KIỂM TRA KẾT QUẢ

### 1. Kiểm tra Console Logs
Sau khi tạo tin tức, Console sẽ hiển thị:
```
🔍 Sync Settings Check: {wpSyncEnabled: true, autoSyncEnabled: true, willSync: true}
🚀 Starting WordPress sync for news: [Tên tin tức]
📡 Calling sync API...
📡 API Response status: 200
✅ WordPress post created via API: {wpId: 123, message: "Post created successfully"}
✅ Đã tạo bài viết WordPress thành công: 123
```

### 2. Kiểm tra WordPress Admin
1. Vào: `http://vhdcom.local/wp-admin/edit.php`
2. Đăng nhập WordPress (admin/admin)
3. Tìm bài viết mới tạo trong danh sách
4. Kiểm tra nội dung bài viết

### 3. Kiểm tra localStorage
Paste vào Console:
```javascript
// Kiểm tra tin tức trong localStorage
const news = JSON.parse(localStorage.getItem('news') || '[]')
console.log('📊 Total news:', news.length)
console.log('📋 Recent news with wpId:', 
  news.filter(n => n.wpId).slice(0, 3).map(n => ({
    id: n.id,
    title: n.title,
    wpId: n.wpId
  }))
)
```

## ⚠️ XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi 401 - Authentication Failed
**Nguyên nhân**: Sai username/password
**Giải pháp**:
1. Vào: `http://vhdcom.local/wp-admin/profile.php`
2. Tìm "Application Passwords"
3. Tạo password mới tên "Frontend Sync"
4. Copy password được tạo
5. Cập nhật settings:
```javascript
const wpSettings = {
  apiUrl: 'http://vhdcom.local/wp-json/wp/v2',
  username: 'admin',
  password: 'YOUR_APPLICATION_PASSWORD_HERE', // Paste password ở đây
  enabled: true
}
localStorage.setItem('wordpressSettings', JSON.stringify(wpSettings))
location.reload()
```

### Lỗi 403 - Permission Denied
**Nguyên nhân**: User không có quyền tạo post
**Giải pháp**: Đảm bảo user có role Editor hoặc Administrator

### Lỗi 404 - Not Found
**Nguyên nhân**: WordPress không chạy hoặc REST API bị tắt
**Giải pháp**: 
1. Kiểm tra WordPress chạy: `http://vhdcom.local`
2. Kiểm tra permalink settings trong WordPress admin

### Lỗi 500 - Server Error
**Nguyên nhân**: Lỗi server WordPress
**Giải pháp**: Kiểm tra WordPress error logs

## 🔄 WORKFLOW HOÀN CHỈNH

1. **Cấu hình** → Settings được lưu trong localStorage
2. **Tạo tin tức** → NewsContext.addNews() được gọi
3. **Auto sync** → createWordPressPost() được trigger
4. **API call** → POST /api/sync/wordpress với action='create'
5. **WordPress** → Post được tạo với status draft/publish
6. **Update local** → wpId được lưu vào localStorage
7. **Hoàn thành** → Tin tức có mặt cả local và WordPress

## 🎯 KIỂM TRA CUỐI CÙNG

Paste vào Console để kiểm tra toàn bộ hệ thống:

```javascript
// Comprehensive system check
const systemCheck = async () => {
  console.log('🔍 COMPREHENSIVE SYSTEM CHECK\n')
  
  // 1. Check settings
  const wpSync = localStorage.getItem('wpSyncEnabled') === 'true'
  const autoSync = localStorage.getItem('autoSyncEnabled') === 'true'
  const wpSettings = localStorage.getItem('wordpressSettings')
  
  console.log('1️⃣ Settings:')
  console.log('   wpSyncEnabled:', wpSync)
  console.log('   autoSyncEnabled:', autoSync)
  console.log('   wpSettings:', !!wpSettings)
  
  // 2. Test connections
  console.log('\n2️⃣ Connections:')
  try {
    const wpTest = await fetch('http://vhdcom.local/wp-json/wp/v2/posts?per_page=1')
    console.log('   WordPress API:', wpTest.ok ? '✅ OK' : '❌ FAILED')
    
    const apiTest = await fetch('/api/sync/wordpress?action=health')
    console.log('   Frontend API:', apiTest.ok ? '✅ OK' : '❌ FAILED')
  } catch (e) {
    console.log('   Connection test failed:', e.message)
  }
  
  // 3. Check news data
  const news = JSON.parse(localStorage.getItem('news') || '[]')
  const newsWithWpId = news.filter(n => n.wpId)
  
  console.log('\n3️⃣ Data:')
  console.log('   Total news:', news.length)
  console.log('   News with wpId:', newsWithWpId.length)
  
  // 4. Summary
  console.log('\n🎯 SUMMARY:')
  if (wpSync && autoSync && wpSettings) {
    console.log('✅ System ready for WordPress sync!')
    console.log('💡 Create news at: http://localhost:3001/admin/news/create')
  } else {
    console.log('❌ System not ready. Check settings above.')
  }
}

systemCheck()
```

## 📞 HỖ TRỢ

Nếu vẫn gặp vấn đề, chạy script debug:
```javascript
// Copy nội dung file debug-wordpress-sync.js vào Console
```

Hoặc chạy script fix nhanh:
```javascript
// Copy nội dung file fix-wordpress-sync-now.js vào Console
``` 