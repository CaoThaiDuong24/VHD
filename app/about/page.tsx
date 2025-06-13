"use client"
import ModernHeader from "@/components/layout/ModernHeader"
import Footer from "@/components/layout/Footer"
import VisionMissionSection from "@/components/sections/VisionMissionSection"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Building, Users, Award, BookOpen } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import Image from "next/image"

export default function AboutPage() {
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
                <BookOpen className="w-4 h-4 mr-2" />
                {t("about.page.title")}
              </div>
              <h1 className="font-display mb-6">
                {/* Main Title */}
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-gray-900 leading-tight mb-2 lg:mb-4">
                  <span className="block">{t("about.page.hero.title")}</span>
                </div>

                {/* Highlight */}
                <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight mb-2 lg:mb-4">
                  <span className="gradient-text-primary font-bold">
                    {t("about.page.hero.highlight")}
                  </span>
                </div>

                {/* Sub Title */}
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-gray-800 leading-tight">
                  <span className="block">{t("about.page.hero.sub")}</span>
                </div>
              </h1>

              {/* Elegant Divider */}
              <div className="flex items-center justify-center mt-6 lg:mt-8 mb-6">
                <div className="w-16 lg:w-20 h-1 bg-gradient-to-r from-primary to-emerald-500 rounded-full"></div>
                <div className="w-3 h-3 bg-primary rounded-full mx-4 animate-pulse"></div>
                <div className="w-8 lg:w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"></div>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t("about.page.hero.description")}</p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
              <div className="relative">
                <Image
                  src="/images/reading-culture-development.jpg"
                  alt="Reading Center"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-soft object-cover w-full h-[400px]"
                />
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-display text-gray-900">{t("about.page.intro.title")}</h2>
                <p className="text-gray-600 leading-relaxed">{t("about.description1")}</p>
                <p className="text-gray-600 leading-relaxed">{t("about.description2")}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <Card className="border-0 shadow-minimal hover:shadow-soft transition-shadow duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{t("about.established")}</div>
                          <div className="text-sm text-gray-500">{t("about.established.date")}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-minimal hover:shadow-soft transition-shadow duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                          <Building className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{t("about.management")}</div>
                          <div className="text-sm text-gray-500">{t("about.management.org")}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <VisionMissionSection />

        {/* Organization Structure */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display text-gray-900 mb-4">{t("about.page.structure.title")}</h2>
              <div className="w-16 h-1 bg-primary rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: t("about.page.management"),
                  icon: Award,
                  count: "3",
                  color: "primary",
                },
                {
                  title: t("about.page.admin"),
                  icon: Building,
                  count: "5",
                  color: "blue",
                },
                {
                  title: t("about.page.programs"),
                  icon: BookOpen,
                  count: "8",
                  color: "emerald",
                },
                {
                  title: t("about.page.external"),
                  icon: Users,
                  count: "6",
                  color: "amber",
                },
              ].map((dept, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-minimal hover:shadow-soft transition-shadow duration-200 text-center"
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 bg-${dept.color === "primary" ? "primary" : dept.color === "blue" ? "blue-100" : dept.color === "emerald" ? "emerald-100" : "amber-100"} rounded-xl flex items-center justify-center mx-auto mb-4`}
                    >
                      <dept.icon
                        className={`h-6 w-6 ${dept.color === "primary" ? "text-white" : dept.color === "blue" ? "text-blue-600" : dept.color === "emerald" ? "text-emerald-600" : "text-amber-600"}`}
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">{dept.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {dept.count} {t("about.page.members")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
