"use client"
import ModernHeader from "@/components/layout/ModernHeader"
import Footer from "@/components/layout/Footer"
import ContactSection from "@/components/sections/ContactSection"
import { MapPin } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function ContactPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen">
      <ModernHeader />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
                <MapPin className="w-4 h-4 mr-2" />
                {t("contact.badge")}
              </div>
              <h1 className="font-display mb-6">
                {/* Main Title */}
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-gray-900 leading-tight mb-2 lg:mb-4">
                  <span className="block">{t("contact.hero.title")}</span>
                </div>

                {/* Highlight */}
                <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight mb-2 lg:mb-4">
                  <span className="gradient-text-primary font-bold">
                    {t("contact.hero.highlight")}
                  </span>
                </div>
              </h1>

              {/* Elegant Divider */}
              <div className="flex items-center justify-center mt-6 lg:mt-8 mb-6">
                <div className="w-16 lg:w-20 h-1 bg-gradient-to-r from-primary to-emerald-500 rounded-full"></div>
                <div className="w-3 h-3 bg-primary rounded-full mx-4 animate-pulse"></div>
                <div className="w-8 lg:w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"></div>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t("contact.hero.description")}</p>
            </div>
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
