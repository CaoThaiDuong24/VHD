"use client"
import { Button } from "@/components/ui/button"
import { Handshake, ArrowRight, Award, TrendingUp } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import Image from "next/image"
import { useState, useEffect } from "react"
export default function PartnersSection() {
  const { t } = useLanguage()
  const [hoveredPartner, setHoveredPartner] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const mainPartners = [
    {
      name: t("partners.list.youth_union"),
      logo: "/images/partners/youth-union-logo.webp",
      category: t("partners.category.youth"),
    },
    {
      name: t("partners.list.thanh_nien"),
      logo: "/images/partners/vietnam-youth-logo.webp",
      category: t("partners.category.media"),
    },
    {
      name: t("partners.list.tri_thuc"),
      logo: "/images/partners/knowledge-magazine-logo.webp",
      category: t("partners.category.magazine"),
    },
    {
      name: t("partners.list.ysw"),
      logo: "/images/partners/ysw-logo.webp",
      category: t("partners.category.social"),
    },
    {
      name: t("partners.list.kim_dong"),
      logo: "/images/partners/kim-dong-publisher-logo.webp",
      category: t("partners.category.publisher"),
    },
    {
      name: t("partners.list.huong_trang"),
      logo: "/images/partners/huong-trang-books-logo.webp",
      category: t("partners.category.bookstore"),
    },
    {
      name: t("partners.list.expert_club"),
      logo: "/images/partners/love-journey-club-logo.webp",
      category: t("partners.category.club"),
    },
  ]

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%235D9C59' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-primary/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative">
        {/* Premium Header */}
        <div className="text-center mb-20 animate-slide-up">
          <div className="inline-flex items-center glass-card px-6 py-3 rounded-full mb-8 shadow-elegant">
            <Handshake className="w-5 h-5 mr-3 text-primary" />
            <span className="text-primary font-semibold">{t("partners.badge")}</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-display text-gray-900 mb-6 leading-tight">{t("partners.title")}</h2>

          <div className="flex items-center justify-center mb-8">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent to-primary rounded-full"></div>
            <div className="w-3 h-3 bg-primary rounded-full mx-4"></div>
            <div className="w-24 h-1 bg-gradient-to-l from-transparent to-emerald-500 rounded-full"></div>
          </div>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-body">
            {t("partners.description")}
          </p>
        </div>

        {/* Premium Partners Display */}
        <div
          className={`relative transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          {/* Main Partners Container */}
          <div className="glass-card rounded-3xl p-12 shadow-luxury border border-white/20 relative overflow-hidden bg-gradient-to-br from-white/90 to-emerald-50/30">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/5 to-transparent rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-emerald-500/5 to-transparent rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/3 to-emerald-500/3 rounded-full blur-3xl opacity-30"></div>

            <div className="relative">
              {/* Partners Grid - Single Row Layout */}
              <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12 mb-12">
                {mainPartners.map((partner, index) => (
                  <div
                    key={index}
                    className={`group cursor-pointer transition-all duration-700 flex flex-col items-center transform ${
                      isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                    onMouseEnter={() => setHoveredPartner(index)}
                    onMouseLeave={() => setHoveredPartner(null)}
                  >
                    {/* Partner Logo Container */}
                    <div className="relative flex items-center justify-center mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                      <div className="w-20 h-20 lg:w-24 lg:h-24 glass-card rounded-2xl shadow-elegant flex items-center justify-center p-3 lg:p-4 group-hover:shadow-luxury transition-all duration-500 border border-white/20 group-hover:border-primary/20 relative z-10 hover-lift">
                        <Image
                          src={partner.logo || "/placeholder.svg"}
                          alt={partner.name}
                          width={60}
                          height={60}
                          className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-700 w-full h-full"
                        />
                      </div>
                    </div>

                    {/* Partner Name */}
                    <div
                      className={`text-center transition-all duration-500 ${
                        hoveredPartner === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                      }`}
                    >
                      <div className="text-xs lg:text-sm font-semibold text-gray-800 leading-tight text-center max-w-[120px] lg:max-w-[140px] mb-1">
                        {partner.name}
                      </div>
                      <div className="text-xs text-primary font-medium text-center">{partner.category}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Partnership Stats */}
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 sm:space-x-16 py-8 border-t border-gray-200/50">
                <div className="text-center flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-emerald-500 rounded-xl flex items-center justify-center mb-3 shadow-elegant">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-display text-gray-800 mb-1">50+</div>
                  <div className="text-sm text-primary font-medium">{t("partners.stats.partners")}</div>
                </div>
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent hidden sm:block"></div>
                <div className="text-center flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-3 shadow-elegant">
                    <Handshake className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-display text-gray-800 mb-1">25+</div>
                  <div className="text-sm text-blue-600 font-medium">{t("partners.stats.projects")}</div>
                </div>
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent hidden sm:block"></div>
                <div className="text-center flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-3 shadow-elegant">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-display text-gray-800 mb-1">10+</div>
                  <div className="text-sm text-amber-600 font-medium">{t("partners.stats.years")}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium CTA */}
          <div className="text-center mt-16">
            <Button 
              className="btn-primary px-10 py-4 rounded-xl font-semibold shadow-elegant hover:shadow-luxury transition-all duration-300 group text-lg"
            >
              {t("partners.btn")}
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>

    </section>
  )
}
