// Auto-generated news data with WordPress imports
// Generated at: 2025-06-20T07:33:31.069Z

export interface GalleryImage {
  id: string
  src: string
  alt: string
  caption?: string
}

export interface NewsItem {
  id: number
  title: string
  titleEn?: string
  content: string
  description: string
  descriptionEn?: string
  detailContent?: string
  detailContentEn?: string
  image: string
  date: string
  author: string
  authorEn?: string
  category: string
  categoryEn?: string
  location?: string
  locationEn?: string
  participants?: string
  participantsEn?: string
  tags: string[]
  slug?: string
  wpId?: number
  status?: string
  featured?: boolean
  views?: number
  readingTime?: number
  gradient?: string
  gallery?: GalleryImage[]
}

// Default news items (original)
const defaultNewsItems: NewsItem[] = [
  {
    id: 1,
    title: "Khai mạc triển lãm sách quốc tế",
    content: "Triển lãm sách quốc tế năm 2024 đã chính thức khai mạc với sự tham gia của hơn 500 nhà xuất bản từ 30 quốc gia và vùng lãnh thổ. Sự kiện mang đến những đầu sách mới nhất, các hoạt động giao lưu văn hóa đọc phong phú.",
    description: "Sự kiện văn hóa đọc lớn nhất năm với sự tham gia của nhiều nhà xuất bản quốc tế",
    image: "/images/book-exhibition.jpg",
    date: "2024-03-15",
    author: "Nguyễn Văn A",
    category: "Sự kiện",
    tags: ["triển lãm", "sách", "văn hóa đọc"],
    slug: "khai-mac-trien-lam-sach-quoc-te"
  },
  {
    id: 2,
    title: "Hội thảo phát triển văn hóa đọc trong cộng đồng",
    content: "Trung tâm phối hợp tổ chức hội thảo về phát triển văn hóa đọc trong cộng đồng, thu hút sự tham gia của các chuyên gia, nhà giáo dục và đại diện các tổ chức xã hội.",
    description: "Hội thảo quan trọng về phát triển văn hóa đọc với sự tham gia của nhiều chuyên gia",
    image: "/images/conference-seminar.jpg", 
    date: "2024-03-10",
    author: "Trần Thị B",
    category: "Hội thảo",
    tags: ["hội thảo", "văn hóa đọc", "cộng đồng"],
    slug: "hoi-thao-phat-trien-van-hoa-doc"
  }
];

// WordPress imported news items
const wordpressNewsItems: NewsItem[] = [
  {
    "id": 112,
    "title": "abc",
    "content": "têtts",
    "description": "têtts",
    "image": "/placeholder.svg",
    "date": "2025-06-18T10:39:38",
    "author": "WordPress Import",
    "category": "WordPress Import",
    "tags": [
      "WordPress",
      "Import"
    ],
    "slug": "abc",
    "wpId": 12,
    "status": "publish",
    "gallery": []
  },
  {
    "id": 101,
    "title": "Hello world!",
    "content": "Welcome to WordPress. This is your first post. Edit or delete it, then start writing!",
    "description": "Welcome to WordPress. This is your first post. Edit or delete it, then start writing!",
    "image": "/placeholder.svg",
    "date": "2025-06-17T09:01:40",
    "author": "WordPress Import",
    "category": "WordPress Import",
    "tags": [
      "WordPress",
      "Import"
    ],
    "slug": "hello-world",
    "wpId": 1,
    "status": "publish",
    "gallery": []
  }
];

// Combined news items (WordPress first, then default)
export const newsItems: NewsItem[] = [
  ...wordpressNewsItems,
  ...defaultNewsItems
];

// Export for external use
export default newsItems;
