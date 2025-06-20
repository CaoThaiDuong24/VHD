import { useEffect, useRef, useState, useCallback } from 'react'
import { useNews } from '@/contexts/NewsContext'

interface AutoSyncConfig {
  interval: number // in milliseconds
  enabled: boolean
  onSuccess?: (result: any) => void
  onError?: (error: Error) => void
  onSyncStart?: () => void
  onSyncEnd?: () => void
}

interface SyncStatus {
  isActive: boolean
  lastSync: Date | null
  nextSync: Date | null
  syncCount: number
  errorCount: number
  lastError: string | null
}

export function useAutoSync(config: AutoSyncConfig = {
  interval: 5 * 60 * 1000, // 5 minutes default
  enabled: false
}) {
  const { syncFromWordPress, isLoading } = useNews()
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isActive: false,
    lastSync: null,
    nextSync: null,
    syncCount: 0,
    errorCount: 0,
    lastError: null
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastSyncTimeRef = useRef<string | null>(null)
  const isInitializedRef = useRef(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Load last sync time from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const lastSyncTime = localStorage.getItem('lastWordPressSync')
        if (lastSyncTime) {
          lastSyncTimeRef.current = lastSyncTime
          setSyncStatus(prev => ({
            ...prev,
            lastSync: new Date(lastSyncTime)
          }))
        }
      } catch (error) {
        console.error('Failed to load last sync time:', error)
      }
    }
  }, [])

  // Auto sync function with throttling
  const performAutoSync = useCallback(async () => {
    if (isLoading || syncStatus.isActive) {
      console.log('🔄 Sync already in progress, skipping auto sync')
      return
    }

    // Throttle rapid calls
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(async () => {
      try {
        console.log('🚀 Starting auto sync with WordPress...')
        
        setSyncStatus(prev => ({ ...prev, isActive: true, lastError: null }))
        config.onSyncStart?.()

        // Call incremental sync API
        const response = await fetch('/api/sync/wordpress?action=fetch-updated&since=' + 
          (lastSyncTimeRef.current || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()))
        
        if (!response.ok) {
          throw new Error(`Sync API error: ${response.status}`)
        }

        const result = await response.json()
        
        if (result.success) {
          // Update local context if new data found
          if (result.data && result.data.length > 0) {
            console.log(`📥 Found ${result.data.length} updated posts from WordPress`)
            await syncFromWordPress()
          } else {
            console.log('✅ WordPress sync: No new updates')
          }

          // Update sync status
          const now = new Date()
          lastSyncTimeRef.current = now.toISOString()
          
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('lastWordPressSync', now.toISOString())
            } catch (error) {
              console.error('Failed to save last sync time:', error)
            }
          }
          
          setSyncStatus(prev => ({
            ...prev,
            isActive: false,
            lastSync: now,
            nextSync: new Date(now.getTime() + config.interval),
            syncCount: prev.syncCount + 1,
            lastError: null
          }))

          config.onSuccess?.(result)
          console.log('✅ Auto sync completed successfully')
        } else {
          throw new Error(result.error || 'Unknown sync error')
        }

      } catch (error) {
        console.error('❌ Auto sync failed:', error)
        
        setSyncStatus(prev => ({
          ...prev,
          isActive: false,
          errorCount: prev.errorCount + 1,
          lastError: (error as Error).message
        }))

        config.onError?.(error as Error)
      } finally {
        config.onSyncEnd?.()
      }
    }, 1000) // 1 second throttle
  }, [config, syncFromWordPress, isLoading, syncStatus.isActive])

  // Start auto sync with initialization check
  const startAutoSync = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    if (config.enabled && config.interval > 0 && !isInitializedRef.current) {
      console.log(`🔄 Starting auto sync every ${config.interval / 1000 / 60} minutes`)
      isInitializedRef.current = true
      
      // Set up recurring sync (no initial sync to prevent spam)
      intervalRef.current = setInterval(performAutoSync, config.interval)
      
      setSyncStatus(prev => ({
        ...prev,
        nextSync: new Date(Date.now() + config.interval)
      }))
    }
  }, [config.enabled, config.interval, performAutoSync])

  // Stop auto sync
  const stopAutoSync = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
      console.log('⏹️ Auto sync stopped')
      
      setSyncStatus(prev => ({
        ...prev,
        nextSync: null
      }))
    }
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
    
    isInitializedRef.current = false
  }, [])

  // Manual sync trigger
  const triggerManualSync = useCallback(async () => {
    await performAutoSync()
  }, [performAutoSync])

  // Effect to handle config changes
  useEffect(() => {
    if (config.enabled) {
      startAutoSync()
    } else {
      stopAutoSync()
    }

    return () => {
      stopAutoSync()
    }
  }, [config.enabled, config.interval]) // Remove startAutoSync, stopAutoSync từ deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return {
    syncStatus,
    startAutoSync,
    stopAutoSync,
    triggerManualSync,
    isAutoSyncActive: !!intervalRef.current
  }
} 