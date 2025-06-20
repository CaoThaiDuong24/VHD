'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Settings, 
  Save, 
  TestTube, 
  Cloud, 
  CloudOff,
  AlertCircle,
  CheckCircle,
  Info,
  RefreshCw,
  ExternalLink,
  Copy,
  AlertTriangle,
  Zap,
  Activity,
  Calendar
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useNews } from '@/contexts/NewsContext'
import { useEvents } from '@/contexts/EventsContext'
import AutoSyncManager from '@/components/ui/AutoSyncManager'
import DataImportManager from '@/components/ui/DataImportManager'

interface WordPressSettings {
  apiUrl: string
  username: string
  password: string
  enabled: boolean
}

interface TestResult {
  status: 'success' | 'error'
  message: string
  details?: string
  suggestions?: string[]
}

export default function WordPressSettingsPage() {
  const { toast } = useToast()
  const { 
    wpSyncEnabled, 
    toggleWordPressSync, 
    autoSyncEnabled, 
    toggleAutoSync, 
    bidirectionalSyncEnabled,
    toggleBidirectionalSync,
    lastSyncStatus,
    syncWithWordPress,
    syncFromWordPress,
    syncBidirectional,
    isLoading: isSyncing
  } = useNews()
  
  // Events sync controls
  const { 
    wpSyncEnabled: eventsWpSyncEnabled, 
    toggleWordPressSync: toggleEventsWordPressSync, 
    autoSyncEnabled: eventsAutoSyncEnabled, 
    toggleAutoSync: toggleEventsAutoSync, 
    lastSyncStatus: eventsLastSyncStatus,
    syncWithWordPress: syncEventsWithWordPress,
    isLoading: isEventsSyncing
  } = useEvents()
  
  const [settings, setSettings] = useState<WordPressSettings>({
    apiUrl: '',
    username: '',
    password: '',
    enabled: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('wordpressSettings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(parsed)
      } catch (error) {
        console.error('Error loading WordPress settings:', error)
      }
    }

    // 🚀 AUTO ENABLE SYNC SETTINGS - FIX FOR AUTO SYNC ISSUE
    console.log('🔧 Auto-enabling WordPress sync settings...')
    
    // Check current settings
    const currentWpSync = localStorage.getItem('wpSyncEnabled')
    const currentAutoSync = localStorage.getItem('autoSyncEnabled')
    const currentBidirectional = localStorage.getItem('bidirectionalSyncEnabled')
    
    // Auto enable if not already set
    if (currentWpSync !== 'true') {
      localStorage.setItem('wpSyncEnabled', 'true')
      console.log('✅ wpSyncEnabled set to true')
    }
    
    if (currentAutoSync !== 'true') {
      localStorage.setItem('autoSyncEnabled', 'true')
      console.log('✅ autoSyncEnabled set to true')
    }
    
    if (currentBidirectional !== 'true') {
      localStorage.setItem('bidirectionalSyncEnabled', 'true')
      console.log('✅ bidirectionalSyncEnabled set to true')
    }
    
    // Show confirmation
    if (currentWpSync !== 'true' || currentAutoSync !== 'true' || currentBidirectional !== 'true') {
      console.log('🎉 WordPress auto sync đã được kích hoạt tự động!')
      setTimeout(() => {
        toast({
          title: "🚀 Auto Sync Activated",
          description: "WordPress auto sync đã được kích hoạt tự động. Bây giờ bạn có thể tạo news và sẽ tự động sync với WordPress!",
        })
      }, 1000)
    }
  }, [])

  // Keyboard shortcut for saving settings (Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        if (!isLoading && settings.apiUrl.trim() && settings.username.trim() && settings.password.trim()) {
          handleSaveSettings()
          toast({
            title: "Phím tắt",
            description: "Đã lưu cài đặt bằng Ctrl+S",
          })
        } else {
          toast({
            title: "Không thể lưu",
            description: "Vui lòng điền đầy đủ thông tin trước khi lưu",
            variant: "destructive",
          })
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLoading, settings])

  const validateApiUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      return urlObj.pathname.includes('/wp-json/wp/v2') || urlObj.pathname.includes('/wp-json/wp/v2/')
    } catch {
      return false
    }
  }

  const normalizeApiUrl = (url: string): string => {
    if (!url) return url
    
    // Remove trailing slash
    url = url.replace(/\/$/, '')
    
    // If it doesn't end with wp-json/wp/v2, add it
    if (!url.includes('/wp-json/wp/v2')) {
      if (url.includes('/wp-json')) {
        url = url.replace('/wp-json', '/wp-json/wp/v2')
      } else {
        url = url + '/wp-json/wp/v2'
      }
    }
    
    return url
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    
    try {
      // Validation
      if (!settings.apiUrl.trim()) {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập URL WordPress",
          variant: "destructive",
        })
        return
      }

      if (!settings.username.trim()) {
        toast({
          title: "Lỗi", 
          description: "Vui lòng nhập tên đăng nhập",
          variant: "destructive",
        })
        return
      }

      if (!settings.password.trim()) {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập Application Password",
          variant: "destructive",
        })
        return
      }

      // Normalize API URL before saving
      const normalizedSettings = {
        ...settings,
        apiUrl: normalizeApiUrl(settings.apiUrl.trim()),
        username: settings.username.trim(),
        password: settings.password.trim()
      }
      
      // Test connection before saving (optional but recommended)
      if (settings.enabled) {
        toast({
          title: "Đang kiểm tra...",
          description: "Đang xác thực kết nối WordPress...",
        })

        try {
          const testResponse = await fetch(`${normalizedSettings.apiUrl}/posts?per_page=1`, {
            method: 'GET',
            headers: {
              'Authorization': `Basic ${btoa(`${normalizedSettings.username}:${normalizedSettings.password}`)}`,
              'Content-Type': 'application/json',
            },
          })

          if (!testResponse.ok) {
            const errorText = await testResponse.text()
            toast({
              title: "Cảnh báo",
              description: `Không thể kết nối WordPress (${testResponse.status}), nhưng settings đã được lưu. Vui lòng kiểm tra lại.`,
              variant: "destructive",
            })
            console.warn('WordPress connection test failed:', errorText)
          }
        } catch (connectionError) {
          toast({
            title: "Cảnh báo", 
            description: "Không thể xác thực kết nối, nhưng settings đã được lưu. Vui lòng kiểm tra kết nối.",
            variant: "destructive",
          })
          console.warn('WordPress connection test error:', connectionError)
        }
      }

      // Save to localStorage
      localStorage.setItem('wordpressSettings', JSON.stringify(normalizedSettings))
      setSettings(normalizedSettings)
      
      // Update WordPress sync status if enabled
      if (normalizedSettings.enabled && wpSyncEnabled !== true) {
        toggleWordPressSync()
      } else if (!normalizedSettings.enabled && wpSyncEnabled !== false) {
        toggleWordPressSync()
      }
      
      toast({
        title: "Thành công",
        description: `Cài đặt WordPress đã được lưu ${normalizedSettings.enabled ? 'và kích hoạt' : ''}`,
      })

      // Log settings for debugging
      console.log('✅ WordPress settings saved:', {
        apiUrl: normalizedSettings.apiUrl,
        username: normalizedSettings.username,
        enabled: normalizedSettings.enabled,
        passwordLength: normalizedSettings.password.length
      })
      
    } catch (error) {
      console.error('Error saving WordPress settings:', error)
      toast({
        title: "Lỗi",
        description: `Không thể lưu cài đặt: ${(error as Error).message}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestConnection = async () => {
    if (!settings.apiUrl || !settings.username || !settings.password) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin kết nối",
        variant: "destructive",
      })
      return
    }

    setIsTestingConnection(true)
    setTestResult(null)
    
    const normalizedUrl = normalizeApiUrl(settings.apiUrl)
    
    try {
      // First, test if the API endpoint exists
      console.log('Testing API endpoint:', normalizedUrl)
      
      const response = await fetch(`${normalizedUrl}/posts?per_page=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${settings.username}:${settings.password}`)}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (response.ok) {
        const data = await response.json()
        setTestResult({
          status: 'success',
          message: 'Kết nối WordPress thành công!',
          details: `Tìm thấy ${Array.isArray(data) ? data.length : 0} bài viết`
        })
        
        toast({
          title: "Thành công",
          description: "Kết nối WordPress thành công!",
        })
      } else {
        const errorText = await response.text()
        let suggestions: string[] = []
        
        if (response.status === 404) {
          suggestions = [
            'Kiểm tra URL có đúng định dạng: https://yoursite.com/wp-json/wp/v2',
            'Đảm bảo WordPress đã bật REST API',
            'Thử truy cập URL trực tiếp trên trình duyệt',
            'Kiểm tra tên miền có hoạt động không'
          ]
        } else if (response.status === 401) {
          suggestions = [
            'Kiểm tra tên đăng nhập có đúng không',
            'Đảm bảo dùng Application Password, không phải mật khẩu thường',
            'Tạo lại Application Password mới'
          ]
        } else if (response.status === 403) {
          suggestions = [
            'Tài khoản cần quyền Editor hoặc Administrator',
            'Kiểm tra plugin bảo mật có chặn API không',
            'Thử với tài khoản Administrator'
          ]
        }
        
        setTestResult({
          status: 'error',
          message: `Lỗi ${response.status}: ${response.statusText}`,
          details: errorText,
          suggestions
        })
        
        toast({
          title: "Lỗi kết nối",
          description: `Không thể kết nối: ${response.status} ${response.statusText}`,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error('Connection error:', error)
      
      let suggestions: string[] = []
      if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        suggestions = [
          'Kiểm tra kết nối internet',
          'Đảm bảo trang WordPress có thể truy cập',
          'Kiểm tra CORS settings trên WordPress',
          'Thử tắt tường lửa/antivirus tạm thời'
        ]
      }
      
      setTestResult({
        status: 'error',
        message: 'Không thể kết nối đến WordPress',
        details: error.message,
        suggestions
      })
      
      toast({
        title: "Lỗi kết nối",
        description: `Không thể kết nối: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Đã copy",
      description: "Đã copy vào clipboard",
    })
  }

  const testApiInBrowser = () => {
    const normalizedUrl = normalizeApiUrl(settings.apiUrl)
    window.open(`${normalizedUrl}/posts?per_page=1`, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cài đặt WordPress</h1>
          <p className="text-gray-600 mt-1">Cấu hình tích hợp với WordPress CMS</p>
        </div>
        <div className="flex items-center gap-2">
          {settings.enabled ? (
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Cloud className="w-4 h-4 mr-1" />
              Đã kích hoạt
            </Badge>
          ) : (
            <Badge variant="outline" className="text-gray-600 border-gray-600">
              <CloudOff className="w-4 h-4 mr-1" />
              Chưa kích hoạt
            </Badge>
          )}
        </div>
      </div>

      {/* Test Result */}
      {testResult && (
        <Card className={testResult.status === 'success' ? 'border-green-200' : 'border-red-200'}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {testResult.status === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-medium ${testResult.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {testResult.message}
                </span>
              </div>
              
              {testResult.details && (
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <strong>Chi tiết:</strong> {testResult.details}
                </div>
              )}
              
              {testResult.suggestions && testResult.suggestions.length > 0 && (
                <div className="bg-yellow-50 p-3 rounded">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800 mb-2">Gợi ý khắc phục:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                        {testResult.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Cài đặt cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="apiUrl">URL WordPress API *</Label>
              <div className="flex gap-2">
                <Input
                  id="apiUrl"
                  type="url"
                  placeholder="https://vhdcom.local hoặc https://your-site.com"
                  value={settings.apiUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, apiUrl: e.target.value }))}
                  className={!validateApiUrl(normalizeApiUrl(settings.apiUrl)) && settings.apiUrl ? 'border-yellow-300' : ''}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(normalizeApiUrl(settings.apiUrl))}
                  disabled={!settings.apiUrl}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={testApiInBrowser}
                  disabled={!settings.apiUrl}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  URL sẽ được tự động chuẩn hóa thành: <code className="bg-gray-100 px-1 rounded">{normalizeApiUrl(settings.apiUrl) || 'https://your-site.com/wp-json/wp/v2'}</code>
                </p>
                {settings.apiUrl && !validateApiUrl(normalizeApiUrl(settings.apiUrl)) && (
                  <p className="text-sm text-yellow-600 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    URL sẽ được tự động thêm "/wp-json/wp/v2"
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Tên đăng nhập *</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="duong"
                  value={settings.username}
                  onChange={(e) => setSettings(prev => ({ ...prev, username: e.target.value }))}
                />
                <p className="text-sm text-gray-600 mt-1">Tên đăng nhập WordPress của bạn</p>
              </div>
              <div>
                <Label htmlFor="password">Mật khẩu ứng dụng *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••••••••••••••••"
                  value={settings.password}
                  onChange={(e) => setSettings(prev => ({ ...prev, password: e.target.value }))}
                />
                <p className="text-sm text-gray-600 mt-1">Application Password (không phải mật khẩu thường)</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Lưu ý bảo mật:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Sử dụng Application Password thay vì mật khẩu thường</li>
                    <li>Tạo Application Password: Users → Profile → Application Passwords</li>
                    <li>Đảm bảo tài khoản có quyền quản lý bài viết</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Kích hoạt tích hợp WordPress</Label>
              <p className="text-sm text-gray-600">Bật/tắt đồng bộ với WordPress</p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enabled: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Test Section */}
      <Card>
        <CardHeader>
          <CardTitle>Kiểm tra nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={testApiInBrowser}
                disabled={!settings.apiUrl}
                variant="outline"
                className="justify-start"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Mở API trong trình duyệt
              </Button>
              
              <Button
                onClick={() => copyToClipboard(normalizeApiUrl(settings.apiUrl))}
                disabled={!settings.apiUrl}
                variant="outline"
                className="justify-start"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy URL API
              </Button>
            </div>
            
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="font-medium mb-1">Kiểm tra thủ công:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-600">
                <li>Click "Mở API trong trình duyệt" để kiểm tra API có hoạt động không</li>
                <li>Nếu thấy JSON data → API hoạt động tốt</li>
                <li>Nếu thấy lỗi 404 → Kiểm tra lại URL WordPress</li>
                <li>Nếu thấy lỗi xác thực → Tạo lại Application Password</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Đồng bộ tự động
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* WordPress Sync Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Kích hoạt đồng bộ WordPress</Label>
              <p className="text-sm text-gray-600">Bật/tắt tính năng đồng bộ với WordPress</p>
            </div>
            <div className="flex items-center gap-2">
              {wpSyncEnabled ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Activity className="w-4 h-4 mr-1" />
                  Đã bật
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-600 border-gray-600">
                  <CloudOff className="w-4 h-4 mr-1" />
                  Đã tắt
                </Badge>
              )}
              <Switch
                checked={wpSyncEnabled}
                onCheckedChange={toggleWordPressSync}
              />
            </div>
          </div>

          <Separator />

          {/* Auto-Sync Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Tự động đồng bộ khi thêm tin tức</Label>
              <p className="text-sm text-gray-600">
                Tự động tạo bài viết WordPress khi thêm tin tức mới từ admin
              </p>
            </div>
            <div className="flex items-center gap-2">
              {autoSyncEnabled ? (
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  <Zap className="w-4 h-4 mr-1" />
                  Tự động
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-600 border-gray-600">
                  Thủ công
                </Badge>
              )}
              <Switch
                checked={autoSyncEnabled}
                onCheckedChange={toggleAutoSync}
                disabled={!wpSyncEnabled}
              />
            </div>
          </div>

          {/* Sync Status */}
          {lastSyncStatus && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 mb-1">Trạng thái đồng bộ gần nhất:</p>
                  <p className="text-sm text-gray-700">{lastSyncStatus}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Cập nhật lúc: {new Date().toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bidirectional Sync Toggle */}
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Đồng bộ 2 chiều</Label>
              <p className="text-sm text-gray-600">
                Đồng bộ dữ liệu từ WordPress về hệ thống và ngược lại
              </p>
            </div>
            <div className="flex items-center gap-2">
              {bidirectionalSyncEnabled ? (
                <Badge variant="outline" className="text-purple-600 border-purple-600">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  2 chiều
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-600 border-gray-600">
                  1 chiều
                </Badge>
              )}
              <Switch
                checked={bidirectionalSyncEnabled}
                onCheckedChange={toggleBidirectionalSync}
                disabled={!wpSyncEnabled}
              />
            </div>
          </div>

          {/* Manual Sync Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={syncWithWordPress}
              disabled={!wpSyncEnabled || isSyncing}
              variant="outline"
              className="flex-1"
            >
              <Cloud className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Đang đồng bộ...' : 'Lên WordPress'}
            </Button>
            
            <Button
              onClick={syncFromWordPress}
              disabled={!wpSyncEnabled || isSyncing}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Đang tải...' : 'Từ WordPress'}
            </Button>
            
            <Button
              onClick={syncBidirectional}
              disabled={!bidirectionalSyncEnabled || isSyncing}
              variant="default"
              className="flex-1"
            >
              <Zap className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ 2 chiều'}
            </Button>
          </div>

          {/* Auto-Sync Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Cách hoạt động của tự động đồng bộ tin tức:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Khi tạo tin tức mới → Tự động lưu lên WordPress</li>
                  <li>Khi cập nhật tin tức → Tự động cập nhật bài viết WordPress</li>
                  <li>Khi xóa tin tức → Tự động xóa bài viết WordPress</li>
                  <li>Tin tức sẽ được chuyển đổi thành HTML có định dạng đẹp</li>
                  <li>Bao gồm ảnh đại diện, thư viện ảnh và metadata đầy đủ</li>
                  <li>Dữ liệu được lưu trữ an toàn trên WordPress database</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Bidirectional Sync Info */}
          {bidirectionalSyncEnabled && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <RefreshCw className="w-5 h-5 text-purple-600 mt-0.5" />
                <div className="text-sm text-purple-800">
                  <p className="font-medium mb-1">Đồng bộ 2 chiều được kích hoạt:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Tự động tải tin tức mới từ WordPress về hệ thống</li>
                    <li>Đồng bộ thay đổi trong cả 2 hướng</li>
                    <li>WordPress trở thành nguồn dữ liệu chính (primary source)</li>
                    <li>Dữ liệu được lưu trữ bền vững trên WordPress</li>
                    <li>Conflict resolution: WordPress data ưu tiên</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Events Auto-Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Đồng bộ tự động - Sự kiện
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Events WordPress Sync Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Kích hoạt đồng bộ WordPress cho sự kiện</Label>
              <p className="text-sm text-gray-600">Bật/tắt tính năng đồng bộ sự kiện với WordPress</p>
            </div>
            <div className="flex items-center gap-2">
              {eventsWpSyncEnabled ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Activity className="w-4 h-4 mr-1" />
                  Đã bật
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-600 border-gray-600">
                  <CloudOff className="w-4 h-4 mr-1" />
                  Đã tắt
                </Badge>
              )}
              <Switch
                checked={eventsWpSyncEnabled}
                onCheckedChange={toggleEventsWordPressSync}
              />
            </div>
          </div>

          <Separator />

          {/* Events Auto-Sync Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Tự động đồng bộ khi thêm sự kiện</Label>
              <p className="text-sm text-gray-600">
                Tự động tạo bài viết WordPress khi thêm sự kiện mới từ admin
              </p>
            </div>
            <div className="flex items-center gap-2">
              {eventsAutoSyncEnabled ? (
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  <Zap className="w-4 h-4 mr-1" />
                  Tự động
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-600 border-gray-600">
                  Thủ công
                </Badge>
              )}
              <Switch
                checked={eventsAutoSyncEnabled}
                onCheckedChange={toggleEventsAutoSync}
                disabled={!eventsWpSyncEnabled}
              />
            </div>
          </div>

          {/* Events Sync Status */}
          {eventsLastSyncStatus && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <Activity className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 mb-1">Trạng thái đồng bộ sự kiện gần nhất:</p>
                  <p className="text-sm text-gray-700">{eventsLastSyncStatus}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Cập nhật lúc: {new Date().toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Events Manual Sync Button */}
          <div className="flex gap-4">
            <Button
              onClick={syncEventsWithWordPress}
              disabled={!eventsWpSyncEnabled || isEventsSyncing}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isEventsSyncing ? 'animate-spin' : ''}`} />
              {isEventsSyncing ? 'Đang đồng bộ sự kiện...' : 'Đồng bộ sự kiện thủ công'}
            </Button>
          </div>

          {/* Events Auto-Sync Info */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Cách hoạt động của tự động đồng bộ sự kiện:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Khi tạo sự kiện mới → Tự động tạo bài viết WordPress</li>
                  <li>Khi cập nhật sự kiện → Tự động cập nhật bài viết WordPress</li>
                  <li>Khi xóa sự kiện → Tự động xóa bài viết WordPress</li>
                  <li>Sự kiện sẽ được chuyển đổi thành HTML có định dạng</li>
                  <li>Bao gồm thông tin chi tiết: ngày, giờ, địa điểm, số lượng tham gia</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Validation Status */}
      <Card className="border-l-4 border-l-emerald-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                settings.apiUrl.trim() && settings.username.trim() && settings.password.trim()
                  ? 'bg-emerald-500' 
                  : 'bg-gray-300'
              }`}></div>
              <span className="font-medium text-gray-900">
                Trạng thái form: {
                  settings.apiUrl.trim() && settings.username.trim() && settings.password.trim()
                    ? 'Sẵn sàng lưu' 
                    : 'Chưa đầy đủ thông tin'
                }
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-1 text-sm ${
                settings.apiUrl.trim() ? 'text-emerald-600' : 'text-gray-400'
              }`}>
                <CheckCircle className="w-4 h-4" />
                URL
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                settings.username.trim() ? 'text-emerald-600' : 'text-gray-400'
              }`}>
                <CheckCircle className="w-4 h-4" />
                Username
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                settings.password.trim() ? 'text-emerald-600' : 'text-gray-400'
              }`}>
                <CheckCircle className="w-4 h-4" />
                Password
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={handleTestConnection}
          disabled={isTestingConnection || !settings.apiUrl || !settings.username || !settings.password}
          variant="outline"
        >
          <TestTube className={`w-4 h-4 mr-2 ${isTestingConnection ? 'animate-spin' : ''}`} />
          {isTestingConnection ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}
        </Button>

        <div className="relative group">
          <Button
            onClick={handleSaveSettings}
            disabled={isLoading || !settings.apiUrl.trim() || !settings.username.trim() || !settings.password.trim()}
            className={`${
              !settings.apiUrl.trim() || !settings.username.trim() || !settings.password.trim()
                ? 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl'
            } transition-all duration-200 relative`}
            size="lg"
          >
            <Save className={`w-4 h-4 mr-2 ${isLoading ? 'animate-pulse' : ''}`} />
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang lưu cài đặt...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Lưu cài đặt
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 border border-white/20 text-xs font-mono bg-white/10 rounded">
                  Ctrl+S
                </kbd>
              </span>
            )}
          </Button>
          
          {/* Tooltip for disabled state */}
          {(!settings.apiUrl.trim() || !settings.username.trim() || !settings.password.trim()) && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              Vui lòng điền đầy đủ thông tin để lưu cài đặt
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
            </div>
          )}
        </div>

        <Button
          variant="destructive"
          size="default"
          onClick={() => {
            if (confirm('⚠️ Bạn có chắc chắn muốn xóa toàn bộ dữ liệu lưu trữ?\n\nHành động này sẽ:\n- Xóa tất cả tin tức và sự kiện đã tạo\n- Reset cài đặt WordPress\n- Xóa dữ liệu đăng nhập\n- Tải lại trang\n\nKhông thể hoàn tác!')) {
              try {
                const storageKeys = ['newsItems', 'eventsItems', 'wpSyncEnabled', 'wordpressSettings', 'adminUser', 'darkMode']
                storageKeys.forEach(key => localStorage.removeItem(key))
                
                toast({
                  title: "Thành công",
                  description: "Đã xóa toàn bộ dữ liệu lưu trữ. Trang sẽ được tải lại.",
                })
                
                setTimeout(() => window.location.reload(), 1500)
              } catch (error) {
                toast({
                  title: "Lỗi",
                  description: "Không thể xóa dữ liệu lưu trữ",
                  variant: "destructive",
                })
              }
            }
          }}
          className="border-red-300 text-white bg-red-600 hover:bg-red-700"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Xóa dữ liệu lưu trữ
        </Button>
      </div>

      {/* Troubleshooting Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn khắc phục lỗi 404</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 text-sm">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800 mb-2">Lỗi 404 "rest_no_route" - Nguyên nhân và cách khắc phục:</p>
                  <ul className="list-disc list-inside space-y-1 text-red-700">
                    <li>URL WordPress không đúng hoặc không tồn tại</li>
                    <li>WordPress REST API bị tắt hoặc bị chặn</li>
                    <li>Plugin bảo mật chặn API requests</li>
                    <li>Cấu hình server không hỗ trợ REST API</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-red-600">🔧 Các bước khắc phục theo thứ tự:</h4>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h5 className="font-medium mb-2">1. Kiểm tra URL cơ bản:</h5>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Đảm bảo <code className="bg-gray-100 px-1 rounded">http://vhdcom.local</code> có thể truy cập được</li>
                    <li>Thử truy cập: <code className="bg-gray-100 px-1 rounded">http://vhdcom.local/wp-admin</code></li>
                    <li>Nếu không vào được → Kiểm tra XAMPP/Local server</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h5 className="font-medium mb-2">2. Kiểm tra WordPress REST API:</h5>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Truy cập: <code className="bg-gray-100 px-1 rounded">http://vhdcom.local/wp-json/wp/v2</code></li>
                    <li>Nếu thấy JSON → API hoạt động</li>
                    <li>Nếu thấy 404 → API bị tắt hoặc URL sai</li>
                  </ul>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h5 className="font-medium mb-2">3. Kiểm tra cấu hình WordPress:</h5>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Vào WordPress Admin → Settings → Permalinks</li>
                    <li>Chọn "Post name" hoặc "Custom Structure"</li>
                    <li>Click "Save Changes" để refresh rewrite rules</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h5 className="font-medium mb-2">4. Kiểm tra plugins:</h5>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Tạm thời tắt tất cả plugins</li>
                    <li>Test API lại</li>
                    <li>Nếu hoạt động → Bật từng plugin để tìm plugin gây lỗi</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h5 className="font-medium mb-2">5. Thêm code vào functions.php (nếu cần):</h5>
                  <div className="bg-gray-100 p-3 rounded mt-2">
                    <code className="text-sm">
                      {`// Đảm bảo REST API hoạt động
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        return $value;
    });
});`}
                    </code>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800 mb-2">Test thành công khi:</p>
                  <ul className="list-disc list-inside space-y-1 text-green-700">
                    <li>Truy cập <code className="bg-green-100 px-1 rounded">http://vhdcom.local/wp-json/wp/v2/posts</code> thấy JSON</li>
                    <li>Nút "Kiểm tra kết nối" hiển thị màu xanh</li>
                    <li>Có thể tạo và đồng bộ bài viết từ admin panel</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Sync Manager Section */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Zap className="h-5 w-5" />
            <span>Auto-Sync Manager</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AutoSyncManager />
        </CardContent>
      </Card>

      {/* Data Import Manager Section */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Activity className="h-5 w-5" />
            <span>Data Import Manager</span>
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
              Beta
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataImportManager />
        </CardContent>
      </Card>
    </div>
  )
} 