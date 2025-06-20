'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Input } from './input'
import { Alert, AlertDescription } from './alert'
import { Badge } from './badge'
import { testWordPressConnection } from '@/lib/newsData'
import { WordPressService } from '@/lib/wordpressApi'

interface DebugResult {
  step: string
  status: 'success' | 'error' | 'warning'
  message: string
  details?: any
}

export function WordPressDebugger() {
  const [isDebugging, setIsDebugging] = useState(false)
  const [debugResults, setDebugResults] = useState<DebugResult[]>([])
  const [testUrl, setTestUrl] = useState('http://vhdcom.local')
  const [testUsername, setTestUsername] = useState('')
  const [testPassword, setTestPassword] = useState('')

  const addDebugResult = (step: string, status: 'success' | 'error' | 'warning', message: string, details?: any) => {
    setDebugResults(prev => [...prev, { step, status, message, details }])
  }

  const runFullDiagnostic = async () => {
    setIsDebugging(true)
    setDebugResults([])

    try {
      // Step 1: Check localStorage settings
      addDebugResult('Bước 1', 'warning', 'Kiểm tra WordPress settings...')
      
      const wpSettings = localStorage.getItem('wordpressSettings')
      if (!wpSettings) {
        addDebugResult('Bước 1', 'error', 'WordPress settings không tồn tại trong localStorage')
        return
      }

      const settings = JSON.parse(wpSettings)
      addDebugResult('Bước 1', 'success', 'WordPress settings tìm thấy', {
        apiUrl: settings.apiUrl,
        username: settings.username,
        enabled: settings.enabled
      })

      // Step 2: Test URL format
      addDebugResult('Bước 2', 'warning', 'Kiểm tra format URL...')
      
      let apiUrl = settings.apiUrl
      if (!apiUrl.includes('/wp-json/wp/v2')) {
        apiUrl = apiUrl.replace(/\/+$/, '') + '/wp-json/wp/v2'
        addDebugResult('Bước 2', 'warning', `URL được tự động điều chỉnh: ${apiUrl}`)
      } else {
        addDebugResult('Bước 2', 'success', `URL format đúng: ${apiUrl}`)
      }

      // Step 3: Test basic connectivity
      addDebugResult('Bước 3', 'warning', 'Test kết nối cơ bản...')
      
      try {
        const response = await fetch(apiUrl, { method: 'GET' })
        if (response.ok) {
          addDebugResult('Bước 3', 'success', `WordPress REST API phản hồi: ${response.status}`)
        } else {
          addDebugResult('Bước 3', 'error', `WordPress REST API lỗi: ${response.status}`)
        }
      } catch (error) {
        addDebugResult('Bước 3', 'error', `Không thể kết nối: ${(error as Error).message}`)
      }

      // Step 4: Test authentication
      addDebugResult('Bước 4', 'warning', 'Test xác thực...')
      
      const wpService = new WordPressService()
      wpService.setCredentials(settings.apiUrl, settings.username, settings.password)
      
      const authTest = await wpService.testConnection()
      if (authTest.success) {
        addDebugResult('Bước 4', 'success', authTest.message, authTest.details)
      } else {
        addDebugResult('Bước 4', 'error', authTest.message)
      }

      // Step 5: Test full integration
      addDebugResult('Bước 5', 'warning', 'Test tích hợp đầy đủ...')
      
      const integrationTest = await testWordPressConnection()
      if (integrationTest.success) {
        addDebugResult('Bước 5', 'success', integrationTest.message, {
          postsCount: integrationTest.postsCount
        })
      } else {
        addDebugResult('Bước 5', 'error', integrationTest.message)
      }

    } catch (error) {
      addDebugResult('Lỗi', 'error', `Diagnostic failed: ${(error as Error).message}`)
    } finally {
      setIsDebugging(false)
    }
  }

  const testCustomConnection = async () => {
    if (!testUrl || !testUsername || !testPassword) {
      alert('Vui lòng điền đầy đủ thông tin test')
      return
    }

    setIsDebugging(true)
    setDebugResults([])

    try {
      addDebugResult('Test Custom', 'warning', 'Đang test kết nối custom...')
      
      const wpService = new WordPressService()
      wpService.setCredentials(testUrl, testUsername, testPassword)
      
      const result = await wpService.testConnection()
      
      if (result.success) {
        addDebugResult('Test Custom', 'success', result.message, result.details)
        
        // Save to localStorage if successful
        const customSettings = {
          apiUrl: testUrl,
          username: testUsername,
          password: testPassword,
          enabled: true
        }
        localStorage.setItem('wordpressSettings', JSON.stringify(customSettings))
        addDebugResult('Save Settings', 'success', 'Đã lưu settings thành công vào localStorage')
      } else {
        addDebugResult('Test Custom', 'error', result.message)
      }
    } catch (error) {
      addDebugResult('Test Custom', 'error', `Test failed: ${(error as Error).message}`)
    } finally {
      setIsDebugging(false)
    }
  }

  const getStatusColor = (status: 'success' | 'error' | 'warning') => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusIcon = (status: 'success' | 'error' | 'warning') => {
    switch (status) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔧 WordPress Connection Debugger
          </CardTitle>
          <CardDescription>
            Công cụ chẩn đoán kết nối WordPress để fix lỗi "rest_no_route" và các lỗi API khác
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runFullDiagnostic} 
            disabled={isDebugging}
            className="w-full"
          >
            {isDebugging ? '🔄 Đang chẩn đoán...' : '🚀 Chạy chẩn đoán đầy đủ'}
          </Button>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline"
              onClick={() => {
                localStorage.removeItem('wordpressSettings')
                setDebugResults([])
                addDebugResult('Clear', 'warning', 'Đã xóa WordPress settings')
              }}
            >
              🗑️ Clear Settings
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                console.log('WordPress Settings:', localStorage.getItem('wordpressSettings'))
                addDebugResult('Debug', 'success', 'Check console for settings data')
              }}
            >
              🔍 Log Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🧪 Test Custom Connection</CardTitle>
          <CardDescription>
            Test kết nối với thông tin WordPress khác
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">WordPress URL</label>
              <Input
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                placeholder="http://vhdcom.local hoặc https://yoursite.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Username</label>
              <Input
                value={testUsername}
                onChange={(e) => setTestUsername(e.target.value)}
                placeholder="WordPress username"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Application Password</label>
              <Input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="WordPress application password"
              />
            </div>
          </div>
          <Button 
            onClick={testCustomConnection}
            disabled={isDebugging}
            className="w-full"
            variant="secondary"
          >
            {isDebugging ? '⏳ Testing...' : '🔌 Test Connection'}
          </Button>
        </CardContent>
      </Card>

      {debugResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📋 Kết quả chẩn đoán</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {debugResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Badge className={getStatusColor(result.status)}>
                    {getStatusIcon(result.status)} {result.step}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{result.message}</p>
                    {result.details && (
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Alert>
        <AlertDescription>
          <strong>🚨 Hướng dẫn sửa lỗi phổ biến:</strong>
          <br />
          • <strong>404 rest_no_route:</strong> Kiểm tra URL và permalinks WordPress
          <br />
          • <strong>401 Unauthorized:</strong> Tạo lại Application Password
          <br />
          • <strong>CORS errors:</strong> Cấu hình headers trong WordPress
          <br />
          • <strong>Connection timeout:</strong> Kiểm tra server và firewall
        </AlertDescription>
      </Alert>
    </div>
  )
} 