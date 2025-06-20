// Global Auto-Sync Manager - Singleton Pattern
class GlobalAutoSyncManager {
  private static instance: GlobalAutoSyncManager | null = null
  private intervalId: NodeJS.Timeout | null = null
  private isActive: boolean = false
  private lastSyncTime: string | null = null
  private config: {
    interval: number
    enabled: boolean
  } = {
    interval: 10 * 60 * 1000, // 10 minutes default
    enabled: false
  }

  private constructor() {
    // Load config from localStorage
    this.loadConfig()
  }

  public static getInstance(): GlobalAutoSyncManager {
    if (!GlobalAutoSyncManager.instance) {
      GlobalAutoSyncManager.instance = new GlobalAutoSyncManager()
    }
    return GlobalAutoSyncManager.instance
  }

  private loadConfig() {
    if (typeof window !== 'undefined') {
      try {
        const enabled = localStorage.getItem('autoSyncEnabled')
        const interval = localStorage.getItem('autoSyncInterval')
        const lastSync = localStorage.getItem('lastWordPressSync')
        
        if (enabled) {
          this.config.enabled = JSON.parse(enabled)
        }
        
        if (interval) {
          this.config.interval = parseInt(interval) * 60 * 1000 // Convert minutes to ms
        }
        
        if (lastSync) {
          this.lastSyncTime = lastSync
        }
      } catch (error) {
        console.error('Failed to load auto-sync config:', error)
      }
    }
  }

  private saveConfig() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('autoSyncEnabled', JSON.stringify(this.config.enabled))
        localStorage.setItem('autoSyncInterval', String(this.config.interval / 60 / 1000))
        if (this.lastSyncTime) {
          localStorage.setItem('lastWordPressSync', this.lastSyncTime)
        }
      } catch (error) {
        console.error('Failed to save auto-sync config:', error)
      }
    }
  }

  private async performSync() {
    if (this.isActive) {
      console.log('🔄 Auto-sync already in progress, skipping...')
      return
    }

    try {
      this.isActive = true
      console.log('🚀 Global auto-sync started...')

      const since = this.lastSyncTime || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const response = await fetch(`/api/sync/wordpress?action=fetch-updated&since=${since}`)
      
      if (!response.ok) {
        throw new Error(`Sync API error: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        if (result.data && result.data.length > 0) {
          console.log(`📥 Global sync found ${result.data.length} updated posts`)
          
          // Trigger news context update
          const event = new CustomEvent('wordpressSync', { 
            detail: { posts: result.data } 
          })
          window.dispatchEvent(event)
        } else {
          console.log('✅ Global sync: No new updates')
        }

        // Update last sync time
        const now = new Date().toISOString()
        this.lastSyncTime = now
        this.saveConfig()
        
        console.log('✅ Global auto-sync completed')
      } else {
        throw new Error(result.error || 'Unknown sync error')
      }

    } catch (error) {
      console.error('❌ Global auto-sync failed:', error)
    } finally {
      this.isActive = false
    }
  }

  public start() {
    if (this.intervalId) {
      this.stop()
    }

    if (this.config.enabled && this.config.interval > 0) {
      console.log(`🔄 Starting global auto-sync every ${this.config.interval / 1000 / 60} minutes`)
      
      // Set up recurring sync
      this.intervalId = setInterval(() => {
        this.performSync()
      }, this.config.interval)
      
      console.log('✅ Global auto-sync started')
    }
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      console.log('⏹️ Global auto-sync stopped')
    }
  }

  public updateConfig(newConfig: Partial<typeof this.config>) {
    const oldEnabled = this.config.enabled
    
    this.config = { ...this.config, ...newConfig }
    this.saveConfig()
    
    // Restart if enabled state changed
    if (oldEnabled !== this.config.enabled) {
      if (this.config.enabled) {
        this.start()
      } else {
        this.stop()
      }
    }
  }

  public getStatus() {
    return {
      enabled: this.config.enabled,
      interval: this.config.interval,
      isActive: this.isActive,
      lastSyncTime: this.lastSyncTime,
      isRunning: !!this.intervalId
    }
  }

  public async triggerManualSync() {
    await this.performSync()
  }
}

// Export singleton instance
export const globalAutoSyncManager = GlobalAutoSyncManager.getInstance()

// Auto-start if enabled
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const manager = GlobalAutoSyncManager.getInstance()
      if (manager.getStatus().enabled) {
        manager.start()
      }
    })
  } else {
    const manager = GlobalAutoSyncManager.getInstance()
    if (manager.getStatus().enabled) {
      manager.start()
    }
  }
} 