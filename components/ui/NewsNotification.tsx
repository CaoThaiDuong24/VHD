"use client"

import { useEffect, useState } from 'react'
import { useNews } from '@/contexts/NewsContext'
import { X, Newspaper } from 'lucide-react'
import { Button } from './button'

export default function NewsNotification() {
  const { newsItems } = useNews()
  const [lastNewsCount, setLastNewsCount] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  const [newNewsCount, setNewNewsCount] = useState(0)

  useEffect(() => {
    // Initialize with current count on first load
    if (lastNewsCount === 0) {
      setLastNewsCount(newsItems.length)
      return
    }

    // Check if new news items were added
    if (newsItems.length > lastNewsCount) {
      const newCount = newsItems.length - lastNewsCount
      setNewNewsCount(newCount)
      setShowNotification(true)
      setLastNewsCount(newsItems.length)

      // Auto hide after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [newsItems.length, lastNewsCount])

  if (!showNotification) return null

  return (
    <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Newspaper className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900">
              Tin tức mới!
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {newNewsCount === 1 
                ? 'Có 1 tin tức mới được thêm vào'
                : `Có ${newNewsCount} tin tức mới được thêm vào`
              }
            </p>
            <Button
              size="sm"
              className="mt-2 h-7 text-xs"
              onClick={() => {
                window.location.href = '/news'
              }}
            >
              Xem ngay
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 flex-shrink-0"
            onClick={() => setShowNotification(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
} 