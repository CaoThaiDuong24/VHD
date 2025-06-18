"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft, 
  Save, 
  Eye,
  Upload,
  X,
  EyeOff
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useNews } from '@/contexts/NewsContext'
import SuccessToast from '@/components/ui/SuccessToast'

interface NewsFormData {
  title: string
  titleEn: string
  category: string
  categoryEn: string
  description: string
  descriptionEn: string
  detailContent: string
  detailContentEn: string
  location: string
  locationEn: string
  participants: string
  participantsEn: string
  date: string
  image: string
  gradient: string
  // New fields
  views: number
  readingTime: number
  status: 'draft' | 'published' | 'completed'
  featured: boolean
  tags: string
  author: string
  authorEn: string
}

export default function EditNewsPage() {
  const router = useRouter()
  const params = useParams()
  const { newsItems, updateNews } = useNews()
  const [showLivePreview, setShowLivePreview] = useState(true)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    titleEn: '',
    category: '',
    categoryEn: '',
    description: '',
    descriptionEn: '',
    detailContent: '',
    detailContentEn: '',
    location: '',
    locationEn: '',
    participants: '',
    participantsEn: '',
    date: '',
    image: '',
    gradient: 'from-primary to-emerald-500',
    // New fields with default values
    views: 0,
    readingTime: 5,
    status: 'published',
    featured: false,
    tags: '',
    author: '',
    authorEn: ''
  })

  const gradientOptions = [
    { value: 'from-primary to-emerald-500', label: 'Xanh lá', preview: 'bg-gradient-to-r from-primary to-emerald-500' },
    { value: 'from-blue-500 to-cyan-500', label: 'Xanh dương', preview: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { value: 'from-purple-500 to-pink-500', label: 'Tím hồng', preview: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { value: 'from-amber-500 to-orange-500', label: 'Cam vàng', preview: 'bg-gradient-to-r from-amber-500 to-orange-500' },
    { value: 'from-green-600 to-lime-600', label: 'Xanh lime', preview: 'bg-gradient-to-r from-green-600 to-lime-600' },
    { value: 'from-emerald-500 to-teal-500', label: 'Xanh ngọc', preview: 'bg-gradient-to-r from-emerald-500 to-teal-500' },
  ]

  const categoryOptions = [
    { vi: 'Hội thảo', en: 'Conference' },
    { vi: 'Hoạt động', en: 'Activity' },
    { vi: 'Triển lãm', en: 'Exhibition' },
    { vi: 'Đào tạo', en: 'Training' },
    { vi: 'Hợp tác', en: 'Cooperation' },
    { vi: 'Nghiên cứu', en: 'Research' },
    { vi: 'Sự kiện', en: 'Event' },
  ]

  // Load existing news data
  useEffect(() => {
    const newsId = parseInt(params.id as string)
    const existingNews = newsItems.find(n => n.id === newsId)
    
    if (existingNews) {
      setFormData({
        title: existingNews.title,
        titleEn: existingNews.titleEn || '',
        category: existingNews.category,
        categoryEn: existingNews.categoryEn || '',
        description: existingNews.description,
        descriptionEn: existingNews.descriptionEn || '',
        detailContent: existingNews.detailContent,
        detailContentEn: existingNews.detailContentEn || '',
        location: existingNews.location || '',
        locationEn: existingNews.locationEn || '',
        participants: existingNews.participants || '',
        participantsEn: existingNews.participantsEn || '',
        date: existingNews.date,
        image: existingNews.image,
        gradient: existingNews.gradient || 'from-primary to-emerald-500',
        // New fields with defaults
        views: existingNews.views || 0,
        readingTime: existingNews.readingTime || 5,
        status: existingNews.status || 'published',
        featured: existingNews.featured || false,
        tags: Array.isArray(existingNews.tags) ? existingNews.tags.join(', ') : (existingNews.tags || ''),
        author: existingNews.author || '',
        authorEn: existingNews.authorEn || ''
      })
      setImagePreview(existingNews.image)
    }
    setLoading(false)
  }, [params.id, newsItems])

  const handleInputChange = (field: keyof NewsFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCategoryChange = (viCategory: string) => {
    const categoryPair = categoryOptions.find(cat => cat.vi === viCategory)
    setFormData(prev => ({
      ...prev,
      category: viCategory,
      categoryEn: categoryPair?.en || ''
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData(prev => ({
          ...prev,
          image: result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.category || !formData.description || !formData.detailContent) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Tiêu đề, Danh mục, Mô tả ngắn, Nội dung chi tiết)')
      return
    }

    try {
      const newsId = parseInt(params.id as string)
      
      // Update news in global state
      updateNews(newsId, {
        title: formData.title,
        titleEn: formData.titleEn || formData.title,
        image: formData.image || '/placeholder.svg',
        category: formData.category,
        categoryEn: formData.categoryEn || formData.category,
        date: formData.date || new Date().toLocaleDateString('vi-VN'),
        gradient: formData.gradient,
        location: formData.location,
        locationEn: formData.locationEn || formData.location,
        participants: formData.participants,
        participantsEn: formData.participantsEn || formData.participants,
        description: formData.description,
        descriptionEn: formData.descriptionEn || formData.description,
        detailContent: formData.detailContent,
        detailContentEn: formData.detailContentEn || formData.detailContent,
        // New fields
        views: formData.views,
        readingTime: formData.readingTime,
        status: formData.status,
        featured: formData.featured,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
        author: formData.author,
        authorEn: formData.authorEn || formData.author
      })
      
      setShowSuccessToast(true)
      setTimeout(() => {
        router.push('/admin/news')
      }, 1500)
    } catch (error) {
      console.error('Error updating news:', error)
      alert('Có lỗi xảy ra khi cập nhật tin tức')
    }
  }

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData)
    alert('Đã lưu nháp!')
  }

  // Live Preview Component
  const LivePreview = () => (
    <div className="sticky top-4">
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">🔍 Xem trước</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLivePreview(!showLivePreview)}
            >
              {showLivePreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        {showLivePreview && (
          <CardContent className="pt-0">
            <div className="space-y-4 max-h-[80vh] overflow-y-auto">
              {/* News Detail Page Preview - Exact Match */}
              <div className="bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 rounded-lg p-4">
                <div className="max-w-full">
                  <article className="space-y-6">
                    {/* Article Header */}
                    <header className="space-y-4">
                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {formData.category && (
                          <span className={`bg-gradient-to-r ${formData.gradient} text-white px-3 py-1 rounded-lg text-xs font-semibold`}>
                            {formData.category}
                          </span>
                        )}
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold border border-green-200">
                          <span className="inline-block w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                          Đã hoàn thành
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <span>📅</span>
                          <span>{formData.date || new Date().toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <span>👁️</span>
                          <span>1,234 lượt xem</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <span>⏱️</span>
                          <span>5 phút đọc</span>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h1 className="text-lg font-bold text-gray-900 leading-tight">
                        {formData.title || 'Tiêu đề tin tức sẽ hiển thị ở đây'}
                      </h1>
                      
                      {/* Event Info Cards */}
                      {(formData.location || formData.participants) && (
                        <div className="grid grid-cols-1 gap-2">
                          {formData.location && (
                            <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm border text-xs">
                              <div className="w-6 h-6 bg-gradient-to-r from-primary to-emerald-500 rounded-md flex items-center justify-center">
                                <span className="text-white text-xs">📍</span>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Địa điểm</p>
                                <p className="text-gray-900 font-semibold text-xs">{formData.location}</p>
                              </div>
                            </div>
                          )}
                          
                          {formData.participants && (
                            <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm border text-xs">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-md flex items-center justify-center">
                                <span className="text-white text-xs">👥</span>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Số lượng tham gia</p>
                                <p className="text-gray-900 font-semibold text-xs">{formData.participants}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </header>

                    {/* Featured Image */}
                    {imagePreview && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden shadow-md">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        {/* Event Completed Badge */}
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                          <span className="inline-block w-2 h-2 bg-white rounded-full mr-1"></span>
                          Đã hoàn thành
                        </div>
                      </div>
                    )}

                    {/* Article Content */}
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                      {/* Content Header */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-md flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <div>
                            <h2 className="text-sm font-bold text-gray-900">Báo Cáo Sự Kiện</h2>
                            <p className="text-xs text-gray-600">Tổng kết và kết quả của chương trình đã thực hiện</p>
                          </div>
                        </div>
                      </div>

                      {/* Main Content */}
                      <div className="p-3">
                        {/* Introduction */}
                        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-2 border-green-500">
                          <div className="flex items-start gap-2">
                            <span className="text-green-600 text-xs mt-0.5">✓</span>
                            <div>
                              <h3 className="text-xs font-semibold text-gray-900 mb-1">Chương trình đã hoàn thành thành công</h3>
                              <p className="text-xs text-gray-700 leading-relaxed">
                                {formData.description || 'Mô tả ngắn sẽ hiển thị ở đây...'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Main Content */}
                        <div className="text-xs text-gray-700 leading-relaxed space-y-3">
                          {formData.detailContent ? (
                            formData.detailContent.split('\n').map((paragraph, index) => {
                              if (paragraph.startsWith('•')) {
                                return (
                                  <div key={index} className="flex items-start gap-2 ml-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-white text-xs">✓</span>
                                    </div>
                                    <p className="text-xs text-gray-800 font-medium leading-relaxed">
                                      ✅ Đã {paragraph.substring(1).trim().toLowerCase()}
                                    </p>
                                  </div>
                                )
                              } else if (paragraph.trim() === '') {
                                return <div key={index} className="h-2" />
                              } else {
                                return (
                                  <p key={index} className="text-xs text-gray-700 leading-relaxed mb-2">
                                    {paragraph}
                                  </p>
                                )
                              }
                            })
                          ) : (
                            <p className="text-xs text-gray-500 italic">Nội dung chi tiết sẽ hiển thị ở đây...</p>
                          )}
                        </div>

                        {/* Program Results */}
                        <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                          <h3 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-1">
                            <span className="text-green-600">🏆</span>
                            Kết quả đạt được
                          </h3>
                          <div className="grid grid-cols-1 gap-2">
                            <div className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5"></div>
                              <p className="text-xs text-gray-700">Đã trao tặng 10,000 cuốn sách cho 50 trường học</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5"></div>
                              <p className="text-xs text-gray-700">Đã xây dựng 20 góc đọc sách tại các trường</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5"></div>
                              <p className="text-xs text-gray-700">Đã đào tạo 100 giáo viên về phương pháp khuyến đọc</p>
                            </div>
                          </div>
                        </div>

                        {/* Impact Section */}
                        <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                          <h3 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-1">
                            <span className="text-blue-600">💫</span>
                            Tác động tích cực
                          </h3>
                          <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="bg-white rounded-md p-2">
                              <div className="text-sm font-bold text-blue-600">200+</div>
                              <div className="text-xs text-gray-600">Trẻ em</div>
                            </div>
                            <div className="bg-white rounded-md p-2">
                              <div className="text-sm font-bold text-green-600">30</div>
                              <div className="text-xs text-gray-600">Tình nguyện viên</div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <div className="flex gap-2">
                            <button className="flex-1 bg-gradient-to-r from-primary to-emerald-500 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:shadow-md transition-all duration-200">
                              Đăng ký tham gia
                            </button>
                            <button className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                              Chia sẻ
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/admin/news">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa tin tức</h1>
            <p className="text-gray-600">Cập nhật thông tin và xem trước kết quả ngay lập tức</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="h-4 w-4 mr-2" />
            Lưu nháp
          </Button>
          <Button onClick={handleSubmit}>
            Cập nhật
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>📝 Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Tiêu đề (Tiếng Việt) *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Nhập tiêu đề tin tức"
                      required
                      className="font-medium"
                    />
                  </div>
                  <div>
                    <Label htmlFor="titleEn">Tiêu đề (English)</Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn}
                      onChange={(e) => handleInputChange('titleEn', e.target.value)}
                      placeholder="Enter news title in English"
                      className="font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Danh mục *</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {categoryOptions.map((option) => (
                        <option key={option.vi} value={option.vi}>{option.vi}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="date">Ngày đăng</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date ? new Date(formData.date.split('/').reverse().join('-')).toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const date = new Date(e.target.value)
                        handleInputChange('date', date.toLocaleDateString('vi-VN'))
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Địa điểm (Tiếng Việt)</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Ví dụ: Trung tâm Hội nghị Quốc gia, Hà Nội"
                    />
                  </div>
                  <div>
                    <Label htmlFor="locationEn">Địa điểm (English)</Label>
                    <Input
                      id="locationEn"
                      value={formData.locationEn}
                      onChange={(e) => handleInputChange('locationEn', e.target.value)}
                      placeholder="Example: National Convention Center, Hanoi"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="participants">Số lượng tham gia (Tiếng Việt)</Label>
                    <Input
                      id="participants"
                      value={formData.participants}
                      onChange={(e) => handleInputChange('participants', e.target.value)}
                      placeholder="Ví dụ: 250+ người tham gia"
                    />
                  </div>
                  <div>
                    <Label htmlFor="participantsEn">Số lượng tham gia (English)</Label>
                    <Input
                      id="participantsEn"
                      value={formData.participantsEn}
                      onChange={(e) => handleInputChange('participantsEn', e.target.value)}
                      placeholder="Example: 250+ participants"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>📄 Nội dung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="description">Mô tả ngắn (Tiếng Việt) *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Mô tả ngắn gọn về tin tức (hiển thị trên danh sách)"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="detailContent">Nội dung chi tiết (Tiếng Việt) *</Label>
                  <Textarea
                    id="detailContent"
                    value={formData.detailContent}
                    onChange={(e) => handleInputChange('detailContent', e.target.value)}
                    placeholder="Nội dung chi tiết của tin tức. Có thể sử dụng ký tự xuống dòng để tạo đoạn văn."
                    rows={8}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Mẹo: Sử dụng • để tạo danh sách, xuống dòng để tạo đoạn văn mới
                  </p>
                </div>

                <div>
                  <Label htmlFor="descriptionEn">Mô tả ngắn (English)</Label>
                  <Textarea
                    id="descriptionEn"
                    value={formData.descriptionEn}
                    onChange={(e) => handleInputChange('descriptionEn', e.target.value)}
                    placeholder="Brief description in English"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="detailContentEn">Nội dung chi tiết (English)</Label>
                  <Textarea
                    id="detailContentEn"
                    value={formData.detailContentEn}
                    onChange={(e) => handleInputChange('detailContentEn', e.target.value)}
                    placeholder="Detailed content in English"
                    rows={8}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Media & Settings */}
            <Card>
              <CardHeader>
                <CardTitle>🎨 Hình ảnh & Cài đặt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="image">Hình ảnh đại diện</Label>
                  <div className="mt-2">
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="flex items-center space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image')?.click()}
                        className="flex items-center"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {imagePreview ? 'Thay đổi hình ảnh' : 'Tải lên hình ảnh'}
                      </Button>
                      {imagePreview && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setImagePreview('')
                            setFormData(prev => ({ ...prev, image: '' }))
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Xóa
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="gradient">Màu sắc danh mục</Label>
                  <select
                    id="gradient"
                    value={formData.gradient}
                    onChange={(e) => handleInputChange('gradient', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {gradientOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {gradientOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`w-12 h-8 rounded-lg ${option.preview} cursor-pointer border-2 transition-all ${
                          formData.gradient === option.value ? 'border-gray-800 scale-110' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => handleInputChange('gradient', option.value)}
                        title={option.label}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Settings */}
            <Card>
              <CardHeader>
                <CardTitle>⚙️ Cài đặt bổ sung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author">Tác giả (Tiếng Việt)</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                      placeholder="Ví dụ: Ban Tổ chức"
                    />
                  </div>
                  <div>
                    <Label htmlFor="authorEn">Tác giả (English)</Label>
                    <Input
                      id="authorEn"
                      value={formData.authorEn}
                      onChange={(e) => handleInputChange('authorEn', e.target.value)}
                      placeholder="Example: Organizing Committee"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="readingTime">Thời gian đọc (phút)</Label>
                    <Input
                      id="readingTime"
                      type="number"
                      min="1"
                      max="60"
                      value={formData.readingTime}
                      onChange={(e) => handleInputChange('readingTime', e.target.value)}
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Trạng thái</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="draft">Nháp</option>
                      <option value="published">Đã xuất bản</option>
                      <option value="completed">Đã hoàn thành</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <input
                      id="featured"
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <Label htmlFor="featured" className="text-sm">Tin tức nổi bật</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Thẻ tag (phân cách bằng dấu phẩy)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="Ví dụ: văn hóa đọc, hội thảo, giáo dục"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Sử dụng dấu phẩy để phân cách các thẻ tag
                  </p>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Live Preview Section - 1/3 width */}
        <div className="lg:col-span-1">
          <LivePreview />
        </div>
      </div>

      <SuccessToast
        message="Cập nhật tin tức thành công!"
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
    </div>
  )
} 