"use client"

import { Button } from '@/components/ui/button'
import { AlertTriangle, Trash2, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

interface ClearStorageButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export default function ClearStorageButton({ 
  variant = 'destructive', 
  size = 'default',
  className = ''
}: ClearStorageButtonProps) {
  const [isClearing, setIsClearing] = useState(false)
  const { toast } = useToast()

  const clearAllStorage = async () => {
    setIsClearing(true)
    
    try {
      // List of storage keys to clear
      const storageKeys = [
        'newsItems',
        'eventsItems', 
        'wpSyncEnabled',
        'wordpressSettings',
        'adminUser',
        'darkMode'
      ]

      // Clear specific localStorage keys
      storageKeys.forEach(key => {
        try {
          localStorage.removeItem(key)
          console.log(`✅ Cleared: ${key}`)
        } catch (error) {
          console.error(`❌ Error clearing ${key}:`, error)
        }
      })

      // Also try to clear any corrupted JSON data
      try {
        // Check for any remaining items that might be corrupted
        const allKeys = Object.keys(localStorage)
        for (const key of allKeys) {
          try {
            const value = localStorage.getItem(key)
            if (value) {
              // Try to parse to see if it's valid JSON
              JSON.parse(value)
            }
          } catch (parseError) {
            console.warn(`Found corrupted data for key: ${key}, removing...`)
            localStorage.removeItem(key)
          }
        }
      } catch (error) {
        console.error('Error checking for corrupted data:', error)
      }

      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Thành công",
        description: "Đã xóa toàn bộ dữ liệu lưu trữ. Trang sẽ được tải lại.",
      })

      // Reload the page to reset all contexts
      setTimeout(() => {
        window.location.reload()
      }, 1500)

    } catch (error) {
      console.error('Error clearing storage:', error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa dữ liệu lưu trữ",
        variant: "destructive",
      })
    } finally {
      setIsClearing(false)
    }
  }

  const handleClick = () => {
    if (confirm('⚠️ Bạn có chắc chắn muốn xóa toàn bộ dữ liệu lưu trữ?\n\nHành động này sẽ:\n- Xóa tất cả tin tức và sự kiện đã tạo\n- Reset cài đặt WordPress\n- Xóa dữ liệu đăng nhập\n- Tải lại trang\n\nKhông thể hoàn tác!')) {
      clearAllStorage()
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isClearing}
      className={`${className} ${isClearing ? 'animate-pulse' : ''}`}
    >
      {isClearing ? (
        <>
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          Đang xóa...
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4 mr-2" />
          Xóa dữ liệu lưu trữ
        </>
      )}
    </Button>
  )
} 