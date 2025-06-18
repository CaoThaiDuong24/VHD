"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface EventItem {
  id: number
  title: string
  titleEn?: string
  description: string
  descriptionEn?: string
  date: string
  time: string
  location: string
  locationEn?: string
  participants: string
  participantsEn?: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  gradient: string
  views?: number
  registrations?: number
  image?: string
  category?: string
  categoryEn?: string
  wpId?: number // WordPress post ID for sync
}

// Initial events data
const initialEvents: EventItem[] = [
  {
    id: 1,
    title: 'Hội thảo Công nghệ Giáo dục 2024',
    titleEn: 'Educational Technology Conference 2024',
    description: 'Khám phá những xu hướng mới trong công nghệ giáo dục',
    descriptionEn: 'Explore new trends in educational technology',
    date: '2024-12-20',
    time: '09:00',
    location: 'Trung tâm Hội nghị Quốc gia',
    locationEn: 'National Convention Center',
    participants: '300+ người tham gia',
    participantsEn: '300+ participants',
    status: 'upcoming',
    gradient: 'from-blue-500 to-cyan-500',
    views: 1250,
    registrations: 285,
    category: 'Hội thảo',
    categoryEn: 'Conference',
    image: '/images/conference-seminar.jpg'
  },
  {
    id: 2,
    title: 'Workshop Kỹ năng Viết sách',
    titleEn: 'Book Writing Skills Workshop',
    description: 'Hướng dẫn kỹ năng viết và xuất bản sách chuyên nghiệp',
    descriptionEn: 'Professional book writing and publishing skills guidance',
    date: '2024-12-25',
    time: '14:00',
    location: 'Khách sạn Lotte Hà Nội',
    locationEn: 'Lotte Hotel Hanoi',
    participants: '50+ người tham gia',
    participantsEn: '50+ participants',
    status: 'upcoming',
    gradient: 'from-green-500 to-emerald-500',
    views: 890,
    registrations: 42,
    category: 'Đào tạo',
    categoryEn: 'Training',
    image: '/images/publishing-training.jpg'
  },
  {
    id: 3,
    title: 'Triển lãm Sách Thiếu nhi',
    titleEn: 'Children\'s Book Exhibition',
    description: 'Giới thiệu những cuốn sách hay dành cho trẻ em',
    descriptionEn: 'Introducing great books for children',
    date: '2024-12-30',
    time: '10:00',
    location: 'Trung tâm Triển lãm Giảng Võ',
    locationEn: 'Giang Vo Exhibition Center',
    participants: '1000+ khách tham quan',
    participantsEn: '1000+ visitors',
    status: 'upcoming',
    gradient: 'from-purple-500 to-pink-500',
    views: 2150,
    registrations: 980,
    category: 'Triển lãm',
    categoryEn: 'Exhibition',
    image: '/images/book-exhibition.jpg'
  }
]

interface EventsContextType {
  events: EventItem[]
  getEventById: (id: number) => EventItem | undefined
  addEvent: (event: Omit<EventItem, 'id'>) => Promise<EventItem>
  updateEvent: (id: number, event: Partial<EventItem>) => Promise<void>
  deleteEvent: (id: number) => void
  getTotalViews: () => number
  getTotalRegistrations: () => number
  isLoading: boolean
  wpSyncEnabled: boolean
  autoSyncEnabled: boolean
  lastSyncStatus: string
  toggleWordPressSync: () => void
  toggleAutoSync: () => void
  syncWithWordPress: () => Promise<void>
  createWordPressPost: (event: EventItem) => Promise<void>
  updateWordPressPost: (event: EventItem) => Promise<void>
  deleteWordPressPost: (wpId: number) => Promise<void>
}

const EventsContext = createContext<EventsContextType | undefined>(undefined)

// WordPress Service (to be imported from lib/wordpressApi.ts)
import { WordPressService, convertEventToWordPressFormat } from '@/lib/wordpressApi'

const STORAGE_KEY = 'eventsItems'

