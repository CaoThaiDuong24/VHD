"use client"

import { useParams, useRouter } from 'next/navigation'
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

export default function NewsDetailPage() {
  const params = useParams()
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

              {/* Content Section - Enhanced */}
              <section className="space-y-8 animate-slide-up">
                <div className="bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-sm border border-white/40 rounded-3xl p-8 lg:p-12 shadow-2xl">
                  <div className="prose prose-lg prose-gray max-w-none">
                    {detailContent.split('\n').map((paragraph, index) => {
                      if (paragraph.startsWith('•')) {
                        return (
                          <li key={index} className="text-gray-700 leading-relaxed mb-3 ml-4 relative before:content-[''] before:absolute before:left-[-16px] before:top-[12px] before:w-2 before:h-2 before:bg-primary before:rounded-full">
                            {paragraph.substring(1).trim()}
                          </li>
                        )
                      } else if (paragraph.trim() === '') {
                        return <div key={index} className="h-4" />
                      } else if (paragraph.includes('•')) {
                        return (
                          <div key={index} className="my-8">
                            <h3 className="text-2xl font-display font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gradient-to-r from-primary to-emerald-500">
                              {paragraph.split('•')[0]}
                            </h3>
                            <ul className="space-y-4">
                              {paragraph.split('•').slice(1).map((item, itemIndex) => (
                                <li key={itemIndex} className="text-gray-700 leading-relaxed flex items-start gap-4 p-4 bg-gradient-to-r from-primary/5 to-emerald-500/5 rounded-xl border border-primary/10">
                                  <div className="w-6 h-6 bg-gradient-to-r from-primary to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">✓</span>
                                  </div>
                                  <span className="text-gray-800 font-medium">{item.trim()}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      } else {
                        return (
                          <p key={index} className="text-gray-700 leading-relaxed mb-6 text-lg font-body first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                            {paragraph}
                          </p>
                        )
                      }
                    })}
                  </div>
                </div>
              </section>

              {/* Call to Action Section - Enhanced */}
              <section className="animate-slide-up">
                <div className="relative bg-gradient-to-br from-primary/10 via-white/50 to-emerald-500/10 backdrop-blur-sm border border-white/40 rounded-3xl p-8 lg:p-12 shadow-2xl overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%235D9C59' fillOpacity='0.3'%3E%3Ccircle cx='30' cy='30' r='15'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      }}
                    ></div>
                  </div>
                  
                  <div className="relative text-center space-y-8">
                    <div className="space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-r from-primary to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-luxury">
                        <BookOpen className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-3xl lg:text-4xl font-display font-bold text-gray-900">
                        {language === 'vi' ? 'Quan tâm đến sự kiện này?' : 'Interested in this event?'}
                      </h3>
                      <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        {language === 'vi' 
                          ? 'Tham gia cùng chúng tôi để trải nghiệm những hoạt động thú vị và bổ ích, kết nối với cộng đồng yêu thích văn hóa đọc'
                          : 'Join us to experience exciting and rewarding activities, connect with the reading culture community'
                        }
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                      <Button 
                        onClick={handleRegistrationClick}
                        className="btn-primary px-8 py-4 text-lg font-semibold shadow-luxury hover:shadow-2xl transition-all duration-300 group transform hover:scale-105 flex-1"
                      >
                        <BookOpen className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                        {language === 'vi' ? 'Đăng ký ngay' : 'Register Now'}
                      </Button>
                      
                      <div className="flex gap-3">
                        <Button variant="outline" className="px-6 py-4 text-lg font-semibold border-2 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group shadow-elegant">
                          <Share2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                        </Button>
                        <Button variant="outline" className="px-6 py-4 text-lg font-semibold border-2 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group shadow-elegant">
                          <FileDown className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Related News Section - Enhanced */}
              <section className="mt-20 pt-16 border-t border-gray-200 animate-slide-up">
                <div className="text-center space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-3xl lg:text-4xl font-display font-bold text-gray-900">
                      {language === 'vi' ? 'Khám phá thêm' : 'Explore More'}
                    </h3>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                      {language === 'vi' ? 'Cập nhật những tin tức và sự kiện mới nhất từ RCP' : 'Stay updated with the latest news and events from RCP'}
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <Link href="/news" className="flex-1">
                      <Button variant="outline" className="w-full px-8 py-4 text-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300 shadow-elegant hover:shadow-luxury transform hover:scale-105">
                        {language === 'vi' ? 'Tất cả tin tức' : 'All News'}
                      </Button>
                    </Link>
                    <Link href="/events" className="flex-1">
                      <Button variant="outline" className="w-full px-8 py-4 text-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300 shadow-elegant hover:shadow-luxury transform hover:scale-105">
                        {language === 'vi' ? 'Sự kiện' : 'Events'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </section>
            </article>
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Registration Modal */}
      <RegistrationModal 
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        eventTitle={title}
      />
    </div>
  )
} 