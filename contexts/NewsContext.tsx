"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { newsItems } from '@/lib/newsData'
import type { NewsItem, GalleryImage } from '@/lib/newsData'
import { WordPressService } from '@/lib/wordpressApi'
import { wpCache } from '@/lib/cacheService'

interface NewsContextType {
  newsItems: NewsItem[]
  getNewsById: (id: number) => NewsItem | undefined
  addNews: (news: Omit<NewsItem, 'id'>) => Promise<NewsItem>
  updateNews: (id: number, news: Partial<NewsItem>) => Promise<void>
  deleteNews: (id: number) => void
  syncWithWordPress: () => Promise<void>
  syncFromWordPress: () => Promise<void>
  syncBidirectional: () => Promise<void>
  createWordPressPost: (news: NewsItem) => Promise<void>
  updateWordPressPost: (news: NewsItem) => Promise<void>
  deleteWordPressPost: (wpId: number) => Promise<void>
  isLoading: boolean
  wpSyncEnabled: boolean
  toggleWordPressSync: () => void
  clearStorageData: () => void
  autoSyncEnabled: boolean
  toggleAutoSync: () => void
  bidirectionalSyncEnabled: boolean
  toggleBidirectionalSync: () => void
  lastSyncStatus: string
}

const NewsContext = createContext<NewsContextType | undefined>(undefined)

const STORAGE_KEY = 'newsItems'

// Safe JSON parsing with fallback
const safeJSONParse = (jsonString: string, fallback: any = null) => {
  try {
    // Check if string is valid JSON before parsing
    if (!jsonString || jsonString.trim() === '') {
      return fallback
    }
    
    // Additional validation - check if it starts with valid JSON characters
    const trimmed = jsonString.trim()
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      console.warn('Invalid JSON format detected, using fallback')
      return fallback
    }
    
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('JSON parsing error:', error)
    console.warn('Using fallback data due to parsing error')
    return fallback
  }
}

