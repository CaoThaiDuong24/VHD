"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { BookOpen, Users, Clock, Handshake, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

export default function StatsSection() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    {
      number: "100+",
      label: t("stats.programs"),
      icon: BookOpen,
      color: "from-primary to-emerald-500",
      bgColor: "from-primary/5 to-emerald-500/5",
      iconBg: "from-primary to-emerald-500",
      description: t("stats.programs.desc"),
    },
    {
      number: "50K+",
      label: t("stats.readers"),
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/5 to-cyan-500/5",
      iconBg: "from-blue-500 to-cyan-500",
      description: t("stats.readers.desc"),
    },
    {
      number: "24/7",
      label: t("stats.support"),
      icon: Clock,
      color: "from-amber-500 to-orange-500",
      bgColor: "from-amber-500/5 to-orange-500/5",
      iconBg: "from-amber-500 to-orange-500",
      description: t("stats.support.desc"),
    },
    {
      number: "15+",
      label: t("stats.partners"),
      icon: Handshake,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/5 to-pink-500/5",
      iconBg: "from-purple-500 to-pink-500",
      description: t("stats.partners.desc"),
    },
  ]

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%235D9C59' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Elegant Floating Elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-primary/3 to-emerald-500/3 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-l from-blue-500/3 to-cyan-500/3 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative">
        {/* Refined Header */}
        <div className="text-center mb-20 animate-slide-up">
          <div className="inline-flex items-center glass-card px-6 py-3 rounded-full mb-8 shadow-elegant border border-gray-100/50">
            <Sparkles className="w-5 h-5 mr-3 text-primary" />
            <span className="text-primary font-semibold tracking-wide">{t("stats.outstanding")}</span>
          </div>

          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-display text-gray-900 mb-6 leading-tight">{t("stats.title")}</h2>

          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent to-primary/50 rounded-full"></div>
            <div className="w-2 h-2 bg-primary rounded-full mx-4"></div>
            <div className="w-20 h-0.5 bg-gradient-to-l from-transparent to-emerald-500/50 rounded-full"></div>
          </div>

          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-body">
            {t("stats.bottom.message")}
          </p>
        </div>

        {/* Modern Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group relative transform transition-all duration-700 hover:scale-105 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Premium Card */}
              <div
                className={`relative bg-gradient-to-br ${stat.bgColor} rounded-3xl p-8 border border-gray-100/50 shadow-elegant hover:shadow-luxury transition-all duration-500 group-hover:border-gray-200/50`}
              >
                {/* Floating Icon */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div
                    className={`relative w-20 h-20 bg-gradient-to-br ${stat.iconBg} rounded-2xl flex items-center justify-center mx-auto shadow-elegant group-hover:shadow-luxury group-hover:scale-110 transition-all duration-500`}
                  >
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-display text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-500">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-2 tracking-wide">{stat.label}</div>
                  <div className="text-sm text-gray-600 leading-relaxed font-medium">{stat.description}</div>
                </div>

                {/* Subtle Progress Bar */}
                <div className="mt-6">
                  <div className="w-full h-0.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full transform transition-all duration-1000 ${
                        isVisible ? "translate-x-0" : "-translate-x-full"
                      }`}
                      style={{ transitionDelay: `${index * 200 + 800}ms` }}
                    ></div>
                  </div>
                </div>

                {/* Hover Accent */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Elegant Bottom Message */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 glass-card px-8 py-4 rounded-full shadow-elegant border border-gray-100/50">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium tracking-wide">{t("stats.future.vietnam")}</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
