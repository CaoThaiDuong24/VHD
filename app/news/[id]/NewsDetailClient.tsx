"use client"

import { useRouter } from 'next/navigation'
import { getNewsById } from '@/lib/newsData'
import { useLanguage } from '@/contexts/LanguageContext'
import ModernHeader from '@/components/layout/ModernHeader'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import { Calendar, MapPin, Users, ArrowLeft, Share2, BookOpen, Clock, Eye, Heart, MessageCircle, Bookmark, Download, FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'
import RegistrationModal from '@/components/ui/RegistrationModal'

interface NewsDetailClientProps {
  params: { id: string }
}

export default function NewsDetailClient({ params }: NewsDetailClientProps) {
  const router = useRouter()
  const { t, language } = useLanguage()
  const [backUrl, setBackUrl] = useState('/#news')
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)
  
  const newsId = parseInt(params.id as string)
  const newsItem = getNewsById(newsId)

  // Determine back URL based on navigation source
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if we have stored navigation source
      const navigationSource = sessionStorage.getItem('newsNavigationSource')
      
      if (navigationSource === 'news-page') {
        setBackUrl('/news')
      } else if (navigationSource === 'homepage') {
        setBackUrl('/#news')
      } else {
        // Default fallback - check referrer as backup
        const referrer = document.referrer
        if (referrer.includes('/news') && !referrer.includes('/news/')) {
          setBackUrl('/news')
        } else {
          setBackUrl('/#news')
        }
      }
    }
  }, [])

  const handleBackClick = () => {
    // Clear the navigation source when navigating back
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('newsNavigationSource')
    }
    
    if (backUrl === '/news') {
      router.push('/news')
    } else {
      router.push('/#news')
    }
  }

  const handleRegistrationClick = () => {
    setIsRegistrationModalOpen(true)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%235D9C59' fillOpacity='0.1'%3E%3Cpath d='M40 40m-20 0a20,20 0 1,1 40,0a20,20 0 1,1 -40,0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <ModernHeader />
      
      <main className="pt-24 pb-16 relative">
        <div className="container mx-auto px-6">
          {/* Back Button - Enhanced */}
          <div className="mb-12 animate-slide-up">
            <Button 
              onClick={handleBackClick}
              variant="outline" 
              className="group hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-elegant hover:shadow-luxury"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              {backUrl === '/news' 
                ? (language === 'vi' ? 'Quay lại danh sách tin tức' : 'Back to News List')
                : (language === 'vi' ? 'Quay lại trang chủ' : 'Back to Home')
              }
            </Button>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Article Header - Enhanced */}
            <article className="space-y-8">
              <header className="space-y-8 animate-slide-up">
                {/* Category & Meta Info */}
                <div className="flex flex-wrap items-center gap-4">
                  <span className={`bg-gradient-to-r ${newsItem.gradient} text-white px-6 py-3 rounded-full text-sm font-semibold shadow-luxury hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                    {category}
                  </span>
                  <div className="flex items-center gap-6 text-gray-600">
                    <div className="flex items-center gap-2 text-sm bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">{newsItem.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full">
                      <Eye className="h-4 w-4 text-primary" />
                      <span className="font-medium">1,234 {language === 'vi' ? 'lượt xem' : 'views'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Title */}
                <div className="space-y-6">
                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-display text-gray-900 leading-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text">
                    {title}
                  </h1>
                  
                  {/* Enhanced Meta Information */}
                  <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 shadow-elegant">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">{language === 'vi' ? 'Địa điểm' : 'Location'}</p>
                          <p className="text-gray-900 font-semibold">{location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">{language === 'vi' ? 'Tham gia' : 'Participants'}</p>
                          <p className="text-gray-900 font-semibold">{participants}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">{language === 'vi' ? 'Thời gian đọc' : 'Reading time'}</p>
                          <p className="text-gray-900 font-semibold">{language === 'vi' ? '5 phút' : '5 minutes'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              {/* Featured Image - Enhanced */}
              <div className="relative group animate-slide-up">
                <div className="relative w-full h-80 md:h-96 lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src={newsItem.image || "/placeholder.svg"}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60"></div>
                  
                  {/* Image Overlay Actions */}
                  <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300">
                      <Bookmark className="h-5 w-5 text-white" />
                    </button>
                    <button className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300">
                      <Download className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
                
                {/* Social Stats */}
                <div className="absolute bottom-6 left-6 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2">
                    <Heart className="h-4 w-4 text-white" />
                    <span className="text-white text-sm font-medium">245</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2">
                    <MessageCircle className="h-4 w-4 text-white" />
                    <span className="text-white text-sm font-medium">18</span>
                  </div>
                </div>
              </div>

              {/* Article Content - Enhanced */}
              <div className="prose prose-lg max-w-none animate-slide-up">
                <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-3xl p-8 lg:p-12 shadow-elegant">
                  <div className="space-y-8">
                    {/* Content */}
                    <div className="text-gray-700 leading-relaxed text-lg space-y-6">
                      {detailContent.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-200">
                      <Button 
                        onClick={handleRegistrationClick}
                        className="bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 text-white px-8 py-3 rounded-full shadow-luxury hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <BookOpen className="h-5 w-5 mr-2" />
                        {language === 'vi' ? 'Đăng ký tham gia' : 'Register to Join'}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-full transition-all duration-300 shadow-elegant hover:shadow-luxury"
                      >
                        <Share2 className="h-5 w-5 mr-2" />
                        {language === 'vi' ? 'Chia sẻ' : 'Share'}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-3 rounded-full transition-all duration-300 shadow-elegant hover:shadow-luxury"
                      >
                        <FileDown className="h-5 w-5 mr-2" />
                        {language === 'vi' ? 'Tải tài liệu' : 'Download Materials'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Articles Section */}
              <div className="mt-16 animate-slide-up">
                <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-3xl p-8 shadow-elegant">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                    {language === 'vi' ? 'Tin tức liên quan' : 'Related News'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Related articles would be dynamically loaded here */}
                    <div className="text-center text-gray-500 col-span-full py-8">
                      {language === 'vi' ? 'Đang cập nhật...' : 'Coming soon...'}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer />
      
      <RegistrationModal 
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />
    </div>
  )
} 