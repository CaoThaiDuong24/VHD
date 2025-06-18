"use client"

import React, { useState, useEffect } from 'react'
import { useNews } from '@/contexts/NewsContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Clock,
  User,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Users,
  BarChart3
} from "lucide-react"
import Link from 'next/link'
import Image from 'next/image'
import { NewsItem } from '@/lib/newsData'
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
    'Research': 'from-purple-500 to-pink-500'
  }
  
  return categoryColors[category] || 'from-gray-500 to-gray-600'
}

// Function to get status color
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800'
    case 'draft':
      return 'bg-yellow-100 text-yellow-800'
    case 'completed':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Function to get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'published':
      return <CheckCircle className="h-3 w-3" />
    case 'draft':
      return <Clock className="h-3 w-3" />
    case 'completed':
      return <CheckCircle className="h-3 w-3" />
    default:
      return <AlertCircle className="h-3 w-3" />
  }
}

// Function to format view count
const formatViewCount = (views: number): string => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`
  }
  return views.toString()
}

export default function AdminNewsPage() {
  const { newsItems, deleteNews, isLoading } = useNews()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const router = useRouter()

  // Ensure newsItems is always an array
  const newsArray = newsItems || []

  // Filter news based on search and filters
  const filteredNews = newsArray.filter((item: NewsItem) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.titleEn.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || 
                           item.category === categoryFilter || 
                           item.categoryEn === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedNews = filteredNews.slice(startIndex, startIndex + itemsPerPage)

  // Get unique categories
  const categories = Array.from(new Set(newsArray.flatMap((item: NewsItem) => [item.category, item.categoryEn])))

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tin tức này?')) {
      await deleteNews(id)
    }
  }

  const handleEdit = (id: number) => {
    router.push(`/admin/news/${id}/edit`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý tin tức</h1>
          <p className="text-gray-600">Tạo, chỉnh sửa và quản lý các bài viết tin tức</p>
        </div>
        <Button asChild>
          <Link href="/admin/news/create">
            <Plus className="h-4 w-4 mr-2" />
            Tạo tin tức mới
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
                placeholder="Tìm kiếm tin tức..."
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
                <SelectItem value="published">Đã xuất bản</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((category: string) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Tổng tin tức</p>
                <p className="text-xl font-bold">{newsArray.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Đã xuất bản</p>
                <p className="text-xl font-bold">{newsArray.filter((item: NewsItem) => item.status === 'published').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Bản nháp</p>
                <p className="text-xl font-bold">{newsArray.filter((item: NewsItem) => item.status === 'draft').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Lượt xem</p>
                <p className="text-xl font-bold">{newsArray.reduce((sum: number, item: NewsItem) => sum + (item.views || 0), 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* News List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách tin tức ({filteredNews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNews.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có tin tức nào</h3>
                <p className="text-gray-600 mb-4">Bắt đầu bằng cách tạo tin tức đầu tiên của bạn</p>
                <Button asChild>
                  <Link href="/admin/news/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo tin tức mới
                  </Link>
                </Button>
              </div>
            ) : (
              paginatedNews.map((item) => (
                <div key={item.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex-shrink-0">
                    {item.image ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {item.date}
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {item.author || 'Admin'}
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {item.views || 0} lượt xem
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status || 'draft')}`}>
                            {item.status === 'published' ? 'Đã xuất bản' : 
                             item.status === 'draft' ? 'Bản nháp' : 
                             item.status === 'completed' ? 'Hoàn thành' : 'Không xác định'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Link href={`/news/${item.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/news/${item.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Trước
          </Button>
          
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  )
}