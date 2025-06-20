'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { 
  Download, 
  Upload, 
  RefreshCw, 
  Database, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Zap
} from 'lucide-react'

interface ImportStats {
  imported: number
  updated: number
  failed: number
  lastImport: Date | null
}

export default function DataImportManager() {
  const [isLoading, setIsLoading] = useState(false)

  const [lastResult, setLastResult] = useState<any>(null)
  const { toast } = useToast()

  // Load stats on component mount
  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch('/api/import/wordpress?action=stats')
      const result = await response.json()
      
      if (result.success) {
        setStats(result.stats)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const handleImportAll = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/import/wordpress?action=import-all')
      const result = await response.json()
      
      setLastResult(result)
      
      if (result.success) {
        setStats(result.stats)
        toast({
          title: "Import thành công!",
          description: result.message,
        })
      } else {
        toast({
          title: "Import thất bại",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi import",
        description: "Không thể kết nối tới API",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportRecent = async () => {
    setIsLoading(true)
    try {
      console.log('🔄 Starting incremental import from vhdcom.local...')
      
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Last 24h
      const response = await fetch(`/api/import/wordpress?action=import-recent&since=${since}`)
      const result = await response.json()
      
      setLastResult(result)
      
      if (result.success) {
        setStats(result.stats)
        toast({
          title: "Import cập nhật thành công!",
          description: result.message,
        })
        console.log('✅ Incremental import completed:', result)
      } else {
        toast({
          title: "Import cập nhật thất bại",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('❌ Incremental import error:', error)
      toast({
        title: "Lỗi import cập nhật",
        description: "Không thể kết nối tới API",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetStats = async () => {
    try {
      const response = await fetch('/api/import/wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset-stats' })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setStats({ imported: 0, updated: 0, failed: 0, lastImport: null })
        setLastResult(null)
        toast({
          title: "Reset thành công",
          description: "Đã xóa tất cả thống kê",
        })
      }
    } catch (error) {
      console.error('Reset stats error:', error)
    }
  }

  const formatTime = (date: Date | null) => {
    if (!date) return 'Chưa có'
    return new Date(date).toLocaleString('vi-VN')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Data Import Manager</h2>
        <p className="text-gray-600">Import dữ liệu từ WordPress vhdcom.local</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Import Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleImportAll}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Import All Posts
          </Button>
        </CardContent>
      </Card>



      {/* Last Result */}
      {lastResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Kết quả import gần đây</span>
              {lastResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge variant={lastResult.success ? "default" : "destructive"}>
                  {lastResult.success ? "Thành công" : "Thất bại"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Message:</span>
                <span className="text-sm">{lastResult.message}</span>
              </div>
              {lastResult.data && (
                <div className="flex justify-between">
                  <span>Posts found:</span>
                  <span className="text-sm font-medium">{lastResult.data.length}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Timestamp:</span>
                <span className="text-sm text-gray-600">
                  {lastResult.timestamp ? new Date(lastResult.timestamp).toLocaleString('vi-VN') : 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 