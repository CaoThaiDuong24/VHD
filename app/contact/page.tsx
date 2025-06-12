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
              <h1 className="text-4xl lg:text-6xl font-display text-gray-900 leading-tight mb-6">
                {t("contact.hero.title")}
                <span className="text-primary"> {t("contact.hero.highlight")}</span>
              </h1>
              <div className="w-20 h-1 bg-primary rounded-full mx-auto mb-6"></div>
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
