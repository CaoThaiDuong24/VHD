"use client"
import ModernHeader from "@/components/layout/ModernHeader"
import Footer from "@/components/layout/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, Users, Target, CheckCircle, Clock, BookOpen } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import Image from "next/image"

export default function ProjectsPage() {
  const { t } = useLanguage()

  const ongoingProjects = [
    {
      title: t("projects.ongoing.project1.title"),
      description: t("projects.ongoing.project1.description"),
      image: "/images/DSC02223.JPG",
      progress: 75,
      startDate: "01/06/2024",
      endDate: "31/12/2025",
      participants: t("projects.ongoing.project1.participants"),
      budget: t("projects.ongoing.project1.budget"),
      status: "ongoing",
      category: t("category.community"),
    },
    {
      title: t("projects.ongoing.project2.title"),
      description: t("projects.ongoing.project2.description"),
      image: "/images/van_hoa_doc_sach.jpg",
      progress: 60,
      startDate: "15/03/2024",
      endDate: "30/06/2025",
      participants: t("projects.ongoing.project2.participants"),
      budget: t("projects.ongoing.project2.budget"),
      status: "ongoing",
      category: t("category.technology"),
    },
    {
      title: t("projects.ongoing.project3.title"),
      description: t("projects.ongoing.project3.description"),
      image: "/images/trien lam.jpg",
      progress: 85,
      startDate: "01/01/2024",
      endDate: "31/03/2025",
      participants: t("projects.ongoing.project3.participants"),
      budget: t("projects.ongoing.project3.budget"),
      status: "ongoing",
      category: t("category.education"),
    },
  ]

  const completedProjects = [
    {
      title: t("projects.completed.project1.title"),
      description: t("projects.completed.project1.description"),
      image: "/images/Le khanh thanh.jpg",
      completedDate: "30/11/2024",
      participants: t("projects.completed.project1.participants"),
      results: t("projects.completed.project1.results"),
      status: "completed",
      category: t("category.research"),
    },
    {
      title: t("projects.completed.project2.title"),
      description: t("projects.completed.project2.description"),
      image: "/images/reading-culture-development.jpg",
      completedDate: "15/10/2024",
      participants: t("projects.completed.project2.participants"),
      results: t("projects.completed.project2.results"),
      status: "completed",
      category: t("category.event"),
    },
  ]

  return (
    <div className="min-h-screen">
      <ModernHeader />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
                <Target className="w-4 h-4 mr-2" />
                {t("projects.page.title")}
              </div>
              <h1 className="text-4xl lg:text-6xl font-display text-gray-900 leading-tight mb-6">
                {t("projects.page.hero.title")}
                <span className="text-primary"> {t("projects.page.hero.highlight")}</span>
              </h1>
              <div className="w-20 h-1 bg-primary rounded-full mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t("projects.page.hero.description")}</p>
            </div>
          </div>
        </section>

        {/* Ongoing Projects */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-display text-gray-900 mb-12">{t("projects.ongoing.title")}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
              {ongoingProjects.map((project, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-minimal hover:shadow-soft transition-shadow duration-200 group"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                        {project.category}
                      </span>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        {t("projects.status.ongoing")}
                      </span>
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-gray-900 text-lg leading-tight">{project.title}</CardTitle>
                    <CardDescription className="text-gray-600 text-sm">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-gray-700">{t("projects.progress")}</span>
                          <span className="text-xs font-medium text-primary">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-primary" />
                          <span>{project.startDate}</span>
                        </div>
                        <div className="flex items-center">
                          <Target className="h-3 w-3 mr-1 text-primary" />
                          <span>{project.endDate}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1 text-primary" />
                          <span>{project.participants}</span>
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1 text-primary" />
                          <span>{project.budget}</span>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-medium text-sm">
                      {t("projects.details")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Completed Projects */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-display text-gray-900 mb-12">{t("projects.completed.title")}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
              {completedProjects.map((project, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-minimal hover:shadow-soft transition-shadow duration-200 group"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                        {project.category}
                      </span>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {t("projects.status.completed")}
                      </span>
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-gray-900 text-lg leading-tight">{project.title}</CardTitle>
                    <CardDescription className="text-gray-600 text-sm">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        <span>
                          {t("projects.status.completed")}: {project.completedDate}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{project.participants}</span>
                      </div>
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          {t("projects.results.label")}: {project.results}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-2 rounded-lg font-medium text-sm"
                    >
                      {t("projects.report")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Project Statistics */}
            <div className="text-center mb-12">
              <h3 className="text-2xl font-display text-gray-900 mb-4">{t("projects.stats.title")}</h3>
              <div className="w-16 h-1 bg-primary rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  number: "15+",
                  label: t("projects.stats.completed"),
                  icon: CheckCircle,
                  color: "green",
                },
                {
                  number: "8",
                  label: t("projects.stats.ongoing"),
                  icon: Clock,
                  color: "primary",
                },
                {
                  number: "100K+",
                  label: t("projects.stats.beneficiaries"),
                  icon: Users,
                  color: "blue",
                },
                {
                  number: "50+",
                  label: t("projects.stats.partners"),
                  icon: Target,
                  color: "amber",
                },
              ].map((stat, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-minimal hover:shadow-soft transition-shadow duration-200 text-center"
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 bg-${stat.color === "primary" ? "primary" : stat.color === "green" ? "green-100" : stat.color === "blue" ? "blue-100" : "amber-100"} rounded-xl flex items-center justify-center mx-auto mb-4`}
                    >
                      <stat.icon
                        className={`h-6 w-6 ${stat.color === "primary" ? "text-white" : stat.color === "green" ? "text-green-600" : stat.color === "blue" ? "text-blue-600" : "text-amber-600"}`}
                      />
                    </div>
                    <div className="text-3xl font-display text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
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