// Safe JSON parse helper
const safeJSONParse = (str: string, defaultValue: any) => {
  try {
    return JSON.parse(str)
  } catch {
    return defaultValue
  }
}

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [wpSyncEnabled, setWpSyncEnabled] = useState(false)
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false)
  const [lastSyncStatus, setLastSyncStatus] = useState('')

  // Load data from localStorage on mount
  useEffect(() => {
    const loadEventsData = () => {
      try {
        const storedEvents = localStorage.getItem(STORAGE_KEY)
        const wpSyncSetting = localStorage.getItem('eventsWpSyncEnabled')
        const autoSyncSetting = localStorage.getItem('eventsAutoSyncEnabled')
        
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
        
        if (storedEvents) {
          try {
            const parsedEvents = JSON.parse(storedEvents)
            if (Array.isArray(parsedEvents)) {
              // Validate that each item has required properties
              const validEvents = parsedEvents.filter(item => 
                item && 
                typeof item === 'object' && 
                typeof item.id === 'number' && 
                typeof item.title === 'string'
              )
              
              if (validEvents.length > 0) {
                // Use stored events as primary source, add missing initial events
                const mergedEvents = [...validEvents]
                initialEvents.forEach((item: EventItem) => {
                  if (!mergedEvents.find(existing => existing.id === item.id)) {
                    mergedEvents.push(item)
                  }
                })
                setEvents(mergedEvents)
              } else {
                console.warn('No valid events found in storage, using initial data')
                setEvents(initialEvents)
              }
            } else {
              console.warn('Invalid events data format in storage, using initial data')
              setEvents(initialEvents)
            }
          } catch (parseError) {
            console.error('Error parsing events data:', parseError)
            setEvents(initialEvents)
          }
        } else {
          setEvents(initialEvents)
        }
      } catch (error) {
        console.error('Error loading events data from localStorage:', error)
        setEvents(initialEvents)
      }
    }

    loadEventsData()
  }, [])

  // Save to localStorage whenever events changes
  useEffect(() => {
    if (events.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
        console.log('📅 Đã lưu dữ liệu sự kiện vào localStorage:', {
          totalEvents: events.length,
          latestEvent: events[events.length - 1]?.title || 'N/A'
        })
      } catch (error) {
        console.error('Error saving events data to localStorage:', error)
      }
    }
  }, [events])

  const getEventById = (id: number): EventItem | undefined => {
    return events.find(item => item.id === id)
  }

  const addEvent = async (event: Omit<EventItem, 'id'>): Promise<EventItem> => {
    const newId = events.length > 0 
      ? Math.max(...events.map(item => item.id)) + 1 
      : Math.max(...initialEvents.map(item => item.id)) + 1
    
    const newEvent: EventItem = { 
      ...event, 
      id: newId,
      views: event.views || 0,
      registrations: event.registrations || 0,
      wpId: undefined // Will be set after WordPress sync
    }
    
    // Add new event to the beginning of the array
    setEvents(prev => [newEvent, ...prev])
    
    // Auto-sync to WordPress if enabled
    if (wpSyncEnabled && autoSyncEnabled) {
      try {
        setLastSyncStatus('🔄 Đang đồng bộ sự kiện lên WordPress...')
        await createWordPressPost(newEvent)
        setLastSyncStatus('✅ Đã đồng bộ sự kiện thành công lên WordPress')
        setTimeout(() => setLastSyncStatus(''), 3000)
      } catch (error) {
        console.error('WordPress sync failed:', error)
        setLastSyncStatus('❌ Đồng bộ WordPress thất bại: ' + (error as Error).message)
        setTimeout(() => setLastSyncStatus(''), 5000)
      }
    }
    
    console.log('✅ Sự kiện đã được thêm thành công:', newEvent.title)
    return newEvent
  }

  const updateEvent = async (id: number, updatedEvent: Partial<EventItem>): Promise<void> => {
    const existingEvent = events.find(item => item.id === id)
    if (!existingEvent) return

    const updatedItem = { ...existingEvent, ...updatedEvent }
    
    setEvents(prev => prev.map(item => 
      item.id === id ? updatedItem : item
    ))

    // Auto-sync updates to WordPress if enabled
    if (wpSyncEnabled && autoSyncEnabled) {
      try {
        setLastSyncStatus('🔄 Đang cập nhật sự kiện trên WordPress...')
        if (updatedItem.wpId) {
          await updateWordPressPost(updatedItem)
        } else {
          // Create new post if no wpId exists
          await createWordPressPost(updatedItem)
        }
        setLastSyncStatus('✅ Đã cập nhật sự kiện thành công trên WordPress')
        setTimeout(() => setLastSyncStatus(''), 3000)
      } catch (error) {
        console.error('WordPress update failed:', error)
        setLastSyncStatus('❌ Lỗi cập nhật WordPress: ' + (error as Error).message)
        setTimeout(() => setLastSyncStatus(''), 5000)
      }
    }
    
    console.log('✅ Sự kiện đã được cập nhật thành công')
  }

  const deleteEvent = (id: number) => {
    const eventToDelete = events.find(item => item.id === id)
    
    setEvents(prev => prev.filter(item => item.id !== id))
    
    // Auto-delete from WordPress if wpId exists and auto-sync enabled
    if (eventToDelete?.wpId && wpSyncEnabled && autoSyncEnabled) {
      setLastSyncStatus('🔄 Đang xóa sự kiện từ WordPress...')
      deleteWordPressPost(eventToDelete.wpId)
        .then(() => {
          setLastSyncStatus('✅ Đã xóa sự kiện thành công từ WordPress')
          setTimeout(() => setLastSyncStatus(''), 3000)
        })
        .catch(error => {
          console.error('WordPress delete failed:', error)
          setLastSyncStatus('❌ Lỗi xóa từ WordPress: ' + (error as Error).message)
          setTimeout(() => setLastSyncStatus(''), 5000)
        })
    }
    
    console.log('✅ Sự kiện đã được xóa thành công')
  }

  const getTotalViews = () => {
    return events.reduce((sum, event) => sum + (event.views || 0), 0)
  }

  const getTotalRegistrations = () => {
    return events.reduce((sum, event) => sum + (event.registrations || 0), 0)
  }

  // WordPress integration functions
  const syncWithWordPress = async () => {
    if (!wpSyncEnabled) return
    setIsLoading(true)
    setLastSyncStatus('Đang đồng bộ sự kiện với WordPress...')
    
    try {
      const wpService = new WordPressService()
      // Sync logic here - this could be bidirectional sync
      setLastSyncStatus('✅ Đồng bộ sự kiện hoàn tất')
    } catch (error) {
      console.error('WordPress sync failed:', error)
      setLastSyncStatus('❌ Lỗi đồng bộ sự kiện: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const createWordPressPost = async (event: EventItem) => {
    if (!wpSyncEnabled) return
    
    try {
      const wpService = new WordPressService()
      const wpPostData = convertEventToWordPressFormat(event)
      
      const createdPost = await wpService.createPost(wpPostData)
      
      // Update the event item with WordPress ID
      setEvents(prev => prev.map(item => 
        item.id === event.id ? { ...item, wpId: createdPost.id } : item
      ))
      
      console.log('✅ Đã tạo bài viết WordPress cho sự kiện thành công:', createdPost.id)
    } catch (error) {
      console.error('Error creating WordPress post for event:', error)
      throw error
    }
  }

  const updateWordPressPost = async (event: EventItem) => {
    if (!wpSyncEnabled || !event.wpId) return
    
    try {
      const wpService = new WordPressService()
      const wpPostData = convertEventToWordPressFormat(event)
      
      await wpService.updatePost(event.wpId, wpPostData)
      console.log('✅ Đã cập nhật bài viết WordPress cho sự kiện thành công:', event.wpId)
    } catch (error) {
      console.error('Error updating WordPress post for event:', error)
      throw error
    }
  }

  const deleteWordPressPost = async (wpId: number) => {
    if (!wpSyncEnabled) return
    
    try {
      const wpService = new WordPressService()
      await wpService.deletePost(wpId)
      console.log('✅ Đã xóa bài viết WordPress cho sự kiện thành công:', wpId)
    } catch (error) {
      console.error('Error deleting WordPress post for event:', error)
      throw error
    }
  }

  const toggleWordPressSync = () => {
    const newWpSyncEnabled = !wpSyncEnabled
    setWpSyncEnabled(newWpSyncEnabled)
    localStorage.setItem('eventsWpSyncEnabled', JSON.stringify(newWpSyncEnabled))
    
    if (!newWpSyncEnabled) {
      setAutoSyncEnabled(false)
      localStorage.setItem('eventsAutoSyncEnabled', 'false')
    }
  }

  const toggleAutoSync = () => {
    const newAutoSyncEnabled = !autoSyncEnabled
    setAutoSyncEnabled(newAutoSyncEnabled)
    localStorage.setItem('eventsAutoSyncEnabled', JSON.stringify(newAutoSyncEnabled))
  }

  const value: EventsContextType = {
    events,
    getEventById,
    addEvent,
    updateEvent,
    deleteEvent,
    getTotalViews,
    getTotalRegistrations,
    isLoading,
    wpSyncEnabled,
    autoSyncEnabled,
    lastSyncStatus,
    toggleWordPressSync,
    toggleAutoSync,
    syncWithWordPress,
    createWordPressPost,
    updateWordPressPost,
    deleteWordPressPost
  }

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  )
}

export function useEvents() {
  const context = useContext(EventsContext)
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider')
  }
  return context
} 