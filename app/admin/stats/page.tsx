"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Users, 
  Eye, 
  TrendingUp, 
  FileText, 
  BookOpen,
  Activity,
  BarChart3,
  PieChart,
  Download,
  RefreshCw
} from 'lucide-react'
import { useEvents } from '@/contexts/EventsContext'
import { useNews } from '@/contexts/NewsContext'
import { useState, useEffect } from 'react'

export default function AdminStatsPage() {
  const { events, getTotalViews: getEventViews, getTotalRegistrations } = useEvents()
  const { newsItems } = useNews()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Calculate statistics
  const totalEvents = events.length
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length
  const ongoingEvents = events.filter(e => e.status === 'ongoing').length
  const completedEvents = events.filter(e => e.status === 'completed').length
  const totalEventViews = getEventViews()
  const totalRegistrations = getTotalRegistrations()

  const totalNews = newsItems.length
  const publishedNews = newsItems.filter(n => n.status === 'published').length
  const draftNews = newsItems.filter(n => n.status === 'draft').length
  const totalNewsViews = newsItems.reduce((sum, item) => sum + (item.views || 0), 0)

  // Get recent activity
  const recentEvents = events.slice(0, 5)
  const recentNews = newsItems.slice(0, 5)

  // Monthly data for trends
  const currentMonth = new Date().getMonth()
  const monthlyEventData = Array.from({ length: 12 }, (_, i) => {
    const monthEvents = events.filter(e => {
      const eventDate = new Date(e.date)
      return eventDate.getMonth() === i
    }).length
    return { month: i, events: monthEvents }
  })

  const monthlyNewsData = Array.from({ length: 12 }, (_, i) => {
    const monthNews = newsItems.filter(n => {
      const createdDate = new Date(n.date)
      return createdDate.getMonth() === i
    }).length
    return { month: i, news: monthNews }
  })

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const exportData = () => {
    const data = {
      events: {
        total: totalEvents,
        upcoming: upcomingEvents,
        ongoing: ongoingEvents,
        completed: completedEvents,
        totalViews: totalEventViews,
        totalRegistrations: totalRegistrations
      },
      news: {
        total: totalNews,
        published: publishedNews,
        draft: draftNews,
        totalViews: totalNewsViews
      },
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `admin-stats-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const monthNames = [
    'T1', 'T2', 'T3', 'T4', 'T5', 'T6',
    'T7', 'T8', 'T9', 'T10', 'T11', 'T12'
  ]

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Thống kê tổng quan
          </h1>
          <p className="text-gray-600 mt-1">Dashboard quản lý và phân tích dữ liệu</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="hover:scale-105 transition-transform duration-200"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button 
            onClick={exportData}
            className="bg-gradient-to-r from-blue-500 to-emerald-600 hover:from-blue-600 hover:to-emerald-700 hover:scale-105 transition-all duration-200"
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất dữ liệu
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-100 rounded-bl-full group-hover:scale-110 transition-transform duration-300"></div>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-500 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng sự kiện</p>
                <p className="text-2xl font-bold text-gray-900 animate-countUp">{totalEvents}</p>
                <p className="text-xs text-emerald-600 mt-1">
                  +{upcomingEvents} sắp diễn ra
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full group-hover:scale-110 transition-transform duration-300"></div>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Đăng ký</p>
                <p className="text-2xl font-bold text-gray-900 animate-countUp">{totalRegistrations}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Từ {totalEvents} sự kiện
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full group-hover:scale-110 transition-transform duration-300"></div>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-600 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Tin tức</p>
                <p className="text-2xl font-bold text-gray-900 animate-countUp">{totalNews}</p>
                <p className="text-xs text-blue-600 mt-1">
                  {publishedNews} đã xuất bản
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100 rounded-bl-full group-hover:scale-110 transition-transform duration-300"></div>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-amber-600 rounded-lg">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Lượt xem</p>
                <p className="text-2xl font-bold text-gray-900 animate-countUp">
                  {(totalEventViews + totalNewsViews).toLocaleString()}
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  Tổng tất cả nội dung
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events Breakdown */}
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-emerald-600" />
              Phân tích sự kiện
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Sắp diễn ra</span>
                </div>
                <span className="text-lg font-bold text-emerald-600">{upcomingEvents}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Đang diễn ra</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{ongoingEvents}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Đã hoàn thành</span>
                </div>
                <span className="text-lg font-bold text-gray-600">{completedEvents}</span>
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tổng lượt xem sự kiện:</span>
                  <span className="font-semibold">{totalEventViews.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Tổng đăng ký:</span>
                  <span className="font-semibold">{totalRegistrations.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* News Breakdown */}
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              Phân tích tin tức
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Đã xuất bản</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{publishedNews}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Bản nháp</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">{draftNews}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-amber-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Tin nổi bật</span>
                </div>
                <span className="text-lg font-bold text-amber-600">
                  {newsItems.filter(n => n.featured).length}
                </span>
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tổng lượt xem tin tức:</span>
                  <span className="font-semibold">{totalNewsViews.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Trung bình mỗi bài:</span>
                  <span className="font-semibold">
                    {totalNews > 0 ? Math.round(totalNewsViews / totalNews).toLocaleString() : 0}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Events Trend */}
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
              Xu hướng sự kiện theo tháng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {monthlyEventData.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-sm font-medium w-8">{monthNames[item.month]}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${item.events > 0 ? (item.events / Math.max(...monthlyEventData.map(d => d.events)) * 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{item.events}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly News Trend */}
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Xu hướng tin tức theo tháng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {monthlyNewsData.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-sm font-medium w-8">{monthNames[item.month]}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${item.news > 0 ? (item.news / Math.max(...monthlyNewsData.map(d => d.news)) * 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{item.news}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-emerald-600" />
              Sự kiện gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEvents.length > 0 ? recentEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    event.status === 'upcoming' ? 'bg-emerald-500' :
                    event.status === 'ongoing' ? 'bg-blue-500' :
                    event.status === 'completed' ? 'bg-gray-500' : 'bg-red-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {event.date} • {event.views || 0} lượt xem
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Chưa có sự kiện nào
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent News */}
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Tin tức gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNews.length > 0 ? recentNews.map((news) => (
                <div key={news.id} className="flex items-start space-x-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    news.status === 'published' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {news.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {news.date} • {news.views || 0} lượt xem
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Chưa có tin tức nào
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 