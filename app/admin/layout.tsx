"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  FileText, 
  Calendar, 
  Settings, 
  Menu, 
  X,
  Users,
  BarChart3,
  Plus,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type React from "react"

const sidebarItems = [
  {
    title: 'Trang chủ quản lý',
    href: '/admin',
    icon: Home
  },
  {
    title: 'Tin tức',
    href: '/admin/news',
    icon: FileText
  },
  {
    title: 'Sự kiện',
    href: '/admin/events',
    icon: Calendar
  },
  {
    title: 'Thống kê',
    href: '/admin/stats',
    icon: BarChart3
  },
  {
    title: 'Người dùng',
    href: '/admin/users',
    icon: Users
  },
  {
    title: 'Cài đặt',
    href: '/admin/settings',
    icon: Settings
  }
]

interface User {
  email: string
  name: string
  role: string
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const pathname = usePathname()

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Load user information
  useEffect(() => {
    const userStr = localStorage.getItem('adminUser')
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        setUser(userData)
      } catch (error) {
        console.error('Failed to parse user data:', error)
      }
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (userMenuOpen && !target.closest('[data-dropdown-container]')) {
        console.log('🔄 Click outside dropdown - closing')
        setUserMenuOpen(false)
      }
    }

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userMenuOpen])

  // DEBUG: Log current pathname for menu active state
  useEffect(() => {
    console.log('🔍 Current pathname:', pathname)
    console.log('🎯 Active menu status:')
    sidebarItems.forEach(item => {
      const isActive = item.href === '/admin' 
        ? pathname === '/admin'
        : pathname.startsWith(item.href)
      console.log(`  - ${item.title}: ${isActive ? '✅ ACTIVE' : '❌ inactive'}`)
    })
  }, [pathname])

  // No dropdown menu anymore - removed all dropdown related useEffects

  // SIMPLE WORKING LOGOUT FUNCTION
  const simpleLogout = () => {
    console.log('🚪 Simple logout function called')
    try {
      localStorage.clear()
      sessionStorage.clear()
      document.cookie = 'adminToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
      document.cookie = 'adminUser=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
      console.log('✅ Data cleared successfully')
      alert('Đăng xuất thành công!')
      window.location.href = '/simple-login'
    } catch (error) {
      console.error('❌ Logout error:', error)
      window.location.href = '/simple-login'
    }
  }

  // EMERGENCY LOGOUT - SIMPLE VERSION
  const emergencyLogout = () => {
    console.log('🚨 EMERGENCY LOGOUT STARTED')
    
    // Clear everything immediately without questions
    localStorage.clear()
    sessionStorage.clear()
    
    // Clear all cookies
    document.cookie = 'adminToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    document.cookie = 'adminUser=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    
    console.log('🔄 EMERGENCY REDIRECT TO LOGIN')
    window.location.href = '/simple-login'
  }

  const handleLogout = () => {
    console.log('🚪 Regular logout function called')
    
    if (confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
      console.log('✅ User confirmed - calling emergency logout')
      emergencyLogout()
    }
  }

  // NEW: Beautiful logout function
  const performLogout = () => {
    console.log('🚪 Beautiful logout starting...')
    try {
      // Clear all data
      localStorage.clear()
      sessionStorage.clear()
      
      // Clear cookies
      document.cookie = 'adminToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
      document.cookie = 'adminUser=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
      
      console.log('✅ Logout successful - redirecting...')
      
      // Smooth transition to login
      setTimeout(() => {
        window.location.href = '/simple-login'
      }, 500)
      
    } catch (error) {
      console.error('❌ Logout error:', error)
      window.location.href = '/simple-login'
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gray-50 border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 flex flex-col
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Logo Trung tâm */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-blue-500 to-emerald-500 flex items-center justify-center shadow-sm">
              <img 
                src="/images/rcp-logo.png" 
                alt="RCP Logo"
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  // Fallback to text logo if image fails
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling!.classList.remove('hidden');
                }}
              />
              <span className="text-white font-bold text-xs hidden">RCP</span>
            </div>
            <h1 className="text-lg font-bold text-primary">Admin Panel</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <nav className="mt-4 px-4">
            <div className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                // IMPROVED: Better active logic for exact and nested routes
                const isActive = (() => {
                  // Exact match for admin home page
                  if (item.href === '/admin') {
                    return pathname === '/admin'
                  }
                  
                  // For other routes, check if pathname starts with href
                  return pathname.startsWith(item.href)
                })()
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 relative
                      ${isActive 
                        ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg ring-2 ring-primary/30 transform scale-[1.02]' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:scale-[1.02]'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {/* Left border indicator for active item */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                    )}
                    
                    <Icon className={`mr-3 h-4 w-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    {item.title}
                    {isActive && (
                      <div className="ml-auto flex items-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-xs opacity-75">●</span>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Quick Actions */}
          <div className="mt-4 px-4 pb-4">
            <div className="bg-gradient-to-r from-primary to-emerald-500 rounded-lg p-3 text-white">
              <h3 className="font-medium mb-2 text-xs">Thao tác nhanh</h3>
              <div className="space-y-1.5">
                <Link 
                  href="/admin/news/create"
                  className="flex items-center text-xs hover:underline transition-all duration-200 hover:bg-white/10 rounded px-2 py-1"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Plus className="h-3 w-3 mr-2" />
                  Tạo tin tức mới
                </Link>
                <Link 
                  href="/admin/events/create"
                  className="flex items-center text-xs hover:underline transition-all duration-200 hover:bg-white/10 rounded px-2 py-1"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Plus className="h-3 w-3 mr-2" />
                  Tạo sự kiện mới
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-700">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500">{user?.role || 'Quản trị viên'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top bar - Enhanced Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-full px-6 lg:px-8">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="hidden lg:block w-1 h-8 bg-gradient-to-b from-primary to-emerald-500 rounded-full"></div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Bảng điều khiển
                  </h1>
                  <p className="text-sm text-gray-500 hidden sm:block">
                    Hệ thống quản lý nội dung
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              

              
              {/* Clock Display */}
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex flex-col items-end">
                  <div className="text-sm font-bold text-gray-900 tabular-nums">
                    {currentTime.toLocaleTimeString('vi-VN', { 
                      hour12: false,
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {currentTime.toLocaleDateString('vi-VN', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric'
                    })}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <div className="text-xs text-emerald-600 font-medium">Live</div>
                </div>
              </div>

              {/* User Dropdown Menu */}
              <div className="relative" data-dropdown-container>
                {/* User Button - Click to toggle dropdown */}
                <button
                  type="button"
                  className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    console.log('🔄 User button clicked, current state:', userMenuOpen)
                    setUserMenuOpen(!userMenuOpen)
                  }}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary via-blue-500 to-emerald-500 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || 'Admin User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.role || 'Quản trị viên'}
                    </p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary via-blue-500 to-emerald-500 flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {user?.name || 'Admin User'}
                          </p>
                          <p className="text-xs text-gray-600">
                            {user?.email || 'admin@example.com'}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-green-600 font-medium">Đang hoạt động</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        type="button"
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                        onClick={() => {
                          console.log('⚙️ Settings clicked')
                          setUserMenuOpen(false)
                        }}
                      >
                        <Settings className="h-4 w-4" />
                        Cài đặt tài khoản
                      </button>

                      <div className="border-t border-gray-100 my-1"></div>

                      <div className="px-4 py-2">
                        <p className="text-xs text-gray-500 mb-1">Phiên làm việc</p>
                        <p className="text-xs text-gray-700">
                          Đăng nhập lúc: {currentTime.toLocaleTimeString('vi-VN')}
                        </p>
                      </div>

                      <div className="border-t border-gray-100 my-1"></div>

                      {/* LOGOUT BUTTON INSIDE DROPDOWN */}
                      <button
                        type="button"
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
                        onClick={() => {
                          console.log('🚪 DROPDOWN LOGOUT CLICKED!')
                          setUserMenuOpen(false) // Close dropdown first
                          setShowLogoutModal(true) // Show beautiful modal
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 py-8 px-6 lg:px-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Beautiful Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop with blur effect */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-md w-full mx-4 transform scale-100 transition-all duration-300">
            {/* Header with gradient */}
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <LogOut className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Xác nhận đăng xuất
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản trị không? 
                Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng.
              </p>
            </div>

            {/* User info in modal */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-emerald-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || 'admin@example.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              {/* Cancel button */}
              <button
                type="button"
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors duration-200"
                onClick={() => {
                  console.log('❌ Logout cancelled')
                  setShowLogoutModal(false)
                }}
              >
                Hủy bỏ
              </button>

              {/* Confirm logout button */}
              <button
                type="button"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                onClick={() => {
                  console.log('✅ Logout confirmed')
                  setShowLogoutModal(false)
                  performLogout()
                }}
              >
                Đăng xuất
              </button>
            </div>

            {/* Close button */}
            <button
              type="button"
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
              onClick={() => setShowLogoutModal(false)}
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutContent>{children}</AdminLayoutContent>
} 