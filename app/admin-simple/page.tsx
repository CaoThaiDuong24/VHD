'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SimpleAdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken')
    const userStr = localStorage.getItem('adminUser')
    
    if (!token || !userStr) {
      router.push('/simple-login')
      return
    }
    
    try {
      const tokenData = JSON.parse(atob(token))
      if (tokenData.expires < Date.now()) {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        router.push('/simple-login')
        return
      }
      
      const userData = JSON.parse(userStr)
      setUser(userData)
    } catch (error) {
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
      router.push('/simple-login')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/simple-login')
  }

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid rgba(255,255,255,0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '30px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white'
        }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: 'bold' }}>
              🎛️ Admin Dashboard
            </h1>
            <p style={{ margin: 0, opacity: 0.9 }}>
              Xin chào <strong>{user.name || 'Admin'}</strong>! Chào mừng đến với bảng điều khiển.
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.2)'}
          >
            🚪 Đăng xuất
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {[
          { title: 'Tổng tin tức', value: '24', icon: '📰', color: '#4F46E5' },
          { title: 'Sự kiện', value: '8', icon: '📅', color: '#059669' },
          { title: 'Lượt xem', value: '1.2K', icon: '👁️', color: '#7C3AED' },
          { title: 'Người dùng', value: '156', icon: '👥', color: '#DC2626' }
        ].map((stat, index) => (
          <div key={index} style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>
              {stat.icon}
            </div>
            <h3 style={{ 
              margin: '0 0 5px 0', 
              fontSize: '24px', 
              fontWeight: 'bold',
              color: stat.color 
            }}>
              {stat.value}
            </h3>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
              {stat.title}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '10px',
        padding: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <h2 style={{ 
          color: 'white', 
          margin: '0 0 20px 0',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          🚀 Thao tác nhanh
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          {[
            { title: 'Tạo tin tức', href: '/admin/news/create', icon: '✍️', desc: 'Viết bài mới' },
            { title: 'Quản lý tin tức', href: '/admin/news', icon: '📋', desc: 'Xem tất cả bài viết' },
            { title: 'Tạo sự kiện', href: '/admin/events/create', icon: '🎉', desc: 'Tổ chức sự kiện' },
            { title: 'Quản lý sự kiện', href: '/admin/events', icon: '📆', desc: 'Xem tất cả sự kiện' }
          ].map((action, index) => (
            <Link 
              key={index} 
              href={action.href}
              style={{
                display: 'block',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '15px',
                textDecoration: 'none',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.25)';
                (e.target as HTMLElement).style.transform = 'translateY(-2px)'
              }}
              onMouseOut={(e) => {
                (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.15)';
                (e.target as HTMLElement).style.transform = 'translateY(0)'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                {action.icon}
              </div>
              <h3 style={{ 
                margin: '0 0 5px 0', 
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                {action.title}
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: '12px', 
                opacity: 0.8 
              }}>
                {action.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
} 