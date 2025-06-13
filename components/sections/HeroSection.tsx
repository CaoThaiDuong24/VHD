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
    <section className="relative pt-20 lg:pt-24 pb-20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%235D9C59' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 items-center">
          {/* Content Section */}
          <div className="text-left animate-slide-up">
            {/* Premium Badge */}
            <div className="inline-flex items-center glass-card px-4 lg:px-6 py-3 rounded-full mb-6 lg:mb-8 shadow-elegant">
              <Sparkles className="w-4 lg:w-5 h-4 lg:h-5 mr-2 lg:mr-3 text-primary flex-shrink-0" />
              <span className="text-primary font-semibold text-sm lg:text-base whitespace-nowrap">
                {t("hero.subtitle")}
              </span>
            </div>

            {/* Hero Title */}
            <div className="mb-6 lg:mb-10">
              <h1 className="font-display mb-6">
                {/* Main Title */}
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-gray-900 leading-tight mb-2 lg:mb-4">
                  <span className="block whitespace-nowrap">{t("hero.title.main")}</span>
                </div>

                {/* Highlight */}
                <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight mb-2 lg:mb-4">
                  <span className="gradient-text-primary font-bold whitespace-nowrap">
                    {t("hero.title.highlight")}
                  </span>
                </div>

                {/* Sub Title */}
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-gray-800 leading-tight">
                  <span className="block whitespace-nowrap">{t("hero.title.sub")}</span>
                </div>
              </h1>

              {/* Elegant Divider */}
              <div className="flex items-center mt-6 lg:mt-8 mb-6">
                <div className="w-16 lg:w-20 h-1 bg-gradient-to-r from-primary to-emerald-500 rounded-full"></div>
                <div className="w-3 h-3 bg-primary rounded-full mx-4 animate-pulse"></div>
                <div className="w-8 lg:w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"></div>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg lg:text-xl text-gray-600 mb-8 lg:mb-10 leading-relaxed font-body max-w-2xl">
              {t("hero.description")}
            </p>

            {/* Premium CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 lg:mb-12">
              <Button className="btn-primary px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold shadow-elegant hover:shadow-luxury transition-all duration-300 rounded-xl group whitespace-nowrap">
                <BookOpen className="mr-2 lg:mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300 flex-shrink-0" />
                {t("hero.btn.learn")}
              </Button>
              <Button
                onClick={handleContactClick}
                variant="outline"
                className="border-2 border-primary/20 text-primary hover:bg-primary hover:text-white px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold transition-all duration-300 rounded-xl hover:shadow-elegant whitespace-nowrap"
              >
                {t("hero.btn.contact")}
                <ChevronRight className="ml-2 lg:ml-3 h-5 w-5 flex-shrink-0" />
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">{t("hero.trust.reputation")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">{t("hero.trust.readers")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">{t("hero.trust.growth")}</span>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-emerald-600/20 rounded-3xl blur-2xl"></div>
              <Image
                src="/images/reading-culture-development/community-reading-event.jpeg"
                alt="Thư viện hiện đại với không gian đọc sách chuyên nghiệp"
                width={800}
                height={600}
                className="relative rounded-3xl shadow-premium object-cover hover-lift w-full h-[400px] lg:h-[500px]"
                priority
              />
            </div>

            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 lg:-bottom-8 -left-6 lg:-left-8 glass-card p-4 lg:p-6 rounded-2xl shadow-luxury border border-white/20 animate-scale-in">
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="bg-gradient-to-r from-primary to-emerald-500 p-2 lg:p-3 rounded-xl">
                  <BookOpen className="h-6 lg:h-8 w-6 lg:w-8 text-white" />
                </div>
                <div>
                  <div className="text-xl lg:text-2xl font-display text-gray-900">2024</div>
                  <div className="text-gray-600 font-medium text-sm lg:text-base whitespace-nowrap">
                    {t("hero.established")}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Achievement Badge */}
            <div className="absolute -top-4 lg:-top-6 -right-4 lg:-right-6 glass-card p-3 lg:p-4 rounded-2xl shadow-luxury border border-white/20 animate-scale-in delay-300">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-display gradient-text-primary mb-1">100+</div>
                <div className="text-xs lg:text-sm text-gray-600 font-medium whitespace-nowrap">
                  {language === "en" ? "Programs" : "Chương trình"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </section>
  )
}
