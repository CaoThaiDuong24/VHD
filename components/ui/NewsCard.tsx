"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { NewsItem } from "@/lib/newsData"

interface NewsCardProps {
  item: NewsItem
}

export default function NewsCard({ item }: NewsCardProps) {
  const { language, t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  
  const title = language === 'vi' ? item.title : item.titleEn
  const category = language === 'vi' ? item.category : item.categoryEn
  const description = language === 'vi' ? item.description : item.descriptionEn
  
  const handleClick = () => {
    // Set navigation source based on current page
    if (typeof window !== 'undefined') {
      // Get current path from multiple sources for reliability
      const routerPath = pathname
      const windowPath = window.location.pathname
      const currentUrl = window.location.href
      
      console.log('NewsCard - Router pathname:', routerPath)
      console.log('NewsCard - Window pathname:', windowPath)
      console.log('NewsCard - Full URL:', currentUrl)
      
      // Improved detection logic - check for exact news page paths
      const isNewsPage = routerPath === '/news' || 
                        routerPath === '/news/' ||
                        windowPath === '/news' || 
                        windowPath === '/news/' ||
                        (currentUrl.includes('/news') && (currentUrl.endsWith('/news') || currentUrl.endsWith('/news/')))
      
      console.log('NewsCard - Is news page?', isNewsPage)
      
      if (isNewsPage) {
        console.log('NewsCard - Setting navigation source to: news-page')
        sessionStorage.setItem('newsNavigationSource', 'news-page')
      } else {
        console.log('NewsCard - Setting navigation source to: homepage')
        sessionStorage.setItem('newsNavigationSource', 'homepage')
      }
      
      // Verify what was actually set
      const stored = sessionStorage.getItem('newsNavigationSource')
      console.log('NewsCard - Final stored value:', stored)
    }
    
    router.push(`/news/${item.id}`)
  }
  
  return (
    <Card 
      onClick={handleClick}
      className="glass-card border-0 shadow-elegant hover:shadow-luxury transition-all duration-500 hover-lift group overflow-hidden cursor-pointer h-full"
    >
      <div className="relative overflow-hidden">
        <Image
          src={(item as any).featuredImage || (item as any).image || item.image || "/placeholder.jpg"}
          alt={title}
          width={400}
          height={250}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 right-4">
          <span
            className={`bg-gradient-to-r ${item.gradient} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-elegant whitespace-nowrap`}
          >
            {category}
          </span>
        </div>
        <div className="absolute top-4 left-4">
          <div className="glass-card px-3 py-1 rounded-full">
            <span className="text-gray-700 text-xs font-medium whitespace-nowrap">
              {t("news.new.badge")}
            </span>
          </div>
        </div>
      </div>
      <CardContent className="p-6 flex-1 flex flex-col">
        <h3 className="font-display text-gray-900 group-hover:text-primary transition-colors duration-300 text-lg lg:text-xl leading-tight mb-4 line-clamp-2 min-h-[3.5rem]">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed mb-4 font-body line-clamp-2 min-h-[3rem] flex-1">
          {description}
        </p>
        <div className="flex items-center justify-between text-sm mt-auto">
          <div className="flex items-center space-x-2 text-gray-500">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="whitespace-nowrap">{item.date}</span>
          </div>
          <div className="flex items-center space-x-1 text-primary font-semibold group-hover:text-primary/80 transition-colors duration-300 whitespace-nowrap">
                          <span>{t("news.read.more")}</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 