"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Settings,
  Info,
  Zap,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react'
import { useNews } from '@/contexts/NewsContext'
import { wpCache } from '@/lib/cacheService'
import { globalAutoSyncManager } from '@/lib/autoSyncManager'

interface AutoSyncManagerProps {
  onClose?: () => void
}

export default function AutoSyncManager({ onClose }: AutoSyncManagerProps) {
  const { syncFromWordPress, isLoading } = useNews()
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false)
  const [syncInterval, setSyncInterval] = useState(10) // minutes - increased to 10
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const [lastSyncResult, setLastSyncResult] = useState<any>(null)
  const [syncStatus, setSyncStatus] = useState({
    isActive: false,
    lastSync: null as Date | null,
    nextSync: null as Date | null,
    syncCount: 0,
    errorCount: 0,
    lastError: null as string | null
  })

  // Load settings from localStorage and setup global manager
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const status = globalAutoSyncManager.getStatus()
        setAutoSyncEnabled(status.enabled)
        setSyncInterval(status.interval / 60 / 1000) // Convert ms to minutes
        
        if (status.lastSyncTime) {
          setSyncStatus(prev => ({
            ...prev,
            lastSync: new Date(status.lastSyncTime!)
          }))
        }
      } catch (error) {
        console.error('Failed to load auto-sync settings:', error)
      }
    }

    // Check initial connection
    checkConnection()
    
    // Setup sync status polling
    const statusInterval = setInterval(() => {
      const status = globalAutoSyncManager.getStatus()
      setSyncStatus(prev => ({
        ...prev,
        isActive: status.isActive,
        lastSync: status.lastSyncTime ? new Date(status.lastSyncTime) : null
      }))
    }, 1000)

    return () => clearInterval(statusInterval)
  }, [])

  // Update global manager when settings change
  useEffect(() => {
    globalAutoSyncManager.updateConfig({
      enabled: autoSyncEnabled,
      interval: syncInterval * 60 * 1000 // Convert minutes to ms
    })
  }, [autoSyncEnabled, syncInterval])

  const checkConnection = async () => {
    setConnectionStatus('checking')
    try {
      const response = await fetch('/api/sync/wordpress?action=health')
      const result = await response.json()
      setConnectionStatus(result.success ? 'connected' : 'disconnected')
    } catch (error) {
      setConnectionStatus('disconnected')
    }
  }

  const handleToggleAutoSync = () => {
    setAutoSyncEnabled(!autoSyncEnabled)
  }

  const handleIntervalChange = (newInterval: number) => {
    setSyncInterval(newInterval)
  }

  const handleManualSync = async () => {
    try {
      await globalAutoSyncManager.triggerManualSync()
      setLastSyncResult({ success: true, message: 'Manual sync completed' })
    } catch (error) {
      console.error('Manual sync failed:', error)
      setLastSyncResult({ success: false, error: (error as Error).message })
    }
  }

  const clearCache = () => {
    wpCache.clear()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lastWordPressSync')
    }
    setLastSyncResult(null)
    console.log('🧹 Cache cleared')
  }

  const formatTime = (date: Date | null) => {
    if (!date) return 'Chưa có'
    return date.toLocaleString('vi-VN')
  }

  const formatNextSyncTime = (date: Date | null) => {
    if (!date) return 'Không có'
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    if (diff <= 0) return 'Sắp diễn ra'
    
    const minutes = Math.floor(diff / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    if (minutes > 0) {
      return `${minutes} phút ${seconds} giây`
    }
    return `${seconds} giây`
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500'
      case 'disconnected': return 'bg-red-500'
      case 'checking': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className="h-4 w-4" />
      case 'disconnected': return <WifiOff className="h-4 w-4" />
      case 'checking': return <RefreshCw className="h-4 w-4 animate-spin" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Auto-Sync Manager</h2>
          <p className="text-gray-600">Quản lý tự động đồng bộ dữ liệu WordPress</p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        )}
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Trạng thái kết nối</CardTitle>
            <Button variant="ghost" size="sm" onClick={checkConnection}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
            {getStatusIcon()}
            <span className="font-medium">
              {connectionStatus === 'connected' && 'Kết nối thành công'}
              {connectionStatus === 'disconnected' && 'Mất kết nối'}
              {connectionStatus === 'checking' && 'Đang kiểm tra...'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Cài đặt tự động đồng bộ</span>
          </CardTitle>
          <CardDescription>
            Cấu hình tần suất và cách thức đồng bộ tự động
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Enable/Disable Auto Sync */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Kích hoạt tự động đồng bộ</div>
              <div className="text-sm text-gray-600">
                Tự động đồng bộ dữ liệu từ WordPress theo khoảng thời gian
              </div>
            </div>
            <Switch
              checked={autoSyncEnabled}
              onCheckedChange={handleToggleAutoSync}
              disabled={isLoading}
            />
          </div>

          <Separator />

          {/* Sync Interval */}
          <div className="space-y-3">
            <div className="font-medium">Khoảng thời gian đồng bộ</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[1, 5, 15, 30].map((interval) => (
                <Button
                  key={interval}
                  variant={syncInterval === interval ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleIntervalChange(interval)}
                  disabled={!autoSyncEnabled}
                >
                  {interval} phút
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Manual Sync */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Đồng bộ thủ công</div>
              <div className="text-sm text-gray-600">
                Thực hiện đồng bộ ngay lập tức
              </div>
            </div>
            <Button
              onClick={handleManualSync}
              disabled={isLoading || syncStatus.isActive}
              size="sm"
            >
              {isLoading || syncStatus.isActive ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Đồng bộ ngay
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sync Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Trạng thái đồng bộ</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Lần đồng bộ cuối</div>
              <div className="font-medium">{formatTime(syncStatus.lastSync)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Đồng bộ tiếp theo</div>
              <div className="font-medium">{formatNextSyncTime(syncStatus.nextSync)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Số lần đồng bộ</div>
              <div className="font-medium">{syncStatus.syncCount}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Số lỗi</div>
              <div className="font-medium text-red-600">{syncStatus.errorCount}</div>
            </div>
          </div>

          {/* Active Status */}
                      {globalAutoSyncManager.getStatus().isRunning && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Clock className="h-3 w-3 mr-1" />
                Đang hoạt động
              </Badge>
              <span className="text-sm text-gray-600">
                Auto-sync đang chạy mỗi {syncInterval} phút
              </span>
            </div>
          )}

          {/* Last Error */}
          {syncStatus.lastError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Lỗi cuối: {syncStatus.lastError}
              </AlertDescription>
            </Alert>
          )}

          {/* Last Success */}
          {lastSyncResult?.success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Đồng bộ thành công: {lastSyncResult.count || 0} items được cập nhật
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Cache Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Quản lý cache</span>
          </CardTitle>
          <CardDescription>
            Quản lý bộ nhớ đệm để tối ưu hiệu suất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Xóa cache</div>
              <div className="text-sm text-gray-600">
                Xóa tất cả dữ liệu cache và buộc đồng bộ mới
              </div>
            </div>
            <Button variant="outline" onClick={clearCache} size="sm">
              Xóa cache
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Lưu ý:</strong> Auto-sync sẽ chỉ đồng bộ dữ liệu mới từ WordPress. 
          Dữ liệu được cache để tăng tốc độ và giảm tải server.
        </AlertDescription>
      </Alert>
    </div>
  )
}
