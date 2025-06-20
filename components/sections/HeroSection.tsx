"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import { BookOpen, ChevronRight, Sparkles, Award, Users, TrendingUp } from "lucide-react"
import Image from "next/image"
import ContactModal from "@/components/ui/ContactModal"

export default function HeroSection() {
  const { t, language } = useLanguage()
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  const handleContactClick = () => {
    setIsContactModalOpen(true)
  }

  return (
    <section className="relative pt-24 lg:pt-32 pb-24 lg:pb-32 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/40">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%235D9C59' fillOpacity='0.15'%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3Ccircle cx='60' cy='60' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Improved Floating Elements */}
      <div className="absolute top-24 left-8 w-80 h-80 bg-gradient-to-r from-primary/8 to-emerald-500/8 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-24 right-8 w-96 h-96 bg-gradient-to-r from-emerald-400/8 to-teal-400/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>

      <div className="container mx-auto px-6 lg:px-8 relative">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-12 lg:gap-16 xl:gap-20 items-center min-h-[700px]">
          {/* Enhanced Content Section */}
          <div className="text-center lg:text-left animate-slide-up space-y-8 lg:space-y-10">
            {/* Premium Badge */}
            <div className="inline-flex items-center glass-card px-6 py-4 rounded-full shadow-elegant border border-white/30">
              <Sparkles className="w-5 h-5 mr-3 text-primary animate-pulse" />
              <span className="text-primary font-semibold text-base">
                {t("hero.subtitle")}
              </span>
            </div>

            {/* Enhanced Hero Title */}
            <div className="space-y-8">
              <h1 className="font-display relative">
                <div className="space-y-4">
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-tight font-black tracking-wide py-4">
                    <div className="block sm:whitespace-nowrap text-primary hover:text-emerald-600 transition-all duration-500 mb-4 py-2">
                      {t("hero.title.main")}
                    </div>
                    <div className="block sm:whitespace-nowrap text-emerald-600 hover:text-primary transition-all duration-500 py-2">
                      {t("hero.title.sub")}
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Decorative elements */}
                <div className="absolute -top-6 -left-6 w-10 h-10 bg-gradient-to-br from-primary to-emerald-500 rounded-full opacity-20 animate-bounce"></div>
                <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full opacity-30 animate-pulse delay-500"></div>
              </h1>

              {/* Enhanced Elegant Divider */}
              <div className="flex items-center justify-center lg:justify-start space-x-4 py-4">
                <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-emerald-500 rounded-full shadow-lg"></div>
                <div className="w-4 h-4 bg-gradient-to-br from-primary to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                <div className="w-14 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-lg"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse delay-700"></div>
              </div>
            </div>

            {/* Mission Statement */}
            <div className="max-w-2xl mx-auto lg:mx-0">
              <div className="relative pl-6 py-5">
                {/* Clean accent line */}
                <div className="absolute left-0 top-4 bottom-4 w-1 bg-primary rounded-full"></div>
                
                <div className="text-lg lg:text-xl leading-relaxed font-semibold vietnamese-text vietnamese-wrap">
                  <div className="text-gray-700 leading-relaxed text-no-orphans preserve-phrases whitespace-pre-line">
                    {t("hero.description").split('\n').map((line, index) => (
                      <div key={index} className={index === 0 ? "mb-2" : ""}>
                        {index === 0 ? (
                          <span className="text-gray-700">
                            <span className="text-primary font-semibold">{line.split('–')[0]}</span>
                            <span className="mx-2">–</span>
                            <span className="text-emerald-600 font-semibold">{line.split('–')[1]}</span>
                          </span>
                        ) : (
                          <span className="text-gray-800">{line}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-2">
              <Button className="btn-primary px-10 py-5 text-lg font-semibold shadow-elegant hover:shadow-luxury transition-all duration-300 rounded-2xl group">
                <BookOpen className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                {t("hero.btn.learn")}
              </Button>
              <Button
                onClick={handleContactClick}
                variant="outline"
                className="border-2 border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary px-10 py-5 text-lg font-semibold transition-all duration-300 rounded-2xl hover:shadow-elegant backdrop-blur-sm"
              >
                {t("hero.btn.contact")}
                <ChevronRight className="ml-3 h-6 w-6" />
              </Button>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 pt-6">
              <div className="flex items-center justify-center lg:justify-start space-x-3 group">
                <div className="p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-300 shadow-sm flex-shrink-0">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <span className="font-semibold text-gray-700 text-sm whitespace-nowrap">{t("hero.trust.reputation")}</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-3 group">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors duration-300 shadow-sm flex-shrink-0">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>
                <span className="font-semibold text-gray-700 text-sm whitespace-nowrap">{t("hero.trust.readers")}</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-3 group">
                <div className="p-2.5 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors duration-300 shadow-sm flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-700 text-sm whitespace-nowrap">{t("hero.trust.growth")}</span>
              </div>
            </div>
          </div>

          {/* Enhanced Image Section */}
          <div className="relative animate-fade-in">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Enhanced background blur */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/15 to-emerald-600/15 rounded-3xl blur-2xl scale-105"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-blue-500/10 rounded-3xl blur-xl scale-110"></div>
              
              <Image
                src="/images/Nghiên cứu.jpg"
                alt={t("hero.image.alt")}
                width={700}
                height={500}
                className="relative rounded-3xl shadow-premium object-cover w-full h-[400px] lg:h-[500px] border border-white/20 image-high-quality"
                priority
                quality={95}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />

              {/* Enhanced Floating Stats Card */}
              <div className="absolute -bottom-8 -left-8 glass-card p-6 rounded-2xl shadow-luxury border border-white/30 animate-scale-in backdrop-blur-md">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-primary to-emerald-500 p-3 rounded-xl shadow-lg">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-display text-gray-900 font-bold">2024</div>
                    <div className="text-gray-600 font-medium">
                      {t("hero.established")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Floating Achievement Badge */}
              <div className="absolute -top-6 -right-6 glass-card p-5 rounded-2xl shadow-luxury border border-white/30 animate-scale-in delay-300 backdrop-blur-md">
                <div className="text-center">
                  <div className="text-4xl font-display bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent font-bold mb-1">100+</div>
                  <div className="text-sm text-gray-600 font-semibold">
                    {t("stats.programs")}
                  </div>
                </div>
              </div>

              {/* Additional decorative element */}
              <div className="absolute top-1/2 -left-4 w-3 h-20 bg-gradient-to-b from-primary/30 to-emerald-500/30 rounded-full blur-sm animate-pulse delay-1000"></div>
              <div className="absolute top-1/4 -right-2 w-2 h-12 bg-gradient-to-b from-emerald-500/40 to-teal-500/40 rounded-full blur-sm animate-pulse delay-1500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white via-white/80 to-transparent"></div>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </section>
  )
}
