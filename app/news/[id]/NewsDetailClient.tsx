"use client"

import { useRouter } from 'next/navigation'
import { useNews } from '@/contexts/NewsContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { GalleryImage } from '@/lib/newsData'
import ModernHeader from '@/components/layout/ModernHeader'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import { Calendar, MapPin, Users, ArrowLeft, BookOpen, CheckCircle, ImageIcon, ZoomIn, UserCheck, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import RegistrationModal from '@/components/ui/RegistrationModal'

interface NewsDetailClientProps {
  params: { id: string }
}

export default function NewsDetailClient({ params }: NewsDetailClientProps) {
  const router = useRouter()
  const { getNewsById, newsItems } = useNews()
  const { t, language } = useLanguage()
  const [backUrl, setBackUrl] = useState('/#news')
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  const newsId = parseInt(params.id as string)
  const newsItem = getNewsById(newsId)

  // Debug logging
  console.log('NewsDetailClient - Params ID:', params.id)
  console.log('NewsDetailClient - Parsed ID:', newsId)
  console.log('NewsDetailClient - All news items:', newsItems)
  console.log('NewsDetailClient - Found news item:', newsItem)

  // Sample gallery images - In real app this would come from newsData
  const relatedImages: GalleryImage[] = newsItem?.gallery || [
    {
      id: `${newsItem?.id || 'default'}-gallery-1-${Date.now()}`,
      src: '/images/hoi_xuat_ban.png',
      alt: language === 'vi' ? 'Hội thảo phát triển văn hóa đọc' : 'Reading culture development conference',
      caption: language === 'vi' ? 'Toàn cảnh hội trường với sự tham gia của hơn 250 chuyên gia' : 'Conference hall with over 250 experts participating'
    },
    {
      id: `${newsItem?.id || 'default'}-gallery-2-${Date.now()}`, 
      src: '/images/hoi_xuat_ban.png',
      alt: language === 'vi' ? 'Diễn giả chính trình bày' : 'Main speaker presenting',
      caption: language === 'vi' ? 'Các chuyên gia chia sẻ kinh nghiệm phát triển văn hóa đọc' : 'Experts sharing experience in developing reading culture'
    },
    {
      id: `${newsItem?.id || 'default'}-gallery-3-${Date.now()}`,
      src: '/images/hoi_xuat_ban.png', 
      alt: language === 'vi' ? 'Thảo luận nhóm' : 'Group discussion',
      caption: language === 'vi' ? 'Các nhóm thảo luận về giải pháp khuyến khích đọc sách' : 'Groups discussing solutions to encourage reading'
    },
    {
      id: `${newsItem?.id || 'default'}-gallery-4-${Date.now()}`,
      src: '/images/hoi_xuat_ban.png',
      alt: language === 'vi' ? 'Triển lãm sách' : 'Book exhibition',
      caption: language === 'vi' ? 'Khu vực triển lãm các ấn phẩm mới nhất' : 'Exhibition area for latest publications'
    }
  ]

  // Determine back URL based on navigation source
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const navigationSource = sessionStorage.getItem('newsNavigationSource')
      console.log('NewsDetail - Navigation source from sessionStorage:', navigationSource)
      
      if (navigationSource === 'news-page') {
        console.log('NewsDetail - Setting back URL to /news')
        setBackUrl('/news')
      } else if (navigationSource === 'homepage') {
        console.log('NewsDetail - Setting back URL to /#news')
        setBackUrl('/#news')
      } else {
        // Fallback: check referrer
        const referrer = document.referrer
        console.log('NewsDetail - No navigation source, checking referrer:', referrer)
        
        if (referrer.includes('/news') && !referrer.includes('/news/')) {
          console.log('NewsDetail - Referrer is news page, setting back URL to /news')
          setBackUrl('/news')
        } else {
          console.log('NewsDetail - Default: setting back URL to /#news')
          setBackUrl('/#news')
        }
      }
      
      console.log('NewsDetail - Final backUrl state will be:', navigationSource === 'news-page' ? '/news' : '/#news')
    }
  }, [])

  const handleBackClick = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('newsNavigationSource')
    }
    
    if (backUrl === '/news') {
      router.push('/news')
    } else {
      router.push('/#news')
    }
  }



  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc)
  }

  const closeImageModal = () => {
    setSelectedImage(null)
  }

  if (!newsItem) {
    notFound()
  }

  const title = language === 'vi' ? newsItem.title : newsItem.titleEn
  const category = language === 'vi' ? newsItem.category : newsItem.categoryEn
  const location = language === 'vi' ? newsItem.location : newsItem.locationEn
  const participants = language === 'vi' ? newsItem.participants : newsItem.participantsEn
  const detailContent = language === 'vi' ? newsItem.detailContent : newsItem.detailContentEn

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20">
      <ModernHeader />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button 
              onClick={handleBackClick}
              variant="outline" 
              className="hover:bg-primary hover:text-white transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backUrl === '/news' 
                ? t('news.detail.back.list')
                : t('news.detail.back.home')
              }
            </Button>
          </div>

          <div className="max-w-6xl mx-auto">
            <article className="space-y-8">
              {/* Article Header */}
              <header className="space-y-6">
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {title}
                </h1>

                {/* Overview Information Card - Beautiful Design */}
                <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden backdrop-blur-sm">
                  <div className="p-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Category */}
                      <div className="group text-center transform hover:scale-105 transition-all duration-300">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-purple-200 transition-all duration-300">
                            <BookOpen className="h-5 w-5 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-75 animate-pulse"></div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Danh mục</p>
                          <span className={`inline-block bg-gradient-to-r ${newsItem.gradient} text-white px-3 py-1.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300`}>
                            {category}
                          </span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="group text-center transform hover:scale-105 transition-all duration-300">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-green-600 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-green-200 transition-all duration-300">
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full opacity-75 animate-pulse"></div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Trạng thái</p>
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 ${
                            newsItem.status === 'completed' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' :
                            newsItem.status === 'published' ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200' :
                            'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200'
                          }`}>
                            <CheckCircle className="h-3 w-3" />
                            <span>
                                              {newsItem.status === 'completed' ? t("news.detail.completed") :
                newsItem.status === 'published' ? t("news.detail.published") :
                t("news.detail.draft")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="group text-center transform hover:scale-105 transition-all duration-300">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
                            <Calendar className="h-5 w-5 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-75 animate-pulse"></div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ngày đăng</p>
                          <p className="text-sm font-bold text-gray-900 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm">{newsItem.date}</p>
                        </div>
                      </div>

                      {/* Views */}
                      <div className="group text-center transform hover:scale-105 transition-all duration-300">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-orange-200 transition-all duration-300">
                            <Eye className="h-5 w-5 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-400 to-orange-400 rounded-full opacity-75 animate-pulse"></div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Lượt xem</p>
                          <p className="text-sm font-bold text-gray-900 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm">{(newsItem.views || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Event Information Row */}
                    {(location || participants || newsItem.author) && (
                      <div className="mt-8 pt-6 border-t border-gradient-to-r from-gray-200 via-gray-100 to-gray-200">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          {/* Location */}
                          {location && (
                            <div className="group text-center transform hover:scale-105 transition-all duration-300">
                              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100/50">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary via-emerald-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                                  <MapPin className="h-4 w-4 text-white" />
                                </div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Địa điểm</p>
                                <p className="text-sm font-semibold text-gray-800 leading-tight">{location}</p>
                              </div>
                            </div>
                          )}

                          {/* Participants */}
                          {participants && (
                            <div className="group text-center transform hover:scale-105 transition-all duration-300">
                              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100/50">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                                  <Users className="h-4 w-4 text-white" />
                                </div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Tham gia</p>
                                <p className="text-sm font-semibold text-gray-800 leading-tight">{participants}</p>
                              </div>
                            </div>
                          )}

                          {/* Author */}
                          {newsItem.author && (
                            <div className="group text-center transform hover:scale-105 transition-all duration-300">
                              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100/50">
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-500 via-gray-600 to-slate-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                                  <UserCheck className="h-4 w-4 text-white" />
                                </div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Tác giả</p>
                                <p className="text-sm font-semibold text-gray-800 leading-tight">{language === 'vi' ? newsItem.author : (newsItem.authorEn || newsItem.author)}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tags Section */}
                    {newsItem.tags && newsItem.tags.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-gradient-to-r from-gray-200 via-gray-100 to-gray-200">
                        <div className="text-center">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">Từ khóa</p>
                          <div className="flex flex-wrap items-center gap-2 justify-center">
                            {(Array.isArray(newsItem.tags) ? newsItem.tags : (newsItem.tags as string).split(',')).map((tag: string, index: number) => (
                              <span
                                key={`tag-${newsItem.id}-${index}-${tag.trim()}`}
                                className="group inline-flex items-center gap-1 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 hover:from-blue-100 hover:via-indigo-100 hover:to-purple-100 px-4 py-2 rounded-full text-xs font-medium text-blue-700 border border-blue-200/50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
                              >
                                <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={newsItem.image || "/placeholder.svg"}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Event Status Badge - Dynamic */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold shadow-lg inline-flex items-center gap-1 ${
                  newsItem.status === 'completed' ? 'bg-green-500 text-white' :
                  newsItem.status === 'published' ? 'bg-blue-500 text-white' :
                  'bg-yellow-500 text-white'
                }`}>
                  <CheckCircle className="h-4 w-4" />
                  {newsItem.status === 'completed' ? t("news.detail.completed") : 
                   newsItem.status === 'published' ? t("news.detail.published") : 
                   t("news.detail.draft")}
                </div>
              </div>

              {/* Article Content - Simplified */}
              <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
                {/* Main Content */}
                <div className="p-8">
                  <div className="prose prose-lg max-w-none">
                    {/* Main Content */}
                    <div className="text-gray-700 leading-relaxed space-y-6">
                      {detailContent.split('\n').map((paragraph, index) => {
                        if (paragraph.startsWith('•')) {
                          return (
                            <li key={`paragraph-${newsItem.id}-${index}`} className="text-gray-700 leading-relaxed mb-3 ml-4 relative before:content-['•'] before:absolute before:left-[-16px] before:text-primary before:font-bold">
                              {paragraph.substring(1).trim()}
                            </li>
                          )
                        } else if (paragraph.trim() === '') {
                          return <div key={`empty-${newsItem.id}-${index}`} className="h-4" />
                        } else if (paragraph.includes('•')) {
                          return (
                            <div key={`list-${newsItem.id}-${index}`} className="my-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
                              <div className="grid gap-4">
                                {paragraph.split('•').slice(1).map((item, itemIndex) => (
                                  <div key={`item-${newsItem.id}-${index}-${itemIndex}`} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200">
                                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <CheckCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                      <p className="text-gray-800 font-medium leading-relaxed">
                                        {item.trim()}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        } else {
                          return (
                            <p key={`text-${newsItem.id}-${index}`} className="text-gray-700 leading-relaxed mb-6 text-lg first-letter:text-2xl first-letter:font-bold first-letter:text-green-600 first-letter:mr-1">
                              {paragraph}
                            </p>
                          )
                        }
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>

      {/* Image Gallery Section - Separate */}
      {relatedImages && relatedImages.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-slate-50 to-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {/* Gallery Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl mb-6 shadow-lg">
                  <ImageIcon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {t("news.detail.event.gallery")}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t("news.detail.gallery.description").replace('{count}', relatedImages.length.toString())}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Eye className="h-4 w-4" />
                  <span>{t("news.detail.gallery.click.hint")}</span>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {relatedImages.map((image, index) => (
                  <div 
                    key={`gallery-${newsItem.id}-${image.id || index}`} 
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105"
                    onClick={() => handleImageClick(image.src)}
                  >
                    <div className="relative h-64 w-full">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 bg-white/95 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 shadow-xl">
                          <ZoomIn className="h-6 w-6 text-gray-700" />
                        </div>
                      </div>
                      {/* Image Number Badge */}
                      <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-xl text-sm font-semibold">
                        {index + 1}/{relatedImages.length}
                      </div>
                      {/* Featured Badge for first image */}
                      {index === 0 && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                          ✨ {t("news.detail.featured")}
                        </div>
                      )}
                    </div>
                    {image.caption && (
                      <div className="p-4">
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 group-hover:text-gray-800 transition-colors">
                          {image.caption}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Gallery Stats */}
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-8 bg-white rounded-2xl px-8 py-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {relatedImages.length} {t("news.detail.gallery.stats.photos")}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {t("news.detail.high.resolution")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
      
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={closeImageModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 bg-black/50 backdrop-blur-sm rounded-full p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Gallery image"
                fill
                className="object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
      
      <RegistrationModal 
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />
    </div>
  )
} 