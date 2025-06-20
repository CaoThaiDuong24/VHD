"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/LanguageContext"
import { useEvents } from "@/contexts/EventsContext"
import { Calendar, MapPin, Users, Clock, ArrowLeft, Share2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import ModernHeader from "@/components/layout/ModernHeader"
import Footer from "@/components/layout/Footer"
import Image from "next/image"
import EventRegistrationModal from "@/components/ui/EventRegistrationModal"

export default function EventDetailPage() {
  const { language, t } = useLanguage()
  const { events, getEventById } = useEvents()
  const params = useParams()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const eventId = Number(params.id)
  const event = getEventById(eventId)

  useEffect(() => {
    // Check if event is liked (from localStorage)
    const likedEvents = JSON.parse(localStorage.getItem('likedEvents') || '[]')
    setIsLiked(likedEvents.includes(eventId))
  }, [eventId])

  const handleLike = () => {
    const likedEvents = JSON.parse(localStorage.getItem('likedEvents') || '[]')
    if (isLiked) {
      const updatedLikes = likedEvents.filter((id: number) => id !== eventId)
      localStorage.setItem('likedEvents', JSON.stringify(updatedLikes))
    } else {
      likedEvents.push(eventId)
      localStorage.setItem('likedEvents', JSON.stringify(likedEvents))
    }
    setIsLiked(!isLiked)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title || 'Sự kiện',
          text: event?.description || 'Tham gia sự kiện thú vị',
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Đã copy link vào clipboard!')
    }
  }

  const handleRegister = () => {
    if (!event) return
    setIsModalOpen(true)
  }

  if (!event) {
    return (
      <div className="min-h-screen">
        <ModernHeader />
        <main className="pt-16">
          <div className="container mx-auto px-6 py-20">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {t("event.not.found")}
              </h1>
              <p className="text-gray-600 mb-8">
                {language === 'vi' 
                  ? 'Sự kiện bạn đang tìm không tồn tại hoặc đã bị xóa.'
                  : 'The event you are looking for does not exist or has been removed.'
                }
              </p>
              <Button onClick={() => router.push('/events')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("event.back.to.list")}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const displayTitle = language === 'vi' ? event.title : (event.titleEn || event.title)
  const displayDescription = language === 'vi' ? event.description : (event.descriptionEn || event.description)
  const displayLocation = language === 'vi' ? event.location : (event.locationEn || event.location)
  const displayParticipants = language === 'vi' ? event.participants : (event.participantsEn || event.participants)
  const displayCategory = language === 'vi' ? event.category : (event.categoryEn || event.category)

  const statusLabel = event.status === 'upcoming' ? t("event.status.upcoming") : 
                     event.status === 'ongoing' ? t("event.status.ongoing") :
                     event.status === 'completed' ? t("event.status.completed") :
                     t("event.status.cancelled")

  return (
    <div className="min-h-screen">
      <ModernHeader />
      
      <main className="pt-16">
        {/* Back Button */}
        <div className="container mx-auto px-6 py-6">
          <Button 
            variant="outline" 
            onClick={() => router.push('/events')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("event.back.to.list")}
          </Button>
        </div>

        {/* Event Hero */}
        <section className="relative">
          <div className="relative h-64 md:h-96 overflow-hidden">
            <Image
              src={event.image || "/images/conference-seminar.jpg"}
              alt={displayTitle}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-6 pb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-green-500 text-white border-0 px-3 py-1">
                    {statusLabel}
                  </Badge>
                  <Badge className="bg-blue-500 text-white border-0 px-3 py-1">
                    {displayCategory}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {displayTitle}
                </h1>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{new Date(event.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Event Content */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <Card className="mb-8">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {t("event.description")}
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                      <p className="vietnamese-text vietnamese-wrap text-no-orphans">{displayDescription}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Event Details */}
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      {t("event.details")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {t("event.date")}
                          </p>
                          <p className="text-gray-600">
                            {new Date(event.date).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {t("event.time")}
                          </p>
                          <p className="text-gray-600">{event.time}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <MapPin className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {t("event.location")}
                          </p>
                          <p className="text-gray-600">{displayLocation}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Users className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {t("event.participants")}
                          </p>
                          <p className="text-gray-600">{displayParticipants}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      {/* Registration Button */}
                      <Button 
                        onClick={handleRegister}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-medium text-lg"
                        disabled={event.status === 'completed' || event.status === 'cancelled'}
                      >
                        {event.status === 'completed' ? 
                          t("event.ended") :
                          event.status === 'cancelled' ?
                          t("event.cancelled") :
                          t("event.register")
                        }
                      </Button>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          onClick={handleLike}
                          className="flex-1"
                        >
                          <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                          {t("event.like")}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleShare}
                          className="flex-1"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          {t("event.share")}
                        </Button>
                      </div>

                      {/* Event Stats */}
                      {(event.views || event.registrations) && (
                        <div className="pt-6 border-t border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-4">
                            {t("event.statistics")}
                          </h4>
                          <div className="space-y-3">
                            {event.views && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  {t("event.views")}
                                </span>
                                <span className="font-medium">{event.views.toLocaleString()}</span>
                              </div>
                            )}
                            {event.registrations && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  {t("event.registered")}
                                </span>
                                <span className="font-medium">{event.registrations.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Event Registration Modal */}
      <EventRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventTitle={displayTitle}
        eventDate={new Date(event.date).toLocaleDateString('vi-VN')}
        eventLocation={displayLocation}
      />
    </div>
  )
} 