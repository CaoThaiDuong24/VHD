# 🌐 Reading Culture Development Center Website

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

**Trung tâm Phát triển Văn hóa đọc và Kinh tế Xuất bản**

</div>

---

## 📋 **Tổng quan dự án**

Website chính thức của Trung tâm Phát triển Văn hóa đọc (RCP) - một tổ chức thuộc Hiệp hội Xuất bản Việt Nam, chuyên về phát triển văn hóa đọc và hỗ trợ ngành xuất bản.

### 🎯 **Mục tiêu**
- Kết nối tri thức – Lan tỏa văn hóa đọc
- Đồng hành cùng sự phát triển ngành xuất bản Việt Nam
- Xây dựng cộng đồng yêu thích đọc sách

---

## 🚀 **Công nghệ sử dụng**

### **Frontend Framework**
- **Next.js 15.2.4** - React framework với App Router
- **React 19** - UI library
- **TypeScript** - Type safety

### **Styling & UI**
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **Lucide React** - Beautiful icons

### **Features**
- 🌐 **Multi-language** (Vietnamese/English)
- 📱 **Responsive Design** 
- ⚡ **Performance Optimized**
- 🎨 **Modern UI/UX**

---

## 📁 **Cấu trúc dự án**

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles
│   ├── about/             # About page
│   ├── news/              # News pages
│   │   └── [id]/          # Dynamic news detail
│   ├── events/            # Events page
│   ├── projects/          # Projects page
│   └── contact/           # Contact page
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   ├── layout/           # Layout components
│   └── sections/         # Page sections
├── contexts/             # React contexts
├── lib/                  # Utilities & data
├── public/               # Static assets
│   └── images/           # Image assets
└── hooks/                # Custom hooks
```

---

## 🛠️ **Cài đặt & Chạy dự án**

### **Yêu cầu hệ thống**
- Node.js 18+ 
- npm hoặc yarn

### **Cài đặt**
```bash
# Clone repository
git clone [repository-url]
cd reading-culture-center

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Chạy production
npm start
```

### **Scripts có sẵn**
```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Production server
npm run lint     # ESLint check
```

---

## 📄 **Các trang chính**

| 🏠 **Trang** | 📝 **Mô tả** | 🔗 **Route** |
|:---|:---|:---|
| **Trang chủ** | Giới thiệu tổng quan, thống kê, tin tức nổi bật | `/` |
| **Về chúng tôi** | Lịch sử, tầm nhìn, sứ mệnh, đội ngũ | `/about` |
| **Tin tức** | Danh sách tin tức, tìm kiếm, phân loại | `/news` |
| **Chi tiết tin tức** | Nội dung chi tiết, đăng ký sự kiện | `/news/[id]` |
| **Sự kiện** | Sự kiện sắp tới, đã qua, đăng ký | `/events` |
| **Dự án** | Dự án đang thực hiện, hoàn thành | `/projects` |
| **Liên hệ** | Thông tin liên hệ, form, bản đồ | `/contact` |

---

## ✨ **Tính năng nổi bật**

### 🔍 **Tìm kiếm & Lọc tin tức**
- Tìm kiếm theo tiêu đề và nội dung
- Lọc theo danh mục
- Phân trang thông minh

### 📅 **Đăng ký sự kiện**
- Modal đăng ký tích hợp trong chi tiết tin tức
- Form validation
- Xác nhận qua email

### 🌐 **Đa ngôn ngữ**
- Hỗ trợ Tiếng Việt và English
- Chuyển đổi ngôn ngữ mượt mà
- 675+ translation keys

### 📱 **Responsive Design**
- Tối ưu cho mọi thiết bị
- Mobile-first approach
- Touch-friendly interface

---

## 🎨 **Design System**

### **Colors**
- **Primary**: Emerald green (#059669)
- **Secondary**: Teal (#0891b2)
- **Accent**: Blue (#3b82f6)

### **Typography**
- **Display**: Playfair Display (headings)
- **Body**: Inter (content)

### **Components**
- Glass morphism effects
- Gradient backgrounds
- Smooth animations
- Modern shadows

---

## 📊 **Performance**

### **Build Stats**
- **Total Pages**: 7 static + 1 dynamic
- **Bundle Size**: ~101KB shared chunks
- **First Load JS**: 133-150KB per page
- **Build Time**: ~10-15 seconds

### **Optimizations**
- Static Site Generation (SSG)
- Image optimization
- Code splitting
- Font optimization

---

## 🤝 **Đóng góp**

### **Development Workflow**
1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

### **Code Standards**
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits

---

## 📞 **Liên hệ**

**Trung tâm Phát triển Văn hóa đọc và Kinh tế Xuất bản**
- 📧 Email: vanphong1@trungtamvanhoadoc.org.vn
- 📱 Phone: 0912 116 668 (Ms. Yến Nhi)
- 🌐 Website: [trungtamvanhoadoc.org.vn]

---

<div align="center">

**🎯 Made with ❤️ for Reading Culture Development**

</div> 