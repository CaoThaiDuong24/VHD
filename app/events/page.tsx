"use client"

import { useState, useMemo } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useEvents } from "@/contexts/EventsContext"
import { ChevronLeft, ChevronRight, Calendar, MapPin, Users, Clock, BarChart3, Filter, Search, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ModernHeader from "@/components/layout/ModernHeader"
import Footer from "@/components/layout/Footer"
import Image from "next/image"
import EventRegistrationModal from "@/components/ui/EventRegistrationModal"

// Function to get category color based on category name
const getCategoryColor = (category: string): string => {
  const categoryColors: { [key: string]: string } = {
    'Hội thảo': 'from-primary to-emerald-500',
    'Conference': 'from-primary to-emerald-500',
    'Hoạt động': 'from-emerald-500 to-teal-500',
    'Activity': 'from-emerald-500 to-teal-500',
    'Triển lãm': 'from-green-600 to-lime-600',
    'Exhibition': 'from-green-600 to-lime-600',
    'Đào tạo': 'from-amber-500 to-orange-500',
    'Training': 'from-amber-500 to-orange-500',
    'Hợp tác': 'from-blue-500 to-cyan-500',
    'Cooperation': 'from-blue-500 to-cyan-500',
    'Nghiên cứu': 'from-purple-500 to-pink-500',
    'Research': 'from-purple-500 to-pink-500',
    'Gặp gỡ': 'from-indigo-500 to-blue-500',
    'Meeting': 'from-indigo-500 to-blue-500',
    'Workshop': 'from-orange-500 to-red-500',
    'Khóa học': 'from-orange-500 to-red-500'
  }
  
  return categoryColors[category] || 'from-gray-500 to-gray-600'
}

export default function EventsPage() {
  const { language, t } = useLanguage()
  const { events } = useEvents()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("upcoming")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<{
    title: string
    date: string
    location: string
  } | null>(null)
  const itemsPerPage = 4

  const handleRegisterClick = (event: any) => {
    setSelectedEvent({
      title: event.title,
      date: event.date,
      location: event.location
    })
    setIsModalOpen(true)
  }

  // Get unique categories
  const categories = useMemo(() => {
    const cats = events.map(item => item.category).filter(Boolean)
    return [...new Set(cats)]
  }, [events])

  // Status options
  const statusOptions = [
    { value: "upcoming", label: language === 'vi' ? 'Sắp diễn ra' : 'Upcoming' },
    { value: "ongoing", label: language === 'vi' ? 'Đang diễn ra' : 'Ongoing' },
    { value: "completed", label: language === 'vi' ? 'Đã kết thúc' : 'Completed' },
    { value: "cancelled", label: language === 'vi' ? 'Đã hủy' : 'Cancelled' }
  ]

  // Fallback events matching real EventItem interface
  const fallbackEvents = [
    {
      id: 999,
      title: language === 'vi' ? "Hội thảo Công nghệ Giáo dục 2024" : "Educational Technology Conference 2024",
      titleEn: "Educational Technology Conference 2024",
      description: language === 'vi' ? "Khám phá những xu hướng mới trong công nghệ giáo dục" : "Explore new trends in educational technology",
      descriptionEn: "Explore new trends in educational technology",
      date: "2024-12-20",
      time: "09:00",
      location: language === 'vi' ? "Trung tâm Hội nghị Quốc gia" : "National Convention Center",
      locationEn: "National Convention Center",
      participants: "300+ người tham gia",
      participantsEn: "300+ participants",
      status: "upcoming" as const,
      gradient: getCategoryColor("Hội thảo"),
      views: 1250,
      registrations: 285,
      category: "Hội thảo",
      categoryEn: "Conference",
      image: "/images/conference-seminar.jpg"
    },
    {
      id: 998,
      title: language === 'vi' ? "Workshop Kỹ năng Viết sách" : "Book Writing Skills Workshop",
      titleEn: "Book Writing Skills Workshop", 
      description: language === 'vi' ? "Hướng dẫn kỹ năng viết và xuất bản sách chuyên nghiệp" : "Professional book writing and publishing skills guidance",
      descriptionEn: "Professional book writing and publishing skills guidance",
      date: "2024-12-25",
      time: "14:00",
      location: language === 'vi' ? "Khách sạn Lotte Hà Nội" : "Lotte Hotel Hanoi",
      locationEn: "Lotte Hotel Hanoi",
      participants: "50+ người tham gia",
      participantsEn: "50+ participants",
      status: "upcoming" as const,
      gradient: getCategoryColor("Đào tạo"),
      views: 890,
      registrations: 42,
      category: "Đào tạo",
      categoryEn: "Training",
      image: "/images/publishing-training.jpg"
    },
    {
      id: 997,
      title: language === 'vi' ? "Triển lãm Sách Thiếu nhi" : "Children's Book Exhibition",
      titleEn: "Children's Book Exhibition",
      description: language === 'vi' ? "Giới thiệu những cuốn sách hay dành cho trẻ em" : "Introducing great books for children",
      descriptionEn: "Introducing great books for children",
      date: "2024-12-30",
      time: "10:00",
      location: language === 'vi' ? "Trung tâm Triển lãm Giảng Võ" : "Giang Vo Exhibition Center",
      locationEn: "Giang Vo Exhibition Center",
      participants: "1000+ khách tham quan",
      participantsEn: "1000+ visitors",
      status: "upcoming" as const,
      gradient: getCategoryColor("Triển lãm"),
      views: 2150,
      registrations: 980,
      category: "Triển lãm",
      categoryEn: "Exhibition",
      image: "/images/book-exhibition.jpg"
    },
    {
      id: 996,
      title: language === 'vi' ? "Hội thảo Văn hóa đọc Việt Nam" : "Vietnam Reading Culture Conference",
      titleEn: "Vietnam Reading Culture Conference",
      description: language === 'vi' ? "Thảo luận về phát triển văn hóa đọc trong cộng đồng" : "Discussion on developing reading culture in the community",
      descriptionEn: "Discussion on developing reading culture in the community",
      date: "2024-11-15",
      time: "08:30",
      location: language === 'vi' ? "Thư viện Quốc gia Việt Nam" : "National Library of Vietnam",
      locationEn: "National Library of Vietnam",
      participants: "200 người tham gia",
      participantsEn: "200 participants",
      status: "completed" as const,
      gradient: getCategoryColor("Hội thảo"),
      views: 1580,
      registrations: 200,
      category: "Hội thảo",
      categoryEn: "Conference",
      image: "/images/reading-culture-development.jpg"
    },
    {
      id: 995,
      title: language === 'vi' ? "Gặp gỡ tác giả" : "Meet the Author",
      titleEn: "Meet the Author",
      description: language === 'vi' ? "Buổi gặp gỡ và trao đổi với các tác giả nổi tiếng" : "Meeting and exchanging with famous authors",
      descriptionEn: "Meeting and exchanging with famous authors",
      date: "2024-10-28",
      time: "15:00",
      location: language === 'vi' ? "Café Sách Hà Nội" : "Hanoi Book Cafe",
      locationEn: "Hanoi Book Cafe",
      participants: "80 người tham gia",
      participantsEn: "80 participants",
      status: "completed" as const,
      gradient: getCategoryColor("Gặp gỡ"),
      views: 945,
      registrations: 80,
      category: "Gặp gỡ",
      categoryEn: "Meeting",
      image: "/images/Gap go 2.jpg"
    }
  ]

  // Use real events if available, otherwise fallback
  const allEvents = events.length > 0 ? events : fallbackEvents

  // Filter events based on search term, category and status
  const filteredEvents = useMemo(() => {
    return allEvents
      .filter(item => {
        const matchesSearch = searchTerm === "" || 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesCategory = selectedCategory === "" || item.category === selectedCategory
        const matchesStatus = selectedStatus === "" || item.status === selectedStatus
        
        return matchesSearch && matchesCategory && matchesStatus
      })
      .sort((a, b) => {
        // Sort upcoming events by date (ascending), completed events by date (descending)
        if (selectedStatus === 'upcoming') {
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        } else {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        }
      })
  }, [allEvents, searchTerm, selectedCategory, selectedStatus])

  // Reset current page when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, selectedStatus])

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setSelectedStatus("upcoming")
    setCurrentPage(1)
  }

  // Active filters count
  const activeFiltersCount = (searchTerm ? 1 : 0) + (selectedCategory ? 1 : 0) + (selectedStatus !== "upcoming" ? 1 : 0)

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
                {language === 'vi' ? 'Sự kiện & Hoạt động' : 'Events & Activities'}
              </div>
              <h1 className="font-display mb-6">
                {/* Main Title */}
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-gray-900 leading-tight mb-2 lg:mb-4">
                  <span className="block">
                    {language === 'vi' ? 'Tham gia những' : 'Join the'}
                  </span>
                </div>

                {/* Highlight */}
                <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight mb-2 lg:mb-4">
                  <span className="gradient-text-primary font-bold">
                    {language === 'vi' ? 'Sự kiện đặc sắc' : 'Amazing Events'}
                  </span>
                </div>

                {/* Sub Title */}
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-gray-800 leading-tight">
                  <span className="block">
                    {language === 'vi' ? 'Phát triển văn hóa đọc' : 'Reading Culture Development'}
                  </span>
                </div>
              </h1>

              {/* Elegant Divider */}
              <div className="flex items-center justify-center mt-6 lg:mt-8 mb-6">
                <div className="w-16 lg:w-20 h-1 bg-gradient-to-r from-primary to-emerald-500 rounded-full"></div>
                <div className="w-3 h-3 bg-primary rounded-full mx-4 animate-pulse"></div>
                <div className="w-8 lg:w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"></div>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {language === 'vi' 
                  ? 'Khám phá và tham gia các sự kiện, hội thảo, workshop và hoạt động thú vị về văn hóa đọc và phát triển xuất bản'
                  : 'Explore and participate in exciting events, seminars, workshops and activities about reading culture and publishing development'
                }
              </p>
            </div>
          </div>
        </section>

        {/* Main Content - Two Column Layout */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left Column - Events Cards */}
              <div className="flex-1 lg:w-2/3">
                {paginatedEvents.length > 0 ? (
                  <>
                    {/* Events Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {paginatedEvents.map((event, index) => (
                        <div key={event.id} className="transform hover:scale-[1.02] transition-transform duration-200">
                          <Card className="border-0 shadow-minimal hover:shadow-soft transition-shadow duration-200 group h-full">
                            <div className="relative overflow-hidden rounded-t-lg">
                              {event.image ? (
                                <Image
                                  src={event.image}
                                  alt={event.title}
                                  width={400}
                                  height={200}
                                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className={`w-full h-48 bg-gradient-to-r ${getCategoryColor(event.category || '')} flex items-center justify-center`}>
                                  <Calendar className="w-16 h-16 text-white/80" />
                                </div>
                              )}
                              <div className="absolute top-4 left-4">
                                <Badge 
                                  className={`
                                    px-2 py-1 text-xs font-medium rounded-full border-0
                                    ${event.status === 'upcoming' ? 'bg-green-100 text-green-800' : 
                                      event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                                      event.status === 'completed' ? 'bg-gray-100 text-gray-800' : 
                                      'bg-red-100 text-red-800'}
                                  `}
                                >
                                  {event.status === 'upcoming' ? (language === 'vi' ? 'Sắp diễn ra' : 'Upcoming') :
                                   event.status === 'ongoing' ? (language === 'vi' ? 'Đang diễn ra' : 'Ongoing') :
                                   event.status === 'completed' ? (language === 'vi' ? 'Đã kết thúc' : 'Completed') :
                                   (language === 'vi' ? 'Đã hủy' : 'Cancelled')}
                                </Badge>
                              </div>
                            </div>
                            <CardHeader className="p-4">
                              <CardTitle className="text-gray-900 text-lg leading-tight line-clamp-2">{event.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-4">
                              <div className="space-y-2 mb-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                                  <span>{new Date(event.date).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-2 text-primary" />
                                  <span>{event.time}</span>
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                                  <span className="line-clamp-1">{event.location}</span>
                                </div>
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-2 text-primary" />
                                  <span>{event.participants}</span>
                                </div>
                              </div>
                              <Button 
                                onClick={() => handleRegisterClick(event)}
                                disabled={event.status !== 'upcoming'}
                                className={`w-full py-2 rounded-lg font-medium text-sm ${
                                  event.status === 'upcoming' 
                                    ? 'bg-primary hover:bg-primary/90 text-white' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                {event.status === 'upcoming' 
                                  ? (language === 'vi' ? 'Đăng ký tham gia' : 'Register')
                                  : (language === 'vi' ? 'Đã kết thúc' : 'Completed')
                                }
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>

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
                  </>
                ) : (
                  /* No Results */
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {language === 'vi' ? 'Không tìm thấy sự kiện' : 'No events found'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {language === 'vi' 
                        ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                        : 'Try changing your search terms or filters'
                      }
                    </p>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="outline"
                        onClick={resetFilters}
                        className="rounded-lg"
                      >
                        {language === 'vi' ? 'Xóa bộ lọc' : 'Clear filters'}
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column - Search & Filter Sidebar */}
              <div className="lg:w-1/3">
                <div className="sticky top-24">
                  {/* Search & Filter Card */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Search className="w-5 h-5 mr-2 text-primary" />
                      {language === 'vi' ? 'Tìm kiếm & Lọc' : 'Search & Filter'}
                    </h3>
                    
                    {/* Search Input */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'vi' ? 'Từ khóa' : 'Keywords'}
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder={language === 'vi' ? 'Nhập từ khóa...' : 'Enter keywords...'}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 rounded-lg border-gray-200 focus:border-primary focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'vi' ? 'Trạng thái' : 'Status'}
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                          className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        >
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-700 text-sm truncate">
                              {statusOptions.find(s => s.value === selectedStatus)?.label || 'Tất cả'}
                            </span>
                          </div>
                          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Status Dropdown Menu */}
                        {isStatusDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-48 overflow-y-auto">
                            <div className="py-1">
                              {statusOptions.map((status) => (
                                <button
                                  key={status.value}
                                  onClick={() => {
                                    setSelectedStatus(status.value)
                                    setIsStatusDropdownOpen(false)
                                  }}
                                  className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm text-gray-700"
                                >
                                  {status.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'vi' ? 'Danh mục' : 'Category'}
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        >
                          <div className="flex items-center">
                            <Filter className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-700 text-sm truncate">
                              {selectedCategory || (language === 'vi' ? 'Tất cả danh mục' : 'All categories')}
                            </span>
                          </div>
                          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-48 overflow-y-auto">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setSelectedCategory("")
                                  setIsDropdownOpen(false)
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm text-gray-700"
                              >
                                {language === 'vi' ? 'Tất cả danh mục' : 'All categories'}
                              </button>
                              {categories.map((category) => (
                                <button
                                  key={category}
                                  onClick={() => {
                                    setSelectedCategory(category || "")
                                    setIsDropdownOpen(false)
                                  }}
                                  className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm text-gray-700"
                                >
                                  {category}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Clear Filters Button */}
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="outline"
                        onClick={resetFilters}
                        className="w-full rounded-lg border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
                      >
                        <X className="w-4 h-4 mr-2" />
                        {language === 'vi' ? 'Xóa bộ lọc' : 'Clear filters'}
                      </Button>
                    )}
                  </div>

                  {/* Results Summary */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                      {language === 'vi' ? 'Kết quả' : 'Results'}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {language === 'vi' ? 'Tổng số sự kiện:' : 'Total events:'}
                        </span>
                        <span className="font-semibold text-primary">{filteredEvents.length}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {language === 'vi' ? 'Trang hiện tại:' : 'Current page:'}
                        </span>
                        <span className="font-semibold text-gray-900">{currentPage} / {totalPages || 1}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {language === 'vi' ? 'Danh mục:' : 'Categories:'}
                        </span>
                        <span className="font-semibold text-gray-900">{categories.length}</span>
                      </div>
                    </div>

                    {/* Active Filters */}
                    {activeFiltersCount > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-600 mb-2">
                          {language === 'vi' ? 'Bộ lọc đang áp dụng:' : 'Active filters:'}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {searchTerm && (
                            <Badge className="bg-primary/10 text-primary border-0 px-2 py-1 rounded-md text-xs">
                              "{searchTerm}"
                              <button
                                onClick={() => setSearchTerm("")}
                                className="ml-1 hover:text-primary/70"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          )}
                          {selectedCategory && (
                            <Badge className="bg-primary/10 text-primary border-0 px-2 py-1 rounded-md text-xs">
                              {selectedCategory}
                              <button
                                onClick={() => setSelectedCategory("")}
                                className="ml-1 hover:text-primary/70"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          )}
                          {selectedStatus !== "upcoming" && (
                            <Badge className="bg-primary/10 text-primary border-0 px-2 py-1 rounded-md text-xs">
                              {statusOptions.find(s => s.value === selectedStatus)?.label}
                              <button
                                onClick={() => setSelectedStatus("upcoming")}
                                className="ml-1 hover:text-primary/70"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-emerald-50 rounded-2xl border border-primary/20 p-6 shadow-lg">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500 rounded-full translate-y-12 -translate-x-12"></div>
                    </div>
                    
                    <div className="relative z-10">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
                          <BarChart3 className="w-4 h-4 text-primary" />
                        </div>
                        {language === 'vi' ? 'Thống kê nhanh' : 'Quick Stats'}
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Total Events */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-700">
                                  {language === 'vi' ? 'Tổng sự kiện' : 'Total Events'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {language === 'vi' ? 'Tất cả sự kiện' : 'All events'}
                                </div>
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-primary">
                              {allEvents.length}
                            </div>
                          </div>
                        </div>

                        {/* Upcoming Events */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-700">
                                  {language === 'vi' ? 'Sắp diễn ra' : 'Upcoming'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {language === 'vi' ? 'Sự kiện sắp tới' : 'Upcoming events'}
                                </div>
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                              {allEvents.filter(e => e.status === 'upcoming').length}
                            </div>
                          </div>
                        </div>

                        {/* Total Registrations */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-emerald-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-700">
                                  {language === 'vi' ? 'Lượt đăng ký' : 'Registrations'}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {language === 'vi' ? 'Tổng đăng ký' : 'Total registrations'}
                                </div>
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-emerald-600">
                              {allEvents.reduce((sum, event) => sum + (event.registrations || 0), 0)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
