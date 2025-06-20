"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, TrendingUp, Calendar } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useNews } from "@/contexts/NewsContext"
import NewsCard from "@/components/ui/NewsCard"
import Link from "next/link"

export default function NewsSection() {
  const { t, language } = useLanguage()
  const { newsItems } = useNews()
  
  // Show only the first 6 news items on homepage, sorted by newest first
  const displayedNews = newsItems
    .sort((a, b) => b.id - a.id) // Sort by ID descending (newest first)
    .slice(0, 6)

  return (
    <section
      id="news"
      className="py-24 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%235D9C59' fillOpacity='0.1'%3E%3Cpath d='M30 30m-20 0a20,20 0 1,1 40,0a20,20 0 1,1 -40,0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative">
        {/* Premium Header */}
        <div className="text-center mb-20 animate-slide-up">
          <div className="inline-flex items-center glass-card px-6 py-3 rounded-full mb-8 shadow-elegant">
            <TrendingUp className="w-5 h-5 mr-3 text-primary flex-shrink-0" />
            <span className="text-primary font-semibold whitespace-nowrap">{t("news.badge")}</span>
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-display text-gray-900 mb-6 leading-tight">
            {t("news.title")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-emerald-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg lg:text-xl text-gray-600 max-w-5xl mx-auto leading-relaxed font-body whitespace-nowrap">
            {t("news.discover.activities")}
          </p>
        </div>

        {/* Premium News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {displayedNews.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>

        {/* Premium CTA Section */}
        <div className="text-center">
          <div className="glass-card rounded-3xl p-8 lg:p-12 shadow-luxury border border-white/20 bg-gradient-to-br from-white/80 to-emerald-50/50 max-w-4xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-luxury">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl lg:text-2xl font-display text-gray-900 mb-4">{t("news.cta.description")}</h3>
            <p className="text-base lg:text-lg text-gray-600 mb-8 font-body leading-relaxed">
              {t("news.subscribe.info")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link href="/news" className="flex-1">
                <Button className="w-full btn-primary px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg rounded-xl font-semibold shadow-elegant hover:shadow-luxury transition-all duration-300 group whitespace-nowrap">
                  {t("news.cta.button")}
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                </Button>
              </Link>
              <Link href="/events" className="flex-1">
                <Button variant="outline" className="w-full px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg rounded-xl font-semibold border-2 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group shadow-elegant hover:shadow-luxury whitespace-nowrap">
                  <Calendar className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                                      {t("nav.events")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
