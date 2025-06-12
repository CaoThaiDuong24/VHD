"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Building, Target, Heart, Users } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import Image from "next/image"

export default function AboutSection() {
  const { t } = useLanguage()

  return (
    <section id="about" className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-green-100 to-emerald-100 text-[#5D9C59] border-green-200 text-base px-6 py-3 font-semibold">
            {t("about.badge")}
          </Badge>
          <h2 className="text-5xl font-bold text-gray-900 mb-6 font-inter">{t("about.title")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">{t("about.pioneer.unit")}</p>
          <div className="w-32 h-1.5 bg-gradient-to-r from-[#5D9C59] to-[#7FB069] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#5D9C59]/10 to-emerald-600/10 rounded-3xl blur-2xl"></div>
            <Image
              src="/images/DSC02433.JPG"
              alt="Trung tâm đọc thân thiện môi trường"
              width={600}
              height={500}
              className="relative rounded-3xl shadow-2xl object-cover w-full h-[400px]"
            />
            <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-lg p-4 rounded-2xl shadow-xl border border-white/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#5D9C59] to-[#7FB069] bg-clip-text text-transparent font-inter">
                RCP
              </div>
              <div className="text-sm text-gray-600 font-medium">Since 2024</div>
            </div>
          </div>

          <div>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">{t("about.description1")}</p>
            <p className="text-gray-600 text-lg leading-relaxed mb-10">{t("about.description2")}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-green-100 hover:border-[#5D9C59] hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-[#5D9C59] to-[#7FB069] p-3 rounded-xl">
                      <Calendar className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg font-inter">{t("about.established")}</div>
                      <div className="text-gray-600 font-medium">{t("about.established.date")}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-amber-100 hover:border-amber-400 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-50 to-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-xl">
                      <Building className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg font-inter">{t("about.management")}</div>
                      <div className="text-gray-600 font-medium">{t("about.management.org")}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: t("about.mission1.title"),
              description: t("about.mission1.desc"),
              gradient: "from-[#5D9C59] to-[#7FB069]",
              bgGradient: "from-green-50 to-emerald-50",
              borderColor: "border-green-100 hover:border-[#5D9C59]",
            },
            {
              icon: Heart,
              title: t("about.mission2.title"),
              description: t("about.mission2.desc"),
              gradient: "from-rose-500 to-pink-500",
              bgGradient: "from-rose-50 to-pink-50",
              borderColor: "border-rose-100 hover:border-rose-400",
            },
            {
              icon: Users,
              title: t("about.mission3.title"),
              description: t("about.mission3.desc"),
              gradient: "from-blue-500 to-cyan-500",
              bgGradient: "from-blue-50 to-cyan-50",
              borderColor: "border-blue-100 hover:border-blue-400",
            },
          ].map((item, index) => (
            <Card
              key={index}
              className={`text-center p-8 border-2 ${item.borderColor} hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${item.bgGradient} group`}
            >
              <div className="relative mb-6">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300`}
                ></div>
                <div
                  className={`relative w-20 h-20 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center mx-auto`}
                >
                  <item.icon className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-inter">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </Card>
          ))}
        </div>

        {/* Additional Images Section */}
        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              <Image
                src="/images/modern-library/professional-reading-space.jpeg"
                alt="Không gian đọc hiện đại với thanh niên đang đọc sách"
                width={600}
                height={400}
                className="rounded-2xl shadow-soft object-cover w-full h-[300px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="text-lg font-semibold mb-1">Không gian đọc hiện đại</h4>
                <p className="text-sm opacity-90">Môi trường học tập thoải mái và chuyên nghiệp</p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/modern-reading-space.jpg"
                alt="Phát triển văn hóa đọc trong cộng đồng"
                width={600}
                height={400}
                className="rounded-2xl shadow-soft object-cover w-full h-[300px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="text-lg font-semibold mb-1">Phát triển văn hóa đọc</h4>
                <p className="text-sm opacity-90">Lan tỏa văn hóa đọc trong cộng đồng</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
