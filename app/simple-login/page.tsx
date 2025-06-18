'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SimpleLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    captcha: ''
  })
  const [captchaData, setCaptchaData] = useState({ question: '', answer: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  // Generate simple captcha with multiple operations
  const generateCaptcha = () => {
    const operations = ['+', '-', '×']
    const operation = operations[Math.floor(Math.random() * operations.length)]
    
    let num1, num2, answer, question
    
    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 15) + 1
        num2 = Math.floor(Math.random() * 15) + 1
        answer = num1 + num2
        question = `${num1} + ${num2}`
        break
      case '-':
        num1 = Math.floor(Math.random() * 15) + 10
        num2 = Math.floor(Math.random() * num1) + 1
        answer = num1 - num2
        question = `${num1} - ${num2}`
        break
      case '×':
        num1 = Math.floor(Math.random() * 8) + 2
        num2 = Math.floor(Math.random() * 8) + 2
        answer = num1 * num2
        question = `${num1} × ${num2}`
        break
      default:
        num1 = Math.floor(Math.random() * 10) + 1
        num2 = Math.floor(Math.random() * 10) + 1
        answer = num1 + num2
        question = `${num1} + ${num2}`
    }
    
    setCaptchaData({ question, answer })
    setFormData(prev => ({ ...prev, captcha: '' }))
  }

  useEffect(() => {
    generateCaptcha()
  }, [])

  // Auto hide error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Auto hide success after 3 seconds (before redirect)
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Validate captcha
      const userAnswer = parseInt(formData.captcha.trim())
      if (isNaN(userAnswer) || userAnswer !== captchaData.answer) {
        setError('Captcha không chính xác')
        generateCaptcha()
        return
      }

      // Check credentials
      if (formData.email.trim() === 'designer1@ltacv.com' && formData.password === 'Duong@240499') {
        // Generate token
        const token = btoa(JSON.stringify({
          email: formData.email,
          timestamp: Date.now(),
          expires: Date.now() + (24 * 60 * 60 * 1000)
        }))
        
        // Store token
        localStorage.setItem('adminToken', token)
        localStorage.setItem('adminUser', JSON.stringify({
          email: formData.email,
          name: 'Admin Designer',
          role: 'Administrator'
        }))
        
        // Set cookie
        document.cookie = `adminToken=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`
        
        setSuccess('✅ Đăng nhập thành công!')
        
        // Redirect after delay
        setTimeout(() => {
          window.location.href = '/admin'
        }, 1200)
        
      } else {
        setError('Email hoặc mật khẩu không chính xác')
        generateCaptcha()
      }
    } catch (error) {
      setError('Có lỗi xảy ra')
      generateCaptcha()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gray-100 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-emerald-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-2000"></div>
      </div>

      {/* Login Card */}
      <div className="relative bg-white border border-gray-200 rounded-xl shadow-lg p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo - matching admin design */}
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary via-blue-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
            <img 
              src="/images/rcp-logo.png" 
              alt="Logo"
              className="w-10 h-10 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling!.classList.remove('hidden');
              }}
            />
            <span className="text-white font-bold text-xl hidden">RCP</span>
          </div>
          
          <h1 className="text-xl font-bold text-primary mb-2">Chào mừng trở lại</h1>
          <p className="text-gray-500 text-sm">Đăng nhập để truy cập hệ thống quản trị</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ email
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="designer1@ltacv.com"
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                required
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                required
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Captcha Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Xác thực
            </label>
            <div className="flex gap-3 items-center">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={formData.captcha}
                  onChange={(e) => setFormData(prev => ({ ...prev, captcha: e.target.value }))}
                  placeholder="Nhập kết quả"
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-center min-w-[80px]">
                <span className="text-lg font-bold text-gray-800">{captchaData.question}</span>
              </div>
              <button
                type="button"
                onClick={generateCaptcha}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-200"
                title="Tạo captcha mới"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>



          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang đăng nhập...</span>
              </div>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            Bằng việc đăng nhập, bạn đồng ý với{' '}
            <a href="#" className="text-primary hover:underline">Điều khoản sử dụng</a>
            {' '}và{' '}
            <a href="#" className="text-primary hover:underline">Chính sách bảo mật</a>
          </p>
        </div>
      </div>

      {/* Toast Notifications - Fixed position at top right */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {/* Error Toast */}
        {error && (
          <div className="bg-white border border-red-200 rounded-lg shadow-lg p-4 flex items-start gap-3 max-w-sm transform transition-all duration-300 ease-in-out animate-in slide-in-from-right">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-red-800 mb-1">Đăng nhập thất bại</h4>
              <p className="text-sm text-red-600">{error}</p>
              <p className="text-xs text-red-500 mt-1">Vui lòng kiểm tra lại thông tin và thử lại</p>
            </div>
            <button
              onClick={() => setError('')}
              className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Success Toast */}
        {success && (
          <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4 flex items-start gap-3 max-w-sm transform transition-all duration-300 ease-in-out animate-in slide-in-from-right">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-green-800 mb-1">Đăng nhập thành công!</h4>
              <p className="text-sm text-green-600">{success}</p>
              <p className="text-xs text-green-500 mt-1">Đang chuyển hướng đến trang quản trị...</p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 