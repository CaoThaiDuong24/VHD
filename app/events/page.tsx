"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/LanguageContext"
import { useEvents } from "@/contexts/EventsContext"
import { Calendar, MapPin, Users, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import ModernHeader from "@/components/layout/ModernHeader"
import Footer from "@/components/layout/Footer"
import Image from "next/image"
import EventRegistrationModal from "@/components/ui/EventRegistrationModal"

export default function EventsPage() {
  const { language, t } = useLanguage()
  const { events } = useEvents()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<{
    title: string
    date: string
    location: string
  } | null>(null)
  const itemsPerPage = 6

  const handleRegisterClick = (event: any) => {
    setSelectedEvent({
      title: language === 'vi' ? event.title : (event.titleEn || event.title),
      date: new Date(event.date).toLocaleDateString('vi-VN'),
      location: language === 'vi' ? event.location : (event.locationEn || event.location)
    })
    setIsModalOpen(true)
  }

  // Filter only upcoming events
  const upcomingEvents = events?.filter(event => 
    event.status === 'upcoming' || event.status === 'ongoing'
  ) || []

  // Fallback events if no events in context
  const fallbackEvents = [
    {
      id: 1,
      title: "Hội thảo Phát triển văn hóa đọc trong cộng đồng 2025",
      titleEn: "Community Reading Culture Development Conference 2025",
      date: "2025-01-15",
      time: "08:00 - 17:00",
      location: "Trung tâm Hội nghị Quốc gia, Hà Nội",
      locationEn: "National Convention Center, Hanoi",
      participants: "200+ người tham gia",
      participantsEn: "200+ participants",
      category: "Hội thảo",
      categoryEn: "Conference",
      status: "upcoming",
      image: "/images/conference-seminar.jpg",
      description: "Khám phá và thảo luận về các phương pháp phát triển văn hóa đọc"
    },
    {
      id: 2,
      title: "Triển lãm sách và văn hóa đọc Việt Nam 2025",
      titleEn: "Vietnam Book and Reading Culture Exhibition 2025",
      date: "2025-02-20",
      time: "09:00 - 18:00",
      location: "Trung tâm Triển lãm Giảng Võ, Hà Nội",
      locationEn: "Giang Vo Exhibition Center, Hanoi",
      participants: "500+ người tham gia",
      participantsEn: "500+ participants",
      category: "Triển lãm",
      categoryEn: "Exhibition",
      status: "upcoming",
      image: "/images/book-exhibition.jpg",
      description: "Giới thiệu các tác phẩm và hoạt động văn hóa đọc"
    },
    {
      id: 3,
      title: "Chương trình tặng sách cho trẻ em vùng cao",
      titleEn: "Book Donation Program for Highland Children",
      date: "2025-03-10",
      time: "08:00 - 16:00",
      location: "Tỉnh Lai Châu",
      locationEn: "Lai Chau Province",
      participants: "100+ người tham gia",
      participantsEn: "100+ participants",
      category: "Hoạt động",
      categoryEn: "Activity",
      status: "upcoming",
      image: "/images/children-reading.jpg",
      description: "Mang sách và kiến thức đến với trẻ em vùng cao"
    }
  ]

  // Use context events if available, otherwise use fallback
  const displayEvents = upcomingEvents.length > 0 ? upcomingEvents : fallbackEvents

  // Format event data for display
  const formattedEvents = displayEvents.map(event => ({
    ...event,
    displayTitle: language === 'vi' ? event.title : (event.titleEn || event.title),
    displayLocation: language === 'vi' ? event.location : (event.locationEn || event.location),
    displayParticipants: language === 'vi' ? event.participants : (event.participantsEn || event.participants),
    displayCategory: language === 'vi' ? event.category : (event.categoryEn || event.category),
    displayTime: event.time || "08:00 - 17:00",
    statusLabel: event.status === 'upcoming' ? t("event.status.upcoming") : 
                 event.status === 'ongoing' ? t("event.status.ongoing") : 
                 t("event.status.upcoming")
  }))

  // Pagination
  const totalPages = Math.ceil(formattedEvents.length / itemsPerPage)
  const paginatedEvents = formattedEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

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
                {t("events.activities")}
              </div>
              <h1 className="font-display mb-6">
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-gray-900 leading-tight mb-2 lg:mb-4">
                  <span className="block">
                    {t("events.join.our")}
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight mb-2 lg:mb-4">
                  <span className="gradient-text-primary font-bold">
                    {t("events.reading.culture")}
                  </span>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-gray-800 leading-tight">
                  <span className="block">
                    {t("events.meaningful")}
                  </span>
                </div>
              </h1>
              <div className="flex items-center justify-center mt-6 lg:mt-8 mb-6">
                <div className="w-16 lg:w-20 h-1 bg-gradient-to-r from-primary to-emerald-500 rounded-full"></div>
                <div className="w-3 h-3 bg-primary rounded-full mx-4 animate-pulse"></div>
                <div className="w-8 lg:w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"></div>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t("events.discover")}
              </p>
          </div>
        </div>
      </section>

        {/* Events Section */}
        <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                {t("events.upcoming")}
              </h2>
              <div className="w-16 h-1 bg-green-600 rounded-full"></div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {paginatedEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden shadow-minimal hover:shadow-soft transition-all duration-300 border bg-white group">
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={event.image || "/images/conference-seminar.jpg"}
                      alt={event.displayTitle}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-500 text-white border-0 px-3 py-1">
                        {event.statusLabel}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-blue-500 text-white border-0 px-3 py-1">
                        {event.displayCategory}
                      </Badge>
                    </div>
                    </div>

                  {/* Event Content */}
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <h3 
                        className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer"
                        onClick={() => router.push(`/events/${event.id}`)}
                      >
                        {event.displayTitle}
                      </h3>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-600" />
                          <span>{new Date(event.date).toLocaleDateString('vi-VN')}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span>{event.displayTime}</span>
                    </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span className="line-clamp-1">{event.displayLocation}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-600" />
                          <span>{event.displayParticipants}</span>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button 
                          onClick={() => handleRegisterClick(event)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                        >
                          {t("event.register")}
                        </Button>
                    </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Events Message */}
            {formattedEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {t("events.no.available")}
                </h3>
                                  <p className="text-gray-500">
                    {t("events.check.back")}
                  </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                                  <Button
                  variant="outline"
                                    size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg"
                                  >
                  <ChevronLeft className="h-4 w-4" />
                                  </Button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10 h-10 rounded-lg"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg"
                      >
                  <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
        </div>
      </section>
      </main>

      <Footer />
      
      {/* Event Registration Modal */}
      {selectedEvent && (
      <EventRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
          eventTitle={selectedEvent.title}
          eventDate={selectedEvent.date}
          eventLocation={selectedEvent.location}
      />
      )}
    </div>
  )
}
