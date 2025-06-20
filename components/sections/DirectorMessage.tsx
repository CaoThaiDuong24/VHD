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
                <div className="absolute -bottom-8 -right-8 group cursor-pointer">
                  {/* Multiple layered shadows for depth */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-emerald-500/30 rounded-2xl blur-xl scale-110 opacity-60 group-hover:opacity-80 transition-all duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-emerald-500/20 rounded-2xl blur-2xl scale-125 opacity-40 group-hover:opacity-60 transition-all duration-700"></div>
                  
                  {/* Main badge container */}
                  <div className="relative">
                    {/* Outer ring with gradient border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-emerald-500 to-primary rounded-2xl p-0.5 group-hover:p-1 transition-all duration-300">
                      <div className="w-full h-full bg-white/95 rounded-2xl"></div>
                    </div>
                    
                    {/* Badge content */}
                    <div className="relative bg-gradient-to-br from-white/95 via-white/90 to-emerald-50/80 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-2xl border border-white/40 group-hover:shadow-3xl group-hover:scale-105 transition-all duration-300">
                      {/* Top accent line */}
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary to-emerald-500 rounded-full opacity-60"></div>
                      
                      {/* Icon */}
                      <div className="flex justify-center mb-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary to-emerald-500 rounded-xl blur-sm opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                          <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      {/* Title with enhanced typography */}
                      <div className="text-center">
                        <div className="text-xl font-display font-bold bg-gradient-to-r from-primary via-emerald-600 to-primary bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:via-primary group-hover:to-emerald-600 transition-all duration-500 tracking-tight">
                          Director
                        </div>
                        
                        {/* Decorative underline */}
                        <div className="mt-2 flex justify-center">
                          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full group-hover:w-16 group-hover:via-emerald-500/60 transition-all duration-500"></div>
                        </div>
                      </div>
                      
                      {/* Bottom decorative elements */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                        <div className="w-1 h-1 bg-primary/40 rounded-full animate-pulse"></div>
                        <div className="w-1.5 h-1.5 bg-emerald-500/60 rounded-full animate-pulse delay-300"></div>
                        <div className="w-1 h-1 bg-primary/40 rounded-full animate-pulse delay-700"></div>
                      </div>
                      
                      {/* Corner accent */}
                      <div className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-br from-primary/30 to-emerald-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
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
                        className={`text-gray-700 leading-relaxed italic font-display mb-8 lg:mb-10 vietnamese-text vietnamese-wrap preserve-phrases ${
                          language === "en" ? "text-lg lg:text-xl" : "text-xl lg:text-2xl"
                        }`}
                      >
                        {t("director.quote").includes('\n\n')
                          ? t("director.quote").split('\n\n').map((paragraph, index) => (
                              <span key={index} className="text-no-orphans">
                                {paragraph}
                                {index < t("director.quote").split('\n\n').length - 1 && <><br /><br /></>}
                              </span>
                            ))
                          : t("director.quote")
                        }
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
