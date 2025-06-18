"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNews } from '@/contexts/NewsContext'
import { useEvents } from '@/contexts/EventsContext'

interface User {
  email: string
  name: string
  role: string
}

interface WeatherData {
  location: string
  temperature: number
  condition: string
  icon: string
  humidity: number
  windSpeed: number
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  time: string
  read: boolean
}

export default function AdminDashboard() {
  const router = useRouter()
  const { newsItems } = useNews()
  const { events, getTotalViews, getTotalRegistrations } = useEvents()
  
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [weather, setWeather] = useState<WeatherData>({
    location: 'Hồ Chí Minh',
    temperature: 28,
    condition: 'Nắng đẹp',
    icon: '☀️',
    humidity: 65,
    windSpeed: 12
  })
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Tin tức mới cần duyệt',
      message: `${newsItems.filter(news => news.status === 'draft').length} bài viết đang chờ phê duyệt`,
      type: 'warning',
      time: '5 phút trước',
      read: false
    },
    {
      id: '2',
      title: 'Sao lưu hoàn tất',
      message: 'Dữ liệu đã được sao lưu thành công',
      type: 'success',
      time: '1 giờ trước',
      read: false
    },
    {
      id: '3',
      title: 'Cập nhật hệ thống',
      message: 'Phiên bản 2.1.1 đã có sẵn',
      type: 'info',
      time: '3 giờ trước',
      read: true
    }
  ])

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('adminToken')
        const userStr = localStorage.getItem('adminUser')
        
        if (!token || !userStr) {
          router.push('/simple-login')
          return
        }
        
        // Verify token
        const tokenData = JSON.parse(atob(token))
        if (tokenData.expires < Date.now()) {
          localStorage.removeItem('adminToken')
          localStorage.removeItem('adminUser')
          router.push('/simple-login')
          return
        }
        
        const userData = JSON.parse(userStr)
        setUser(userData)
        setIsLoading(false)
      } catch (error) {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        router.push('/simple-login')
      }
    }

    checkAuth()
  }, [router])

  // Dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    localStorage.setItem('adminDarkMode', JSON.stringify(!isDarkMode))
  }

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('adminDarkMode')
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dashboard...</p>
        </div>
      </div>
    )
  }

  const themeClasses = isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
  const cardBg = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
  const textSecondary = isDarkMode ? 'text-gray-300' : 'text-gray-600'

  // Calculate real statistics
  const totalNews = newsItems.length
  const publishedNews = newsItems.filter(news => news.status === 'published').length
  const draftNews = newsItems.filter(news => news.status === 'draft').length
  const totalEvents = events.length
  const upcomingEvents = events.filter(event => event.status === 'upcoming').length
  const totalNewsViews = newsItems.reduce((sum, news) => sum + (news.views || 0), 0)
  const totalEventViews = getTotalViews()
  const totalViews = totalNewsViews + totalEventViews
  const totalRegistrations = getTotalRegistrations()

  // Format numbers for display
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  // Enhanced dashboard data with real analytics
  const dashboardStats = [
    { 
      title: 'Tổng tin tức', 
      value: totalNews.toString(), 
      change: publishedNews > draftNews ? '+12%' : '-5%',
      trend: publishedNews > draftNews ? 'up' : 'down',
      icon: '📰', 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: `${publishedNews} đã xuất bản, ${draftNews} nháp`,
      chartData: [Math.max(1, totalNews-6), Math.max(1, totalNews-5), Math.max(1, totalNews-4), Math.max(1, totalNews-3), Math.max(1, totalNews-2), Math.max(1, totalNews-1), totalNews]
    },
    { 
      title: 'Sự kiện', 
      value: totalEvents.toString(), 
      change: upcomingEvents > 0 ? '+8%' : '0%',
      trend: upcomingEvents > 0 ? 'up' : 'down',
      icon: '📅', 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: `${upcomingEvents} sắp diễn ra`,
      chartData: [Math.max(1, totalEvents-6), Math.max(1, totalEvents-5), Math.max(1, totalEvents-4), Math.max(1, totalEvents-3), Math.max(1, totalEvents-2), Math.max(1, totalEvents-1), totalEvents]
    },
    { 
      title: 'Lượt xem', 
      value: formatNumber(totalViews), 
      change: totalViews > 1000 ? '+23%' : '+5%',
      trend: 'up',
      icon: '👁️', 
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      description: `Tin tức: ${formatNumber(totalNewsViews)}, Sự kiện: ${formatNumber(totalEventViews)}`,
      chartData: [Math.max(10, totalViews-600), Math.max(20, totalViews-500), Math.max(30, totalViews-400), Math.max(40, totalViews-300), Math.max(50, totalViews-200), Math.max(60, totalViews-100), totalViews]
    },
    { 
      title: 'Đăng ký sự kiện', 
      value: formatNumber(totalRegistrations), 
      change: totalRegistrations > 500 ? '+15%' : '+3%',
      trend: 'up',
      icon: '👥', 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Tổng số đăng ký',
      chartData: [Math.max(10, totalRegistrations-600), Math.max(20, totalRegistrations-500), Math.max(30, totalRegistrations-400), Math.max(40, totalRegistrations-300), Math.max(50, totalRegistrations-200), Math.max(60, totalRegistrations-100), totalRegistrations]
    }
  ]

  const quickActions = [
    { 
      title: 'Tạo tin tức mới', 
      description: 'Thêm bài viết, tin tức',
      icon: '📝', 
      link: '/admin/news/create', 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      shortcut: 'Ctrl+N'
    },
    { 
      title: 'Quản lý tin tức', 
      description: 'Chỉnh sửa, xóa bài viết',
      icon: '📰', 
      link: '/admin/news', 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100',
      shortcut: 'Ctrl+M'
    },
    { 
      title: 'Tạo sự kiện mới', 
      description: 'Thêm sự kiện, hoạt động',
      icon: '🎉', 
      link: '/admin/events/create', 
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 hover:bg-amber-100',
      shortcut: 'Ctrl+E'
    },
    { 
      title: 'Analytics & Báo cáo', 
      description: 'Xem thống kê chi tiết',
      icon: '📊', 
      link: '/admin/analytics', 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      shortcut: 'Ctrl+A'
    }
  ]

  const recentActivities = [
    ...(newsItems.slice(0, 2).map((news, index) => ({
      action: `Tin tức "${news.title}" được ${news.status === 'published' ? 'xuất bản' : 'tạo'}`,
      time: index === 0 ? '2 giờ trước' : '4 giờ trước',
      icon: '📰',
      color: 'text-blue-600',
      user: news.author || 'Admin Designer',
      avatar: '👨‍💻'
    }))),
    ...(events.slice(0, 1).map((event, index) => ({
      action: `Sự kiện "${event.title}" được tạo`,
      time: '6 giờ trước',
      icon: '🎉',
      color: 'text-emerald-600',
      user: 'Admin Designer',
      avatar: '👨‍💻'
    }))),
    {
      action: `${totalRegistrations} người dùng đã đăng ký sự kiện`,
      time: '1 ngày trước',
      icon: '👥',
      color: 'text-amber-600',
      user: 'Hệ thống',
      avatar: '🤖'
    },
    { 
      action: 'Báo cáo tháng 12 được tạo', 
      time: '1 ngày trước', 
      icon: '📊', 
      color: 'text-purple-600',
      user: 'Admin Designer',
      avatar: '👨‍💻'
    }
  ]

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      <main className="p-8 max-w-8xl mx-auto">
        {/* Premium Header Section with Glassmorphism */}
        <div className={`rounded-3xl p-8 mb-8 border backdrop-blur-xl ${cardBg} relative overflow-hidden shadow-2xl`}>
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-blue-500/8 to-emerald-500/10"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Welcome Section - Enhanced */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-blue-500 to-emerald-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {user.name.charAt(0)}
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    Xin chào, {user.name}! 👋
                  </h1>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`p-3 rounded-xl border transition-all duration-300 ${cardBg} hover:shadow-lg hover:scale-105 backdrop-blur-sm`}
                  title="Toggle Dark Mode"
                >
                  {isDarkMode ? '☀️' : '🌙'}
                </button>
              </div>
              <p className={`text-xl ${textSecondary} mb-6 font-medium`}>
                {currentTime.toLocaleDateString('vi-VN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-4 h-4 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <span className={`text-base ${textSecondary} font-medium`}>Hệ thống hoạt động bình thường</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className={`text-base ${textSecondary} font-medium`}>Phiên bản v2.1.0</span>
                </div>
              </div>
            </div>
            
            {/* Premium Weather & Time Widget */}
            <div className={`rounded-2xl p-6 border ${cardBg} backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                    {weather.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{weather.temperature}°C</div>
                    <div className={`text-sm ${textSecondary} font-medium`}>{weather.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    {currentTime.toLocaleTimeString('vi-VN', { 
                      hour12: false,
                      hour: '2-digit', 
                      minute: '2-digit'
                    })}
                  </div>
                  <div className={`text-sm ${textSecondary} font-medium`}>
                    {weather.condition}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className={`flex items-center gap-2 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50/80'}`}>
                  <span className="text-blue-500">💧</span>
                  <span className="font-semibold">{weather.humidity}%</span>
                </div>
                <div className={`flex items-center gap-2 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50/80'}`}>
                  <span className="text-emerald-500">💨</span>
                  <span className="font-semibold">{weather.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid with Mini Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {dashboardStats.map((stat, index) => (
            <div
              key={index}
              className={`rounded-xl p-4 border ${cardBg} hover:shadow-lg transition-all duration-200 cursor-pointer group`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} ${stat.color} flex items-center justify-center text-lg`}>
                  {stat.icon}
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  stat.trend === 'up' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {stat.trend === 'up' ? '↗' : '↘'} {stat.change}
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className={`text-sm font-medium mb-1`}>{stat.title}</p>
                <p className={`text-xs ${textSecondary}`}>{stat.description}</p>
              </div>

              {/* Mini Chart */}
              <div className="mt-3 flex items-end gap-1 h-8">
                {stat.chartData.map((value, i) => (
                  <div
                    key={i}
                    className={`bg-gradient-to-t ${stat.bgColor.replace('50', '200')} rounded-sm flex-1 transition-all duration-300 group-hover:scale-110`}
                    style={{ height: `${(value / Math.max(...stat.chartData)) * 100}%` }}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Quick Actions */}
          <div className={`lg:col-span-2 rounded-xl p-6 border ${cardBg}`}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              🚀 Thao tác nhanh
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.link}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${action.bgColor} group`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{action.icon}</span>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${action.color} mb-1`}>
                        {action.title}
                      </h4>
                      <p className={`text-sm ${textSecondary} mb-2`}>
                        {action.description}
                      </p>
                      <div className={`text-xs ${textSecondary} flex items-center gap-1`}>
                        <span>⌨️</span>
                        <span>{action.shortcut}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className={`rounded-xl p-6 border ${cardBg}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                🔔 Thông báo
              </h3>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                    notification.read ? 'bg-gray-50 dark:bg-gray-700' : 'bg-blue-50 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      notification.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                      notification.type === 'success' ? 'bg-green-100 text-green-600' :
                      notification.type === 'error' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {notification.type === 'warning' ? '⚠️' :
                       notification.type === 'success' ? '✅' :
                       notification.type === 'error' ? '❌' : 'ℹ️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm mb-1">{notification.title}</p>
                      <p className={`text-xs ${textSecondary} mb-1`}>{notification.message}</p>
                      <p className={`text-xs ${textSecondary}`}>{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className={`rounded-xl p-6 border ${cardBg}`}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              📈 Hoạt động gần đây
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{activity.avatar}</span>
                    <span className={`text-lg ${activity.color}`}>{activity.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-1">{activity.action}</p>
                    <div className={`text-xs ${textSecondary} flex items-center gap-2`}>
                      <span>{activity.time}</span>
                      <span>•</span>
                      <span>{activity.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className={`rounded-xl p-6 border ${cardBg}`}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              💻 Trạng thái hệ thống
            </h3>
            <div className="space-y-4">
              {[
                { label: 'CPU Usage', value: '45%', status: 'good', icon: '💾' },
                { label: 'Memory', value: '68%', status: 'warning', icon: '🧠' },
                { label: 'Storage', value: '82%', status: 'critical', icon: '💿' },
                { label: 'Network', value: '99.9%', status: 'good', icon: '🌐' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{item.value}</span>
                    <div className={`w-3 h-3 rounded-full ${
                      item.status === 'good' ? 'bg-green-500' :
                      item.status === 'warning' ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-6 p-4 rounded-xl border ${cardBg} text-center ${textSecondary}`}>
          <p className="text-sm">
            © 2024 Trung tâm Reading Culture Platform | Phiên bản 2.1.0 | 
            <span className="ml-2">Cập nhật lần cuối: {currentTime.toLocaleString('vi-VN')}</span>
          </p>
        </div>
      </main>
    </div>
  )
}