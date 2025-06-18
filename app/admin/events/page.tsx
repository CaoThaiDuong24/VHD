"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Users, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  XCircle
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useEvents } from '@/contexts/EventsContext'
import { useRouter } from 'next/navigation'

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

// Function to get status color
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'upcoming':
      return 'bg-green-100 text-green-800'
    case 'ongoing':
      return 'bg-blue-100 text-blue-800'
    case 'completed':
      return 'bg-gray-100 text-gray-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Function to get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'upcoming':
      return <Calendar className="h-3 w-3" />
    case 'ongoing':
      return <Clock className="h-3 w-3" />
    case 'completed':
      return <CheckCircle className="h-3 w-3" />
    case 'cancelled':
      return <XCircle className="h-3 w-3" />
    default:
      return <AlertCircle className="h-3 w-3" />
  }
}

// Function to get status label
const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'upcoming':
      return 'Sắp diễn ra'
    case 'ongoing':
      return 'Đang diễn ra'
    case 'completed':
      return 'Đã kết thúc'
    case 'cancelled':
      return 'Đã hủy'
    default:
      return 'Không xác định'
  }
}

export default function AdminEventsPage() {
  const { events, getTotalViews, getTotalRegistrations, deleteEvent } = useEvents()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const router = useRouter()

  // Ensure events is always an array
  const eventsArray = events || []

  // Filter events based on search and filters
  const filteredEvents = eventsArray.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.titleEn && event.titleEn.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.descriptionEn && event.descriptionEn.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || 
                           event.category === categoryFilter || 
                           (event.categoryEn && event.categoryEn === categoryFilter)
    return matchesSearch && matchesStatus && matchesCategory
  })

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage)

  // Get unique categories
  const categories = Array.from(new Set(eventsArray.flatMap((event) => 
    [event.category, event.categoryEn].filter(Boolean)
  )))

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      deleteEvent(id)
    }
  }

  const handleEdit = (id: number) => {
    router.push(`/admin/events/${id}/edit`)
  }

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, categoryFilter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sự kiện</h1>
          <p className="text-gray-600">Tạo, chỉnh sửa và quản lý các sự kiện sắp diễn ra</p>
        </div>
        <Button asChild>
          <Link href="/admin/events/create">
            <Plus className="h-4 w-4 mr-2" />
            Tạo sự kiện mới
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc và Tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm sự kiện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
                <SelectItem value="ongoing">Đang diễn ra</SelectItem>
                <SelectItem value="completed">Đã kết thúc</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.filter(Boolean).map((category) => (
                  <SelectItem key={category} value={category as string}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setCategoryFilter('all')
                setCurrentPage(1)
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Tổng sự kiện</p>
                <p className="text-xl font-bold">{eventsArray.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Sắp diễn ra</p>
                <p className="text-xl font-bold">{eventsArray.filter(e => e.status === 'upcoming').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Đã kết thúc</p>
                <p className="text-xl font-bold">{eventsArray.filter(e => e.status === 'completed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Tổng đăng ký</p>
                <p className="text-xl font-bold">{getTotalRegistrations()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Lượt xem</p>
                <p className="text-xl font-bold">{getTotalViews().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách sự kiện ({filteredEvents.length})</CardTitle>
            {filteredEvents.length !== eventsArray.length && (
              <Badge variant="secondary">
                Đang lọc: {filteredEvents.length}/{eventsArray.length}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {eventsArray.length === 0 ? 'Chưa có sự kiện nào' : 'Không tìm thấy sự kiện nào'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {eventsArray.length === 0 
                    ? 'Bắt đầu bằng cách tạo sự kiện đầu tiên của bạn'
                    : 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                  }
                </p>
                {eventsArray.length === 0 ? (
                  <Button asChild>
                    <Link href="/admin/events/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Tạo sự kiện mới
                    </Link>
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('all')
                      setCategoryFilter('all')
                      setCurrentPage(1)
                    }}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Xóa bộ lọc
                  </Button>
                )}
              </div>
            ) : (
              <>
                {paginatedEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex-shrink-0">
                      {event.image ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${getCategoryColor(event.category || '')} flex items-center justify-center`}>
                          <Calendar className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {event.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {event.date} - {event.time}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {event.participants}
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {event.views || 0} lượt xem
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(event.status)}`}>
                              {getStatusIcon(event.status)}
                              <span className="ml-1">{getStatusLabel(event.status)}</span>
                            </span>
                            {event.category && (
                              <Badge 
                                variant="outline" 
                                className={`text-xs bg-gradient-to-r ${getCategoryColor(event.category)} text-white border-0`}
                              >
                                {event.category}
                              </Badge>
                            )}
                            {event.registrations !== undefined && (
                              <Badge variant="secondary" className="text-xs">
                                {event.registrations} đăng ký
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Link href={`/events`}>
                            <Button variant="ghost" size="sm" title="Xem sự kiện">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" asChild title="Chỉnh sửa">
                            <Link href={`/admin/events/${event.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(event.id)}
                            title="Xóa sự kiện"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Trước
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
                            className="w-10 h-10"
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
                    >
                      Tiếp
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 