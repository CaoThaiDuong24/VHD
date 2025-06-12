"use client"
import ModernHeader from "@/components/layout/ModernHeader"
import Footer from "@/components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import Image from "next/image"

export default function EventsPage() {
  const { t } = useLanguage()

  const upcomingEvents = [
    {
      title: t("events.upcoming.event1.title"),
      date: "15/01/2025",
      time: "08:00 - 17:00",
      location: t("events.upcoming.event1.location"),
      participants: "200+",
      image: "/images/hoi_xuat_ban.png",
      category: t("category.conference"),
      status: "upcoming",
    },
    {
      title: t("events.upcoming.event2.title"),
      date: "20/02/2025",
      time: "09:00 - 18:00",
      location: t("events.upcoming.event2.location"),
      participants: "500+",
      image: "/images/trien lam.jpg",
      category: t("category.exhibition"),
      status: "upcoming",
    },
    {
      title: t("events.upcoming.event3.title"),
      date: "10/03/2025",
      time: "08:00 - 16:00",
      location: t("events.upcoming.event3.location"),
      participants: "100+",
      image: "/images/T3BG-4.jpg",
      category: t("category.activity"),
      status: "upcoming",
    },
  ]

  const pastEvents = [
    {
      title: t("events.past.event1.title"),
      date: "15/12/2024",
      time: "08:30 - 17:30",
      location: t("events.past.event1.location"),
      participants: "150",
      image: "/images/modern-library/professional-reading-space.jpeg",
      category: t("category.training"),
      status: "completed",
    },
    {
      title: t("events.past.event2.title"),
      date: "28/11/2024",
      time: "09:00 - 16:00",
      location: t("events.past.event2.location"),
      participants: "80",
      image: "/images/Gap go 2.jpg",
      category: t("category.cooperation"),
      status: "completed",
    },
    {
      title: t("events.past.event3.title"),
      date: "05/11/2024",
      time: "14:00 - 17:00",
      location: t("events.past.event3.location"),
      participants: "120",
      image: "/images/Nghiên cứu.jpg",
      category: t("category.research"),
      status: "completed",
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
                <Calendar className="w-4 h-4 mr-2" />
                {t("events.page.title")}
              </div>
              <h1 className="text-4xl lg:text-6xl font-display text-gray-900 leading-tight mb-6">
                {t("events.page.hero.title")}
                <span className="text-primary"> {t("events.page.hero.highlight")}</span>
              </h1>
              <div className="w-20 h-1 bg-primary rounded-full mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t("events.page.hero.description")}</p>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-display text-gray-900 mb-12">{t("events.upcoming.title")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {upcomingEvents.map((event, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-minimal hover:shadow-soft transition-shadow duration-200 group"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                        {event.category}
                      </span>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        {t("events.status.upcoming")}
                      </span>
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-gray-900 text-lg leading-tight">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        <span>
                          {event.participants} {t("events.participants")}
                        </span>
                      </div>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-medium text-sm">
                      {t("events.register")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Past Events */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-display text-gray-900 mb-12">{t("events.past.title")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-minimal hover:shadow-soft transition-shadow duration-200 group"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                        {event.category}
                      </span>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-gray-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        {t("events.status.completed")}
                      </span>
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-gray-900 text-lg leading-tight">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          {event.participants} {t("events.participants.past")}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-2 rounded-lg font-medium text-sm"
                    >
                      {t("events.report")}
                    </Button>
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
