"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { Eye, Target, Heart, Lightbulb, Award, Users, Sparkles, Quote, Star, ArrowRight } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function VisionMissionSection() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("vision")

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-l from-primary/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-r from-emerald-500/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-emerald-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>

      <div className="container mx-auto px-6 relative">
        {/* Modern Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center glass-card px-6 py-3 rounded-full mb-6 shadow-elegant">
            <Lightbulb className="w-5 h-5 mr-3 text-primary" />
            <span className="text-primary font-semibold">{t("vision.badge")}</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display text-gray-900 mb-4 leading-tight">{t("vision.title")}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-emerald-500 mx-auto rounded-full mb-6"></div>
        </div>

        {/* Interactive Tabs */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1.5 bg-gray-100 rounded-xl">
              <button
                onClick={() => setActiveTab("vision")}
                className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                  activeTab === "vision" ? "bg-white text-primary shadow-soft" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {t("vision.vision.title")}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("mission")}
                className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                  activeTab === "mission" ? "bg-white text-primary shadow-soft" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  {t("vision.mission.title")}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("values")}
                className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                  activeTab === "values" ? "bg-white text-primary shadow-soft" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  {t("vision.values.title")}
                </div>
              </button>
            </div>
          </div>

          {/* Content Area with Animation */}
          <div className="relative bg-white rounded-2xl shadow-luxury overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%235D9C59' fillOpacity='0.2'%3E%3Cpath d='M50 50m-25 0a25,25 0 1,1 50,0a25,25 0 1,1 -50,0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
            </div>

            {/* Vision Content */}
            <div
              className={`transition-all duration-500 ${
                activeTab === "vision" ? "opacity-100 translate-y-0" : "opacity-0 absolute -translate-y-10"
              }`}
              style={{ display: activeTab === "vision" ? "block" : "none" }}
            >
              <div className="p-10 md:p-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur-2xl"></div>
                    <Image
                      src="/images/tam-nhin-2.png"
                      alt="Tầm nhìn tương lai - Thư viện số hiện đại với công nghệ tiên tiến"
                      width={500}
                      height={400}
                      className="relative rounded-3xl shadow-luxury object-cover w-full h-[400px] hover-lift"
                    />
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-luxury">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-display text-gray-900 mb-6 leading-tight">
                      {t("vision.vision.title")}
                    </h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6"></div>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">{t("vision.vision.content")}</p>
                    <div className="space-y-3">
                      <div className="flex items-center text-blue-600 font-medium">
                        <Star className="w-5 h-5 mr-3" />
                        <span>{t("vision.future.knowledge")}</span>
                      </div>
                      <div className="flex items-center text-blue-600 font-medium">
                        <Sparkles className="w-5 h-5 mr-3" />
                        <span>{t("vision.pioneer.technology")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Content */}
            <div
              className={`transition-all duration-500 ${
                activeTab === "mission" ? "opacity-100 translate-y-0" : "opacity-0 absolute -translate-y-10"
              }`}
              style={{ display: activeTab === "mission" ? "block" : "none" }}
            >
              <div className="p-10 md:p-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-3xl font-display text-gray-900 mb-6 leading-tight">
                      {t("vision.mission.title")}
                    </h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-primary to-emerald-500 rounded-full mb-6"></div>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">{t("vision.mission.content")}</p>
                    <div className="space-y-3">
                      <div className="flex items-center text-primary font-medium">
                        <Target className="w-5 h-5 mr-3" />
                        <span>{t("mission.spread.culture")}</span>
                      </div>
                      <div className="flex items-center text-primary font-medium">
                        <Users className="w-5 h-5 mr-3" />
                        <span>{t("mission.develop.human")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-3xl blur-2xl"></div>
                    <Image
                      src="/images/Sứ mệnh.jpg"
                      alt="Sứ mệnh - Xây dựng cộng đồng học tập đa dạng và hòa nhập"
                      width={500}
                      height={400}
                      className="relative rounded-3xl shadow-luxury object-cover w-full h-[400px] hover-lift"
                    />
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-primary to-emerald-500 rounded-2xl flex items-center justify-center shadow-luxury">
                      <Target className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Values Content */}
            <div
              className={`transition-all duration-500 ${
                activeTab === "values" ? "opacity-100 translate-y-0" : "opacity-0 absolute -translate-y-10"
              }`}
              style={{ display: activeTab === "values" ? "block" : "none" }}
            >
              <div className="p-10 md:p-16">
                <h3 className="text-3xl font-display text-gray-900 mb-8 text-center">{t("vision.values.title")}</h3>

                {/* Main Values Image */}
                <div className="relative mb-12">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-3xl blur-2xl"></div>
                  <Image
                    src="/images/modern-library/professional-reading-space.jpeg"
                    alt="Giá trị cốt lõi - Đội ngũ chuyên nghiệp làm việc hợp tác"
                    width={800}
                    height={300}
                    className="relative rounded-3xl shadow-luxury object-cover w-full h-[300px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-3xl"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h4 className="text-xl font-semibold mb-2">{t("values.rcp.core")}</h4>
                    <p className="text-sm opacity-90">{t("values.work.culture")}</p>
                  </div>
                </div>

                {/* Values Grid with Individual Images */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: t("vision.value1.title"),
                      description: t("vision.value1.desc"),
                      icon: Award,
                      gradient: "from-amber-500 to-orange-500",
                      image: "/images/conference-seminar.jpg",
                      alt: "Trí tuệ và sáng tạo - Chia sẻ tri thức giữa các thế hệ",
                    },
                    {
                      title: t("vision.value2.title"),
                      description: t("vision.value2.desc"),
                      icon: Users,
                      gradient: "from-primary to-emerald-500",
                      image: "/images/community-library.jpg",
                      alt: "Kết nối và phát triển bền vững - Thư viện xanh thân thiện môi trường",
                    },
                    {
                      title: t("vision.value3.title"),
                      description: t("vision.value3.desc"),
                      icon: Heart,
                      gradient: "from-blue-500 to-cyan-500",
                      image: "/images/reading-center.jpg",
                      alt: "Chính trực và tôn trọng tri thức - Chăm sóc và bảo quản tri thức",
                    },
                  ].map((value, index) => (
                    <div key={index} className="text-center group">
                      {/* Value Image */}
                      <div className="relative mb-6 overflow-hidden rounded-2xl">
                        <Image
                          src={value.image || "/placeholder.svg"}
                          alt={value.alt}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Icon Overlay */}
                        <div className="absolute top-4 right-4">
                          <div
                            className={`w-12 h-12 bg-gradient-to-r ${value.gradient} rounded-xl flex items-center justify-center shadow-luxury group-hover:scale-110 transition-transform duration-300`}
                          >
                            <value.icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </div>

                      <h4 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300">
                        {value.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Section with Background Image */}
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="relative rounded-2xl overflow-hidden">
            <Image
              src="/images/modern-reading-space.jpg"
              alt="Phát triển văn hóa đọc trong cộng đồng"
              width={800}
              height={300}
              className="w-full h-[300px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-8">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center mx-auto mb-6">
                  <Quote className="h-6 w-6 text-white" />
                </div>
                <blockquote className="text-xl md:text-2xl text-white font-display leading-relaxed mb-6">
                  {t("vision.quote")}
                </blockquote>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <div className="w-2 h-2 bg-white/80 rounded-full"></div>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <Button className="bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 text-white px-8 py-6 rounded-xl font-medium shadow-elegant hover:shadow-luxury transition-all duration-300 group">
            <span className="text-lg">{t("hero.btn.learn")}</span>
            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </section>
  )
}