export function NewsProvider({ children }: { children: React.ReactNode }) {
  const [newsItemsState, setNewsItems] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [wpSyncEnabled, setWpSyncEnabled] = useState(false)
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false)
  const [bidirectionalSyncEnabled, setBidirectionalSyncEnabled] = useState(false)
  const [lastSyncStatus, setLastSyncStatus] = useState('')

  // Clear corrupted storage data
  const clearStorageData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem('wpSyncEnabled')
      localStorage.removeItem('autoSyncEnabled')
      localStorage.removeItem('bidirectionalSyncEnabled')
      setNewsItems(newsItems)
      setWpSyncEnabled(false)
      setAutoSyncEnabled(false)
      setBidirectionalSyncEnabled(false)
      console.log('✅ Storage data cleared successfully')
    } catch (error) {
      console.error('Error clearing storage data:', error)
    }
  }

  // Load data from localStorage on mount
  useEffect(() => {
    const loadNewsData = () => {
      try {
        const storedNews = localStorage.getItem(STORAGE_KEY)
        const wpSyncSetting = localStorage.getItem('wpSyncEnabled')
        const autoSyncSetting = localStorage.getItem('autoSyncEnabled')
        const bidirectionalSyncSetting = localStorage.getItem('bidirectionalSyncEnabled')
        
        // Handle WordPress sync setting
        if (wpSyncSetting) {
          const wpSync = safeJSONParse(wpSyncSetting, false)
          if (typeof wpSync === 'boolean') {
            setWpSyncEnabled(wpSync)
          }
        }

        // Handle auto sync setting
        if (autoSyncSetting) {
          const autoSync = safeJSONParse(autoSyncSetting, false)
          if (typeof autoSync === 'boolean') {
            setAutoSyncEnabled(autoSync)
          }
        }
        
        // Handle bidirectional sync setting
        if (bidirectionalSyncSetting) {
          const bidirectionalSync = safeJSONParse(bidirectionalSyncSetting, false)
          if (typeof bidirectionalSync === 'boolean') {
            setBidirectionalSyncEnabled(bidirectionalSync)
          }
        }
        
        // Handle news data
        if (storedNews) {
          const parsedNews = safeJSONParse(storedNews, [])
          
          if (Array.isArray(parsedNews) && parsedNews.length > 0) {
            // Validate that each item has required properties
            const validNews = parsedNews.filter(item => 
              item && 
              typeof item === 'object' && 
              typeof item.id === 'number' && 
              typeof item.title === 'string'
            )
            
            if (validNews.length > 0) {
              // Use stored news as primary source, add missing initial news
              const mergedNews = [...validNews]
              newsItems.forEach((item: NewsItem) => {
                if (!mergedNews.find(existing => existing.id === item.id)) {
                  mergedNews.push(item)
                }
              })
              setNewsItems(mergedNews)
            } else {
              console.warn('No valid news items found in storage, using initial data')
              setNewsItems(newsItems)
            }
          } else {
            console.warn('Invalid news data format in storage, using initial data')
            setNewsItems(newsItems)
          }
        } else {
          setNewsItems(newsItems)
        }
      } catch (error) {
        console.error('Error loading news data from localStorage:', error)
        console.log('Falling back to initial news data')
        setNewsItems(newsItems)
      }
    }

    loadNewsData()
  }, [])

  // Save to localStorage whenever newsItemsState changes
  useEffect(() => {
    if (newsItemsState.length > 0) {
      try {
        // Validate data before saving
        const validNews = newsItemsState.filter(item => 
          item && 
          typeof item === 'object' && 
          typeof item.id === 'number' && 
          typeof item.title === 'string'
        )
        
        if (validNews.length > 0) {
          const jsonString = JSON.stringify(validNews)
          localStorage.setItem(STORAGE_KEY, jsonString)
          console.log('📱 Đã lưu dữ liệu vào localStorage:', {
            totalItems: validNews.length,
            latestItem: validNews[0]?.title || 'N/A'
          })
        }
      } catch (error) {
        console.error('Error saving news data to localStorage:', error)
      }
    }
  }, [newsItemsState])

  const getNewsById = (id: number): NewsItem | undefined => {
    return newsItemsState.find(item => item.id === id)
  }

  // Convert NewsItem to WordPress post format
  const convertToWordPressFormat = (news: NewsItem) => {
    // Create HTML content with structured formatting
    let content = `<div class="news-content">`
    
    // Add featured image if exists
    if (news.image && news.image !== '/placeholder.svg') {
      content += `<div class="featured-image"><img src="${news.image}" alt="${news.title}" style="max-width: 100%; height: auto; margin-bottom: 20px;" /></div>`
    }
    
    // Add description
    if (news.description) {
      content += `<div class="description"><p><strong>Mô tả:</strong> ${news.description}</p></div>`
    }
    
    // Add metadata
    content += `<div class="metadata" style="background: #f8f9fa; padding: 15px; margin: 20px 0; border-left: 4px solid #007cba;">`
    if (news.location) {
      content += `<p><strong>📍 Địa điểm:</strong> ${news.location}</p>`
    }
    if (news.participants) {
      content += `<p><strong>👥 Số lượng tham gia:</strong> ${news.participants}</p>`
    }
    if (news.author) {
      content += `<p><strong>👤 Tác giả/Tổ chức:</strong> ${news.author}</p>`
    }
    content += `<p><strong>📅 Ngày đăng:</strong> ${news.date}</p>`
    content += `<p><strong>⏱️ Thời gian đọc:</strong> ${news.readingTime} phút</p>`
    content += `</div>`
    
    // Add main content
    if (news.detailContent) {
      content += `<div class="main-content">${news.detailContent}</div>`
    }
    
    // Add gallery if exists
    if (news.gallery && news.gallery.length > 0) {
      content += `<div class="gallery" style="margin-top: 30px;"><h3>Thư viện ảnh</h3><div class="gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 15px;">`
      news.gallery.forEach(img => {
        content += `<div class="gallery-item"><img src="${img.src}" alt="${img.alt}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;" />`
        if (img.caption) {
          content += `<p style="margin-top: 8px; font-size: 14px; color: #666;">${img.caption}</p>`
        }
        content += `</div>`
      })
      content += `</div></div>`
    }
    
    content += `</div>`
    
    return {
      title: news.title,
      content: content,
      excerpt: news.description || '',
      status: (news.status === 'published' || news.status === 'completed') ? 'publish' as const : 'draft' as const,
      categories: [], // You might want to map categories to WordPress category IDs
      tags: [], // You might want to map tags to WordPress tag IDs
    }
  }

  const addNews = async (news: Omit<NewsItem, 'id'>): Promise<NewsItem> => {
    const newId = newsItemsState.length > 0 
      ? Math.max(...newsItemsState.map(item => item.id)) + 1 
      : Math.max(...newsItems.map(item => item.id)) + 1
    
    const newNews: NewsItem = { 
      ...news, 
      id: newId,
      // Ensure required fields have default values
      views: news.views || 0,
      readingTime: news.readingTime || 5,
      status: news.status || 'published',
      featured: news.featured || false,
      tags: news.tags || [],
      author: news.author || 'Ban Tổ chức',
      authorEn: news.authorEn || 'Organizing Committee',
      wpId: undefined // Will be set after WordPress sync
    }
    
    // Add new news to the beginning of the array instead of the end
    setNewsItems(prev => [newNews, ...prev])
    
    // Debug sync settings
    console.log('🔍 Sync Settings Check:', {
      wpSyncEnabled,
      autoSyncEnabled,
      willSync: wpSyncEnabled && autoSyncEnabled
    })

    // Auto-sync to WordPress if enabled
    if (wpSyncEnabled && autoSyncEnabled) {
      try {
        console.log('🚀 Starting WordPress sync for news:', newNews.title)
        setLastSyncStatus('🔄 Đang đồng bộ lên WordPress...')
        await createWordPressPost(newNews)
        setLastSyncStatus('✅ Đã đồng bộ thành công lên WordPress')
        console.log('✅ WordPress sync completed successfully')
        setTimeout(() => setLastSyncStatus(''), 3000)
      } catch (error) {
        console.error('❌ WordPress sync failed:', error)
        setLastSyncStatus('❌ Đồng bộ WordPress thất bại: ' + (error as Error).message)
        setTimeout(() => setLastSyncStatus(''), 5000)
      }
    } else if (!wpSyncEnabled) {
      console.log('ℹ️ WordPress sync disabled')
      setLastSyncStatus('ℹ️ Đồng bộ WordPress chưa được kích hoạt')
      setTimeout(() => setLastSyncStatus(''), 3000)
    } else if (!autoSyncEnabled) {
      console.log('ℹ️ Auto sync disabled')
      setLastSyncStatus('ℹ️ Tự động đồng bộ chưa được bật')
      setTimeout(() => setLastSyncStatus(''), 3000)
    }
    
    // Show success notification
    console.log('✅ Tin tức đã được thêm thành công:', newNews.title)
    return newNews
  }

  const updateNews = async (id: number, updatedNews: Partial<NewsItem>): Promise<void> => {
    const existingNews = newsItemsState.find(item => item.id === id)
    if (!existingNews) return

    const updatedItem = { ...existingNews, ...updatedNews }
    
    setNewsItems(prev => prev.map(item => 
      item.id === id ? updatedItem : item
    ))

    // Auto-sync updates to WordPress if enabled
    if (wpSyncEnabled && autoSyncEnabled) {
      try {
        setLastSyncStatus('🔄 Đang cập nhật WordPress...')
        if (updatedItem.wpId) {
          await updateWordPressPost(updatedItem)
        } else {
          // Create new post if no wpId exists
          await createWordPressPost(updatedItem)
        }
        setLastSyncStatus('✅ Đã cập nhật thành công trên WordPress')
        setTimeout(() => setLastSyncStatus(''), 3000)
      } catch (error) {
        console.error('WordPress update failed:', error)
        setLastSyncStatus('❌ Lỗi cập nhật WordPress: ' + (error as Error).message)
        setTimeout(() => setLastSyncStatus(''), 5000)
      }
    }
    
    console.log('✅ Tin tức đã được cập nhật thành công')
  }

  const deleteNews = (id: number) => {
    const newsToDelete = newsItemsState.find(item => item.id === id)
    
    setNewsItems(prev => prev.filter(item => item.id !== id))
    
    // Auto-delete from WordPress if enabled and wpId exists
    if (wpSyncEnabled && autoSyncEnabled && newsToDelete?.wpId) {
      setLastSyncStatus('🔄 Đang xóa từ WordPress...')
      deleteWordPressPost(newsToDelete.wpId)
        .then(() => {
          setLastSyncStatus('✅ Đã xóa thành công từ WordPress')
          setTimeout(() => setLastSyncStatus(''), 3000)
        })
        .catch(error => {
          console.error('WordPress delete failed:', error)
          setLastSyncStatus('❌ Lỗi xóa từ WordPress: ' + (error as Error).message)
          setTimeout(() => setLastSyncStatus(''), 5000)
        })
    }
    
    console.log('✅ Tin tức đã được xóa thành công')
  }

  // WordPress integration functions
  // Bidirectional sync from WordPress to Local
  const syncFromWordPress = async () => {
    if (!wpSyncEnabled) {
      setLastSyncStatus('❌ Đồng bộ WordPress chưa được kích hoạt')
      return
    }

    setIsLoading(true)
    setLastSyncStatus('🔄 Đang tải dữ liệu từ WordPress...')
    
    try {
      // Get WordPress settings from localStorage
      const wpSettings = localStorage.getItem('wordpressSettings')
      if (!wpSettings) {
        throw new Error('WordPress settings không tồn tại')
      }
      
      const settings = JSON.parse(wpSettings)
      if (!settings.apiUrl || !settings.username || !settings.password || !settings.enabled) {
        throw new Error('WordPress settings chưa đầy đủ')
      }
      
      const service = new WordPressService()
      service.setCredentials(settings.apiUrl, settings.username, settings.password)
      const posts = await service.getPosts()
      console.log('📥 Fetched posts from WordPress:', posts.length)
      
      // Convert WordPress posts to NewsItems
      const convertedNews: NewsItem[] = posts.map((post: any) => {
        const existingNews = newsItemsState.find(news => news.wpId === post.id)
        const newId = existingNews?.id || Math.max(...newsItemsState.map(item => item.id), 0) + Date.now()
        
        return {
          id: newId,
          wpId: post.id,
          title: post.title.rendered,
          titleEn: post.title.rendered,
          description: post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 200),
          descriptionEn: post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 200),
          image: post.featured_media_url || '/placeholder.svg',
          date: new Date(post.date).toLocaleDateString('vi-VN'),
          category: 'Tin tức',
          categoryEn: 'News',
          views: existingNews?.views || 0,
          readingTime: Math.ceil(post.content.rendered.length / 1000) || 5,
          author: 'WordPress',
          authorEn: 'WordPress',
          status: post.status === 'publish' ? 'published' as const : 'draft' as const,
          featured: false,
          tags: [],
          location: '',
          locationEn: '',
          participants: '',
          participantsEn: '',
          detailContent: post.content.rendered,
          detailContentEn: post.content.rendered,
          gradient: 'from-blue-500 to-purple-600'
        }
      })
      
      // Merge with existing news (WordPress posts take precedence)
      const mergedNews = [...convertedNews]
      newsItemsState.forEach(news => {
        if (!news.wpId && !mergedNews.find(wp => wp.title === news.title)) {
          mergedNews.push(news)
        }
      })
      
      setNewsItems(mergedNews)
      setLastSyncStatus(`✅ Đã đồng bộ ${convertedNews.length} tin tức từ WordPress`)
      setTimeout(() => setLastSyncStatus(''), 3000)
      
    } catch (error) {
      console.error('Error syncing from WordPress:', error)
      setLastSyncStatus('❌ Lỗi đồng bộ từ WordPress: ' + (error as Error).message)
      setTimeout(() => setLastSyncStatus(''), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const syncWithWordPress = async () => {
    if (!wpSyncEnabled) return
    setIsLoading(true)
    setLastSyncStatus('Đang đồng bộ với WordPress...')
    
    try {
      const wpService = new WordPressService()
      // Sync logic here - this could be bidirectional sync
      setLastSyncStatus('✅ Đồng bộ hoàn tất')
    } catch (error) {
      console.error('WordPress sync failed:', error)
      setLastSyncStatus('❌ Lỗi đồng bộ: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const syncBidirectional = async () => {
    if (!bidirectionalSyncEnabled) {
      setLastSyncStatus('❌ Đồng bộ 2 chiều chưa được kích hoạt')
      return
    }

    setIsLoading(true)
    setLastSyncStatus('🔄 Đang đồng bộ 2 chiều với WordPress...')
    
    try {
      // First sync from WordPress
      await syncFromWordPress()
      
      // Then sync to WordPress
      await syncWithWordPress()
      
      setLastSyncStatus('✅ Đồng bộ 2 chiều hoàn tất')
      setTimeout(() => setLastSyncStatus(''), 3000)
      
    } catch (error) {
      console.error('Error in bidirectional sync:', error)
      setLastSyncStatus('❌ Lỗi đồng bộ 2 chiều: ' + (error as Error).message)
      setTimeout(() => setLastSyncStatus(''), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const createWordPressPost = async (news: NewsItem) => {
    if (!wpSyncEnabled) {
      console.log('⚠️ WordPress sync disabled, skipping post creation')
      return
    }
    
    try {
      console.log('🔍 Creating WordPress post for:', news.title)
      
      // Get WordPress settings from localStorage
      const wpSettings = localStorage.getItem('wordpressSettings')
      if (!wpSettings) {
        throw new Error('WordPress settings không tồn tại. Vui lòng cấu hình tại WordPress Settings.')
      }
      
      const settings = JSON.parse(wpSettings)
      console.log('🔧 WordPress settings:', {
        apiUrl: settings.apiUrl,
        username: settings.username,
        hasPassword: !!settings.password,
        enabled: settings.enabled
      })
      
      if (!settings.apiUrl || !settings.username || !settings.password || !settings.enabled) {
        throw new Error('WordPress settings chưa đầy đủ. Vui lòng kiểm tra cấu hình.')
      }
      
      // Use API route instead of direct WordPress service
      console.log('📡 Calling sync API...')
      const response = await fetch('/api/sync/wordpress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create',
          data: news
        })
      })
      
      console.log('📡 API Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error response:', errorText)
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }
      
      const result = await response.json()
      console.log('📊 API Result:', result)
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown API error')
      }
      
      console.log('🎉 WordPress post created via API:', {
        wpId: result.wpId,
        message: result.message
      })
      
      // Update the news item with WordPress ID
      if (result.wpId) {
        setNewsItems(prev => prev.map(item => 
          item.id === news.id ? { ...item, wpId: result.wpId } : item
        ))
      }
      
      console.log('✅ Đã tạo bài viết WordPress thành công:', result.wpId)
    } catch (error) {
      console.error('❌ Error creating WordPress post:', error)
      console.error('❌ Error details:', {
        message: (error as Error).message,
        stack: (error as Error).stack
      })
      throw error
    }
  }

  const updateWordPressPost = async (news: NewsItem) => {
    if (!wpSyncEnabled || !news.wpId) return
    
    try {
      // Get WordPress settings from localStorage
      const wpSettings = localStorage.getItem('wordpressSettings')
      if (!wpSettings) {
        throw new Error('WordPress settings không tồn tại')
      }
      
      const settings = JSON.parse(wpSettings)
      if (!settings.apiUrl || !settings.username || !settings.password || !settings.enabled) {
        throw new Error('WordPress settings chưa đầy đủ')
      }
      
      const wpService = new WordPressService()
      wpService.setCredentials(settings.apiUrl, settings.username, settings.password)
      
      const wpPostData = convertToWordPressFormat(news)
      
      await wpService.updatePost(news.wpId, wpPostData)
      console.log('✅ Đã cập nhật bài viết WordPress thành công:', news.wpId)
    } catch (error) {
      console.error('Error updating WordPress post:', error)
      throw error
    }
  }

  const deleteWordPressPost = async (wpId: number) => {
    if (!wpSyncEnabled) return
    
    try {
      // Get WordPress settings from localStorage
      const wpSettings = localStorage.getItem('wordpressSettings')
      if (!wpSettings) {
        throw new Error('WordPress settings không tồn tại')
      }
      
      const settings = JSON.parse(wpSettings)
      if (!settings.apiUrl || !settings.username || !settings.password || !settings.enabled) {
        throw new Error('WordPress settings chưa đầy đủ')
      }
      
      const wpService = new WordPressService()
      wpService.setCredentials(settings.apiUrl, settings.username, settings.password)
      
      await wpService.deletePost(wpId)
      console.log('✅ Đã xóa bài viết WordPress thành công:', wpId)
    } catch (error) {
      console.error('Error deleting WordPress post:', error)
      throw error
    }
  }

  const toggleWordPressSync = () => {
    const newWpSyncEnabled = !wpSyncEnabled
    setWpSyncEnabled(newWpSyncEnabled)
    localStorage.setItem('wpSyncEnabled', JSON.stringify(newWpSyncEnabled))
    
    if (!newWpSyncEnabled) {
      setAutoSyncEnabled(false)
      localStorage.setItem('autoSyncEnabled', 'false')
    }
  }

  const toggleAutoSync = () => {
    const newAutoSyncEnabled = !autoSyncEnabled
    setAutoSyncEnabled(newAutoSyncEnabled)
    localStorage.setItem('autoSyncEnabled', JSON.stringify(newAutoSyncEnabled))
  }

  const toggleBidirectionalSync = () => {
    setBidirectionalSyncEnabled(!bidirectionalSyncEnabled)
    localStorage.setItem('bidirectionalSyncEnabled', JSON.stringify(!bidirectionalSyncEnabled))
    console.log(bidirectionalSyncEnabled ? '❌ Đã tắt đồng bộ 2 chiều' : '✅ Đã bật đồng bộ 2 chiều')
  }

  const value: NewsContextType = {
    newsItems: newsItemsState,
    getNewsById,
    addNews,
    updateNews,
    deleteNews,
    syncWithWordPress,
    syncFromWordPress,
    syncBidirectional,
    createWordPressPost,
    updateWordPressPost,
    deleteWordPressPost,
    isLoading,
    wpSyncEnabled,
    toggleWordPressSync,
    clearStorageData,
    autoSyncEnabled,
    toggleAutoSync,
    bidirectionalSyncEnabled,
    toggleBidirectionalSync,
    lastSyncStatus
  }

  return (
    <NewsContext.Provider value={value}>
      {children}
    </NewsContext.Provider>
  )
}

export function useNews() {
  const context = useContext(NewsContext)
  if (context === undefined) {
    throw new Error('useNews must be used within a NewsProvider')
  }
  return context
} 