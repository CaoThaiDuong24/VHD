'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, RefreshCw, Shield } from 'lucide-react'

interface CaptchaData {
  question: string
  answer: number
}

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    captcha: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [captchaData, setCaptchaData] = useState<CaptchaData>({ question: '', answer: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  // Generate captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    const operators = ['+', '-', '*']
    const operator = operators[Math.floor(Math.random() * operators.length)]
    
    const question = `${num1} ${operator} ${num2}`
    let answer = 0
    
    switch (operator) {
      case '+':
        answer = num1 + num2
        break
      case '-':
        answer = num1 - num2
        break
      case '*':
        answer = num1 * num2
        break
    }
    
    setCaptchaData({ question, answer })
  }

  useEffect(() => {
    generateCaptcha()
    
    // Check if already logged in
    const token = localStorage.getItem('adminToken')
    if (token) {
      router.push('/admin')
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear errors when user starts typing
    if (error) setError('')
  }

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Vui lòng nhập email')
      return false
    }
    
    if (!formData.password.trim()) {
      setError('Vui lòng nhập mật khẩu')
      return false
    }
    
    if (!formData.captcha.trim()) {
      setError('Vui lòng nhập captcha')
      return false
    }
    
    if (parseInt(formData.captcha) !== captchaData.answer) {
      setError('Captcha không chính xác')
      generateCaptcha() // Generate new captcha
      setFormData(prev => ({ ...prev, captcha: '' }))
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setError('')
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Check credentials
      if (formData.email === 'designer1@ltacv.com' && formData.password === 'Duong@240499') {
        // Generate token
        const token = btoa(JSON.stringify({
          email: formData.email,
          timestamp: Date.now(),
          expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        }))
        
        // Store token in both localStorage and cookies
        localStorage.setItem('adminToken', token)
        localStorage.setItem('adminUser', JSON.stringify({
          email: formData.email,
          name: 'Admin Designer',
          role: 'Administrator'
        }))
        
        // Set cookie for server-side authentication
        document.cookie = `adminToken=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`
        
        setSuccess('Đăng nhập thành công! Đang chuyển hướng...')
        
        // Redirect to admin dashboard
        setTimeout(() => {
          router.push('/admin')
        }, 1000)
        
      } else {
        setError('Email hoặc mật khẩu không chính xác')
        generateCaptcha() // Generate new captcha
        setFormData(prev => ({ ...prev, captcha: '' }))
      }
    } catch (error) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Đăng nhập Admin
          </CardTitle>
          <p className="text-gray-600 text-sm mt-2">
            Truy cập vào bảng điều khiển quản trị
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="designer1@ltacv.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Mật khẩu
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Captcha Field */}
            <div className="space-y-2">
              <Label htmlFor="captcha" className="text-sm font-medium text-gray-700">
                Xác thực Captcha
              </Label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center space-x-3">
                  <div className="bg-gray-100 px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 text-center font-mono text-lg font-bold text-gray-800 min-w-[120px]">
                    {captchaData.question} = ?
                  </div>
                  <Input
                    id="captcha"
                    name="captcha"
                    type="number"
                    value={formData.captcha}
                    onChange={handleInputChange}
                    placeholder="Kết quả"
                    className="w-20 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="button"
                  onClick={generateCaptcha}
                  variant="outline"
                  size="icon"
                  className="px-3 py-3 h-12 w-12 border-gray-300 hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Nhấn nút làm mới để tạo captcha mới
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-700">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xác thực...</span>
                </div>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Thông tin đăng nhập demo:</h4>
            <div className="space-y-1 text-xs text-blue-700">
              <p><strong>Email:</strong> designer1@ltacv.com</p>
              <p><strong>Mật khẩu:</strong> Duong@240499</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  )
} 