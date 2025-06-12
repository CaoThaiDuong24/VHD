"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight, BookOpen, TrendingUp } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import Image from "next/image"

export default function NewsSection() {
  const { t, language } = useLanguage()

  const newsItems = [
    {
      title: t("news.item1.title"),
      image: "/images/hoi_xuat_ban.png",
      category: t("category.conference"),
      date: "15/12/2024",
      gradient: "from-primary to-emerald-500",
    },
    {
      title: t("news.item2.title"),
      image: "/images/Le khanh thanh.jpg",
      category: t("category.activity"),
      date: "10/12/2024",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: t("news.item3.title"),
      image: "/images/modern-reading-space.jpg",
      category: t("category.exhibition"),
      date: "05/12/2024",
      gradient: "from-green-600 to-lime-600",
    },
    {
      title: t("news.item4.title"),
      image: "/images/modern-library/professional-reading-space.jpeg",
      category: t("category.training"),
      date: "01/12/2024",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      title: t("news.item5.title"),
      image: "/images/Gap go.jpg",
      category: t("category.cooperation"),
      date: "28/11/2024",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: t("news.item6.title"),
      image: "/images/van_hoa_doc_sach.jpg",
      category: t("category.research"),
      date: "25/11/2024",
      gradient: "from-purple-500 to-pink-500",
    },
  ]

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
            <span className="block whitespace-nowrap">{t("news.title")}</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-emerald-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-body">
            {t("news.discover.activities")}
          </p>
        </div>

        {/* Premium News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {newsItems.map((item, index) => (
            <Card
              key={index}
              className="glass-card border-0 shadow-elegant hover:shadow-luxury transition-all duration-500 hover-lift group overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  width={400}
                  height={250}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4">
                  <span
                    className={`bg-gradient-to-r ${item.gradient} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-elegant whitespace-nowrap`}
                  >
                    {item.category}
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <div className="glass-card px-3 py-1 rounded-full">
                    <span className="text-gray-700 text-xs font-medium whitespace-nowrap">{t("news.new.badge")}</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-display text-gray-900 group-hover:text-primary transition-colors duration-300 text-lg lg:text-xl leading-tight mb-4 line-clamp-2 min-h-[3.5rem]">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4 font-body line-clamp-2 min-h-[3rem]">
                  {t("news.description")}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">{item.date}</span>
                  </div>
                  <span className="text-primary font-semibold group-hover:text-primary/80 transition-colors duration-300 whitespace-nowrap">
                    {t("news.readmore")}
                  </span>
                </div>
              </CardContent>
            </Card>
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
            <Button className="btn-primary px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg rounded-xl font-semibold shadow-elegant hover:shadow-luxury transition-all duration-300 group whitespace-nowrap">
              {t("news.cta.button")}
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
