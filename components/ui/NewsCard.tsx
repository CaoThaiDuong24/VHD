"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

interface NewsItem {
  id: number
  title: string
  titleEn: string
  category: string
  categoryEn: string
  description: string
  descriptionEn: string
  image: string
  date: string
  gradient: string
}

interface NewsCardProps {
  item: NewsItem
}

export default function NewsCard({ item }: NewsCardProps) {
  const { t, language } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  
  const title = language === 'vi' ? item.title : item.titleEn
  const category = language === 'vi' ? item.category : item.categoryEn
  const description = language === 'vi' ? item.description : item.descriptionEn
  
  const handleClick = () => {
    // Set navigation source based on current page
    if (typeof window !== 'undefined') {
      if (pathname === '/news') {
        sessionStorage.setItem('newsNavigationSource', 'news-page')
      } else if (pathname === '/') {
        sessionStorage.setItem('newsNavigationSource', 'homepage')
      } else {
        // For any other page, default to homepage
        sessionStorage.setItem('newsNavigationSource', 'homepage')
      }
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
          src={item.image || "/placeholder.svg"}
          alt={title}
          width={400}
          height={250}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
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
              {language === 'vi' ? 'Mới' : 'New'}
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
            <span>{language === 'vi' ? 'Đọc thêm' : 'Read more'}</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 