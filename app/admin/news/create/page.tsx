"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  EyeOff,
  Plus,
  ImageIcon,
  ZoomIn,
  Cloud,
  CloudOff,
  CheckCircle,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useNews } from '@/contexts/NewsContext'
import { GalleryImage } from '@/lib/newsData'
import SuccessToast from '@/components/ui/SuccessToast'
import { compressImage, isImageTooBig } from '@/lib/imageUtils'

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
  gallery: GalleryImage[]
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

export default function CreateNewsPage() {
  const router = useRouter()
  const { 
    addNews, 
    wpSyncEnabled, 
    autoSyncEnabled, 
    lastSyncStatus 
  } = useNews()
  const [showLivePreview, setShowLivePreview] = useState(true)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
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
    gallery: [],
    gradient: 'from-primary to-emerald-500',
    // New fields with default values
    views: 0,
    readingTime: 5,
    status: 'published',
    featured: false,
    tags: '',
    author: 'Ban Tổ chức',
    authorEn: 'Organizing Committee'
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

  const handleInputChange = (field: keyof NewsFormData, value: string | number | boolean) => {
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const compressedImage = await compressImage(file, 800, 0.7)
        setImagePreview(compressedImage)
        setFormData(prev => ({
          ...prev,
          image: compressedImage
        }))
      } catch (error) {
        console.error('Error compressing image:', error)
        // Fallback to original method
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
  }

  // Gallery handlers
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const compressedImages = await Promise.all(
        Array.from(files).map(async (file, index) => {
          try {
            const compressedSrc = await compressImage(file, 600, 0.6) // Smaller for gallery
            return {
              id: `gallery-${Date.now()}-${index}`,
              src: compressedSrc,
              alt: `Gallery image ${formData.gallery.length + index + 1}`,
              caption: ''
            }
          } catch (error) {
            console.error('Error compressing gallery image:', error)
            // Fallback to original method
            return new Promise<GalleryImage>((resolve) => {
              const reader = new FileReader()
              reader.onload = (e) => {
                const result = e.target?.result as string
                resolve({
                  id: `gallery-${Date.now()}-${index}`,
                  src: result,
                  alt: `Gallery image ${formData.gallery.length + index + 1}`,
                  caption: ''
                })
              }
              reader.readAsDataURL(file)
            })
          }
        })
      )
      
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, ...compressedImages]
      }))
    }
  }

  const handleGalleryImageDelete = (imageId: string) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter(img => img.id !== imageId)
    }))
  }

  const handleGalleryImageCaptionChange = (imageId: string, caption: string) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.map(img => 
        img.id === imageId ? { ...img, caption } : img
      )
    }))
  }

  const handleGalleryImageClick = (imageSrc: string) => {
    setSelectedGalleryImage(imageSrc)
  }

  const closeGalleryModal = () => {
    setSelectedGalleryImage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.category || !formData.description || !formData.detailContent) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Tiêu đề, Danh mục, Mô tả ngắn, Nội dung chi tiết)')
      return
    }

    setIsSubmitting(true)

    try {
      // Add news to global state with auto WordPress sync
      const newNews = await addNews({
        title: formData.title,
        titleEn: formData.titleEn || formData.title,
        image: formData.image || '/placeholder.svg',
        gallery: formData.gallery,
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
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        author: formData.author,
        authorEn: formData.authorEn || formData.author
      })
      
      console.log('✅ Tin tức đã được lưu thành công!', newNews.wpId ? `(WordPress ID: ${newNews.wpId})` : '')
      setShowSuccessToast(true)
      
      setTimeout(() => {
        router.push('/admin/news')
      }, 2000)
    } catch (error) {
      console.error('Error creating news:', error)
      alert('Có lỗi xảy ra khi tạo tin tức. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
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
              {/* News Detail Page Preview - Updated Layout */}
              <div className="bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 rounded-lg p-4">
                <div className="max-w-full">
                  <article className="space-y-6">
                    {/* Article Header */}
                    <header className="space-y-4">
                      {/* Title */}
                      <h1 className="text-lg font-bold text-gray-900 leading-tight">
                        {formData.title || 'Tiêu đề tin tức sẽ hiển thị ở đây'}
                      </h1>

                      {/* Overview Information Card */}
                      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 border-b border-gray-100">
                          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <span className="text-blue-600 text-xs">ℹ️</span>
                            Thông Tin Tổng Quan
                          </h2>
                        </div>

                        <div className="p-3">
                          <div className="grid grid-cols-1 gap-3">
                            {/* Category */}
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
                                <span className="text-white text-xs">📚</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium">Danh mục</p>
                                {formData.category && (
                                  <span className={`inline-block bg-gradient-to-r ${formData.gradient} text-white px-2 py-1 rounded text-xs font-semibold`}>
                                    {formData.category}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-md flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium">Trạng thái</p>
                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${
                                  formData.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                                  formData.status === 'published' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                  'bg-yellow-100 text-yellow-800 border-yellow-200'
                                }`}>
                                  <span className="w-1 h-1 rounded-full bg-current"></span>
                                  {formData.status === 'completed' ? 'Đã hoàn thành' : 
                                   formData.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                                </div>
                              </div>
                            </div>

                            {/* Date */}
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-md flex items-center justify-center">
                                <span className="text-white text-xs">📅</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium">Ngày đăng</p>
                                <p className="text-xs text-gray-900 font-semibold">{formData.date || new Date().toLocaleDateString('vi-VN')}</p>
                              </div>
                            </div>

                            {/* Views */}
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-md flex items-center justify-center">
                                <span className="text-white text-xs">👁️</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium">Số lượt xem</p>
                                <p className="text-xs text-gray-900 font-semibold">{formData.views.toLocaleString()} lượt xem</p>
                              </div>
                            </div>

                            {/* Reading Time */}
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-green-500 rounded-md flex items-center justify-center">
                                <span className="text-white text-xs">⏱️</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium">Thời gian đọc</p>
                                <p className="text-xs text-gray-900 font-semibold">{formData.readingTime} phút</p>
                              </div>
                            </div>

                            {/* Location - Only show if exists */}
                            {formData.location && (
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-primary to-emerald-500 rounded-md flex items-center justify-center">
                                  <span className="text-white text-xs">📍</span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500 font-medium">Địa điểm tổ chức</p>
                                  <p className="text-xs text-gray-900 font-semibold">{formData.location}</p>
                                </div>
                              </div>
                            )}

                            {/* Participants - Only show if exists */}
                            {formData.participants && (
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md flex items-center justify-center">
                                  <span className="text-white text-xs">👥</span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500 font-medium">Số lượng tham gia</p>
                                  <p className="text-xs text-gray-900 font-semibold">{formData.participants}</p>
                                </div>
                              </div>
                            )}

                            {/* Author - Only show if exists */}
                            {formData.author && (
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-gray-500 to-gray-600 rounded-md flex items-center justify-center">
                                  <span className="text-white text-xs">👤</span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500 font-medium">Tác giả/Tổ chức</p>
                                  <p className="text-xs text-gray-900 font-semibold">{formData.author}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Tags - Full width at bottom */}
                          {formData.tags && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex flex-wrap items-center gap-1">
                                <span className="text-xs text-gray-500 font-medium">Tags:</span>
                                {formData.tags.split(',').map((tag, index) => (
                                  <span
                                    key={index}
                                    className="bg-gradient-to-r from-blue-50 to-indigo-50 px-2 py-1 rounded-full text-xs font-medium text-blue-700 border border-blue-200"
                                  >
                                    #{tag.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
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
                        {/* Event Status Badge - Dynamic */}
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold shadow-lg inline-flex items-center gap-1 ${
                          formData.status === 'completed' ? 'bg-green-500 text-white' :
                          formData.status === 'published' ? 'bg-blue-500 text-white' :
                          'bg-yellow-500 text-white'
                        }`}>
                          <span className="w-1 h-1 bg-white rounded-full"></span>
                          {formData.status === 'completed' ? 'Đã hoàn thành' : 
                           formData.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                        </div>
                      </div>
                    )}

                    {/* Gallery Preview */}
                    {formData.gallery.length > 0 && (
                      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md flex items-center justify-center">
                              <ImageIcon className="text-white text-xs" />
                            </div>
                            <div>
                              <h2 className="text-sm font-bold text-gray-900">Thư viện ảnh</h2>
                              <p className="text-xs text-gray-600">{formData.gallery.length} hình ảnh</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="grid grid-cols-2 gap-2">
                            {formData.gallery.slice(0, 4).map((image, index) => (
                              <div key={image.id} className="relative h-16 rounded overflow-hidden bg-gray-100">
                                <Image
                                  src={image.src}
                                  alt={image.alt}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute top-1 left-1 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
                                  {index + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                          {formData.gallery.length > 4 && (
                            <p className="text-xs text-gray-500 mt-2 text-center">
                              +{formData.gallery.length - 4} ảnh khác
                            </p>
                          )}
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
                            <h2 className="text-sm font-bold text-gray-900">Thông Tin Chi Tiết</h2>
                            <p className="text-xs text-gray-600">Nội dung và thông tin chi tiết về chương trình</p>
                          </div>
                        </div>
                      </div>

                      {/* Main Content */}
                      <div className="p-3">
                        {/* Description */}
                        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-2 border-green-500">
                          <div className="flex items-start gap-2">
                            <span className="text-green-600 text-xs mt-0.5">✓</span>
                            <div>
                              <h3 className="text-xs font-semibold text-gray-900 mb-1">Mô tả chương trình</h3>
                              <p className="text-xs text-gray-700 leading-relaxed">
                                {formData.description || 'Mô tả ngắn sẽ hiển thị ở đây...'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Detail Content */}
                        <div className="text-xs text-gray-700 leading-relaxed space-y-2">
                          {formData.detailContent ? (
                            formData.detailContent.split('\n').slice(0, 5).map((paragraph, index) => {
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
                                return <div key={index} className="h-1" />
                              } else {
                                return (
                                  <p key={index} className="text-xs text-gray-700 leading-relaxed">
                                    {paragraph}
                                  </p>
                                )
                              }
                            })
                          ) : (
                            <p className="text-xs text-gray-500 italic">Nội dung chi tiết sẽ hiển thị ở đây...</p>
                          )}
                          {formData.detailContent && formData.detailContent.split('\n').length > 5 && (
                            <p className="text-xs text-gray-500 italic">... và nhiều nội dung khác</p>
                          )}
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
            <h1 className="text-2xl font-bold text-gray-900">Tạo tin tức mới</h1>
            <p className="text-gray-600">Điền thông tin và xem trước kết quả ngay lập tức</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="h-4 w-4 mr-2" />
            Lưu nháp
          </Button>
          <Button 
            type="submit" 
            form="news-form"
            className="bg-primary hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                Đang lưu...
              </>
            ) : (
              'Xuất bản'
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <form id="news-form" onSubmit={handleSubmit} className="space-y-6">
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
              <CardContent className="space-y-6">
                {/* Main Image */}
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

                {/* Gallery Images */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Thư viện ảnh ({formData.gallery.length} ảnh)</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('gallery')?.click()}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Thêm ảnh
                    </Button>
                  </div>
                  
                  <input
                    id="gallery"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />

                  {/* Gallery Preview Grid */}
                  {formData.gallery.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.gallery.map((image, index) => (
                        <div key={image.id} className="relative group bg-gray-50 rounded-lg overflow-hidden">
                          <div className="relative h-32 w-full">
                            <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                              onClick={() => handleGalleryImageClick(image.src)}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleGalleryImageClick(image.src)}
                                  className="p-2"
                                >
                                  <ZoomIn className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleGalleryImageDelete(image.id)}
                                  className="p-2"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            {/* Image Number Badge */}
                            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold">
                              {index + 1}
                            </div>
                          </div>
                          
                          {/* Caption Input */}
                          <div className="p-2">
                            <input
                              type="text"
                              placeholder="Mô tả ảnh (tùy chọn)"
                              value={image.caption || ''}
                              onChange={(e) => handleGalleryImageCaptionChange(image.id, e.target.value)}
                              className="w-full text-xs px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm mb-2">Chưa có ảnh nào trong thư viện</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('gallery')?.click()}
                        className="flex items-center mx-auto"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Thêm ảnh đầu tiên
                      </Button>
                    </div>
                  )}
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
                      onChange={(e) => handleInputChange('readingTime', parseInt(e.target.value) || 0)}
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

            {/* WordPress Sync Status */}
            {(wpSyncEnabled || autoSyncEnabled) && (
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Cloud className="w-5 h-5" />
                    Trạng thái đồng bộ WordPress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-blue-700">Đồng bộ WordPress:</span>
                      {wpSyncEnabled ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Đã bật
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">
                          <CloudOff className="w-3 h-3" />
                          Đã tắt
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-blue-700">Tự động đồng bộ:</span>
                      {autoSyncEnabled ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                          <Zap className="w-3 h-3" />
                          Tự động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                          Thủ công
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {lastSyncStatus && (
                    <div className="bg-white p-3 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-700 mb-1">Trạng thái gần nhất:</p>
                      <p className="text-sm text-blue-600">{lastSyncStatus}</p>
                    </div>
                  )}
                  
                  {wpSyncEnabled && autoSyncEnabled && (
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        ✨ <strong>Tự động đồng bộ đã bật:</strong> Tin tức sẽ được tự động tạo trên WordPress sau khi lưu thành công.
                      </p>
                    </div>
                  )}
                  
                  {wpSyncEnabled && !autoSyncEnabled && (
                    <div className="bg-yellow-100 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        ⚠️ <strong>Đồng bộ thủ công:</strong> Bạn cần vào trang cài đặt WordPress để đồng bộ thủ công.
                      </p>
                    </div>
                  )}
                  
                  {!wpSyncEnabled && (
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        💡 <strong>Đồng bộ WordPress đã tắt:</strong> Vào trang cài đặt WordPress để bật tính năng đồng bộ.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </form>
        </div>

        {/* Live Preview Section - 1/3 width */}
        <div className="lg:col-span-1">
          <LivePreview />
        </div>
      </div>

      <SuccessToast
        message={`Tin tức "${formData.title}" đã được ${formData.status === 'published' ? 'xuất bản' : 'lưu'} thành công!`}
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />

      {/* Gallery Image Modal */}
      {selectedGalleryImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeGalleryModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={closeGalleryModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 bg-black/50 backdrop-blur-sm rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative w-full h-full">
              <Image
                src={selectedGalleryImage}
                alt="Gallery preview"
                fill
                className="object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}