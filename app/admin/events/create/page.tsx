"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Calendar, Check, AlertCircle, Upload, X, ImageIcon, Cloud, CloudOff, CheckCircle, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useEvents } from '@/contexts/EventsContext'

export default function CreateEventPage() {
  const router = useRouter()
  const { 
    addEvent, 
    wpSyncEnabled, 
    autoSyncEnabled, 
    lastSyncStatus 
  } = useEvents()
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [imagePreview, setImagePreview] = useState<string>('')
  
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    date: '',
    time: '09:00',
    location: '',
    locationEn: '',
    maxParticipants: '',
    registrationDeadline: '',
    eventType: 'conference',
    gradient: 'from-blue-500 to-cyan-500',
    image: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const showNotification = (message: string, type: 'success' | 'error') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 5000)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData(prev => ({
          ...prev,
          image: result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview('')
    setFormData(prev => ({
      ...prev,
      image: ''
    }))
  }

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description) {
      showNotification('Vui lòng điền ít nhất tiêu đề và mô tả để lưu nháp', 'error')
      return
    }

    setIsLoading(true)
    
    try {
      const eventData = {
        title: formData.title,
        titleEn: formData.titleEn,
        description: formData.description,
        descriptionEn: formData.descriptionEn,
        date: formData.date || new Date().toISOString().split('T')[0],
        time: formData.time,
        location: formData.location || 'Chưa xác định',
        locationEn: formData.locationEn,
        participants: formData.maxParticipants ? `${formData.maxParticipants}+ người tham gia` : '50+ người tham gia',
        participantsEn: formData.maxParticipants ? `${formData.maxParticipants}+ participants` : '50+ participants',
        status: 'upcoming' as const,
        gradient: formData.gradient,
        views: 0,
        registrations: 0,
        image: formData.image || '/placeholder.svg',
        category: formData.eventType === 'conference' ? 'Hội thảo' :
                 formData.eventType === 'workshop' ? 'Đào tạo' :
                 formData.eventType === 'exhibition' ? 'Triển lãm' :
                 formData.eventType === 'training' ? 'Đào tạo' : 'Seminar',
        categoryEn: formData.eventType === 'conference' ? 'Conference' :
                   formData.eventType === 'workshop' ? 'Workshop' :
                   formData.eventType === 'exhibition' ? 'Exhibition' :
                   formData.eventType === 'training' ? 'Training' : 'Seminar'
      }

      await addEvent(eventData)
      showNotification('✅ Sự kiện đã được lưu nháp thành công!', 'success')
      
      // Reset form
      setFormData({
        title: '',
        titleEn: '',
        description: '',
        descriptionEn: '',
        date: '',
        time: '09:00',
        location: '',
        locationEn: '',
        maxParticipants: '',
        registrationDeadline: '',
        eventType: 'conference',
        gradient: 'from-blue-500 to-cyan-500',
        image: ''
      })
      setImagePreview('')
      
    } catch (error) {
      console.error('Error saving draft event:', error)
      showNotification('❌ Có lỗi xảy ra khi lưu nháp', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.date || !formData.location) {
      showNotification('❌ Vui lòng điền đầy đủ thông tin bắt buộc (tiêu đề, mô tả, ngày, địa điểm)', 'error')
      return
    }

    setIsLoading(true)
    
    try {
      const eventData = {
        title: formData.title,
        titleEn: formData.titleEn,
        description: formData.description,
        descriptionEn: formData.descriptionEn,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        locationEn: formData.locationEn,
        participants: formData.maxParticipants ? `${formData.maxParticipants}+ người tham gia` : '50+ người tham gia',
        participantsEn: formData.maxParticipants ? `${formData.maxParticipants}+ participants` : '50+ participants',
        status: 'upcoming' as const,
        gradient: formData.gradient,
        views: 0,
        registrations: 0,
        image: formData.image || '/placeholder.svg',
        category: formData.eventType === 'conference' ? 'Hội thảo' :
                 formData.eventType === 'workshop' ? 'Đào tạo' :
                 formData.eventType === 'exhibition' ? 'Triển lãm' :
                 formData.eventType === 'training' ? 'Đào tạo' : 'Seminar',
        categoryEn: formData.eventType === 'conference' ? 'Conference' :
                   formData.eventType === 'workshop' ? 'Workshop' :
                   formData.eventType === 'exhibition' ? 'Exhibition' :
                   formData.eventType === 'training' ? 'Training' : 'Seminar'
      }

      await addEvent(eventData)
      showNotification('🎉 Sự kiện đã được xuất bản thành công!', 'success')
      
      // Redirect to events list after a delay
      setTimeout(() => {
        router.push('/admin/events')
      }, 2000)
      
    } catch (error) {
      console.error('Error creating event:', error)
      showNotification('❌ Có lỗi xảy ra khi tạo sự kiện', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg border transition-all duration-500 transform ${
          showToast ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } ${
          toastType === 'success' 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800' 
            : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              toastType === 'success' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {toastType === 'success' ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{toastMessage}</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/admin/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tạo sự kiện mới</h1>
            <p className="text-gray-600">Điền thông tin để tạo sự kiện sắp diễn ra</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Đang lưu...' : 'Lưu nháp'}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Đang xuất bản...' : 'Xuất bản'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Tên sự kiện (Tiếng Việt) *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Nhập tên sự kiện"
                  required
                />
              </div>

              <div>
                <Label htmlFor="titleEn">Tên sự kiện (English)</Label>
                <Input
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={(e) => handleInputChange('titleEn', e.target.value)}
                  placeholder="Enter event name in English"
                />
              </div>

              <div>
                <Label htmlFor="eventType">Loại sự kiện</Label>
                <select
                  id="eventType"
                  value={formData.eventType}
                  onChange={(e) => handleInputChange('eventType', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="conference">Hội thảo</option>
                  <option value="workshop">Workshop</option>
                  <option value="exhibition">Triển lãm</option>
                  <option value="training">Đào tạo</option>
                  <option value="seminar">Seminar</option>
                </select>
              </div>

              <div>
                <Label htmlFor="description">Mô tả sự kiện (Tiếng Việt) *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Nhập mô tả chi tiết về sự kiện"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="descriptionEn">Mô tả sự kiện (English)</Label>
                <Textarea
                  id="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={(e) => handleInputChange('descriptionEn', e.target.value)}
                  placeholder="Enter event description in English"
                  rows={4}
                />
              </div>

              {/* Image Upload */}
              <div>
                <Label>Hình ảnh sự kiện</Label>
                <div className="mt-2">
                  {imagePreview ? (
                    <div className="relative">
                      <div className="relative w-full h-48 rounded-lg border border-gray-300 overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Event preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600 mb-2">Nhấp để tải lên hình ảnh</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('imageUpload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Chọn hình ảnh
                      </Button>
                      <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết sự kiện</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Ngày tổ chức *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Giờ bắt đầu</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Địa điểm (Tiếng Việt) *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Nhập địa điểm tổ chức sự kiện"
                  required
                />
              </div>

              <div>
                <Label htmlFor="locationEn">Địa điểm (English)</Label>
                <Input
                  id="locationEn"
                  value={formData.locationEn}
                  onChange={(e) => handleInputChange('locationEn', e.target.value)}
                  placeholder="Enter event location in English"
                />
              </div>

              <div>
                <Label htmlFor="maxParticipants">Số lượng tham gia tối đa</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                  placeholder="Ví dụ: 300"
                />
              </div>

              <div>
                <Label htmlFor="registrationDeadline">Hạn đăng ký</Label>
                <Input
                  id="registrationDeadline"
                  type="date"
                  value={formData.registrationDeadline}
                  onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                />
              </div>

              <div>
                <Label>Màu chủ đề</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { value: 'from-blue-500 to-cyan-500', label: 'Xanh dương', preview: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
                    { value: 'from-green-500 to-emerald-500', label: 'Xanh lá', preview: 'bg-gradient-to-r from-green-500 to-emerald-500' },
                    { value: 'from-purple-500 to-pink-500', label: 'Tím hồng', preview: 'bg-gradient-to-r from-purple-500 to-pink-500' },
                    { value: 'from-amber-500 to-orange-500', label: 'Cam vàng', preview: 'bg-gradient-to-r from-amber-500 to-orange-500' },
                    { value: 'from-red-500 to-rose-500', label: 'Đỏ', preview: 'bg-gradient-to-r from-red-500 to-rose-500' },
                    { value: 'from-indigo-500 to-blue-500', label: 'Indigo', preview: 'bg-gradient-to-r from-indigo-500 to-blue-500' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('gradient', option.value)}
                      className={`
                        p-2 rounded-lg border-2 transition-all duration-200
                        ${formData.gradient === option.value 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className={`h-4 w-full rounded ${option.preview} mb-1`}></div>
                      <p className="text-xs text-gray-600">{option.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* WordPress Sync Status */}
        {(wpSyncEnabled || autoSyncEnabled) && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Cloud className="w-5 h-5" />
                Trạng thái đồng bộ WordPress - Sự kiện
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-700">Đồng bộ WordPress:</span>
                  {wpSyncEnabled ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Đã bật
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">
                      <CloudOff className="w-3 h-3" />
                      Đã tắt
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-700">Tự động đồng bộ:</span>
                  {autoSyncEnabled ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      <Zap className="w-3 h-3" />
                      Tự động
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                      Thủ công
                    </span>
                  )}
                </div>
              </div>
              
              {lastSyncStatus && (
                <div className="bg-white p-3 rounded-lg border border-blue-200 mt-4">
                  <p className="text-sm font-medium text-blue-700 mb-1">Trạng thái gần nhất:</p>
                  <p className="text-sm text-blue-600">{lastSyncStatus}</p>
                </div>
              )}
              
              {wpSyncEnabled && autoSyncEnabled && (
                <div className="bg-blue-100 p-3 rounded-lg mt-4">
                  <p className="text-sm text-blue-800">
                    ✨ <strong>Tự động đồng bộ đã bật:</strong> Sự kiện sẽ được tự động tạo trên WordPress sau khi lưu thành công.
                  </p>
                </div>
              )}
              
              {wpSyncEnabled && !autoSyncEnabled && (
                <div className="bg-yellow-100 p-3 rounded-lg mt-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ <strong>Đồng bộ thủ công:</strong> Bạn cần vào trang cài đặt WordPress để đồng bộ thủ công.
                  </p>
                </div>
              )}
              
              {!wpSyncEnabled && (
                <div className="bg-gray-100 p-3 rounded-lg mt-4">
                  <p className="text-sm text-gray-700">
                    💡 <strong>Đồng bộ WordPress đã tắt:</strong> Vào trang cài đặt WordPress để bật tính năng đồng bộ.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  )
} 