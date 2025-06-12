"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Quote, Award, Users } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import Image from "next/image"

export default function DirectorMessage() {
  const { t, language } = useLanguage()

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 relative overflow-hidden">
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
            <Award className="w-5 h-5 mr-3 text-primary flex-shrink-0" />
            <span className="text-primary font-semibold">{t("director.badge")}</span>
          </div>
          <h2
            className={`font-display text-gray-900 mb-6 leading-tight ${
              language === "en" ? "text-3xl lg:text-4xl xl:text-5xl" : "text-4xl lg:text-5xl"
            }`}
          >
            {t("director.title")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-emerald-500 mx-auto rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-16 items-center">
            {/* Director Image */}
            <div className="lg:col-span-1 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-emerald-600/20 rounded-3xl blur-2xl"></div>
                <Image
                  src="/images/LanhDao.png"
                  alt="Ông Nguyễn Thanh Hân - Giám đốc Trung tâm Phát triển Văn hóa đọc và Kinh tế Xuất bản"
                  width={400}
                  height={500}
                  className="relative rounded-3xl shadow-premium object-cover w-full h-[400px] lg:h-[500px] hover-lift"
                />

                {/* Floating Achievement Badge */}
                <div className="absolute -bottom-6 -right-6 glass-card p-4 rounded-2xl shadow-luxury border border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-display gradient-text-primary mb-1">CEO</div>
                    <div className="text-xs text-gray-600 font-medium whitespace-nowrap">RCP Leader</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="lg:col-span-2 animate-slide-up">
              <Card className="glass-card border-0 shadow-luxury bg-gradient-to-br from-white/80 to-emerald-50/50">
                <CardContent className="p-8 lg:p-10 xl:p-12">
                  <div className="relative">
                    {/* Quote Icon - Fixed positioning */}
                    <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-r from-primary to-emerald-500 rounded-2xl flex items-center justify-center shadow-luxury z-10">
                      <Quote className="h-8 w-8 text-white" />
                    </div>

                    {/* Quote Content - Added proper padding to avoid overlap */}
                    <div className="pt-8 pl-8">
                      <blockquote
                        className={`text-gray-700 leading-relaxed italic font-display mb-8 lg:mb-10 ${
                          language === "en" ? "text-lg lg:text-xl" : "text-xl lg:text-2xl"
                        }`}
                      >
                        {t("director.quote")}
                      </blockquote>
                    </div>

                    {/* Director Info - Improved layout */}
                    <div className="border-t border-gray-200 pt-6 lg:pt-8 mt-6 lg:mt-8">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary to-emerald-500 rounded-xl flex items-center justify-center shadow-elegant">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`font-display text-gray-900 mb-2 leading-tight ${
                              language === "en" ? "text-lg lg:text-xl" : "text-xl"
                            }`}
                          >
                            {t("director.name")}
                          </div>
                          <div
                            className={`text-gray-600 font-medium leading-relaxed ${
                              language === "en" ? "text-sm lg:text-base" : "text-sm"
                            }`}
                          >
                            {t("director.position")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
